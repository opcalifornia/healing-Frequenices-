/**
 * Draws a real photograph of Earth on a sphere with WebGL2: no 3D library, one full-screen shader. It uses the same
 * orthographic maths as the vector layer drawn on top (globeMath.ts), so borders, highlights and labels line up.
 * Imagery: NASA Visible Earth, Blue Marble Next Generation with topography and bathymetry (public domain).
 */

export type EarthLook = "satellite" | "relief";

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uCenter;   // lon0, lat0 in radians
uniform float uR;       // globe radius in pixels
uniform float uMode;    // 0 satellite, 1 relief
uniform float uTexW;
uniform sampler2D uTex;
out vec4 outColor;
const float PI = 3.14159265359;

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uR;
  float rho = length(p);
  vec3 col = vec3(0.0);
  float alpha = 0.0;

  if (rho <= 1.0) {
    float c = asin(min(rho, 1.0));
    float sinc = sin(c);
    float cosc = cos(c);
    float lat0 = uCenter.y;
    float lat = asin(clamp(cosc * sin(lat0) + (rho > 0.0 ? p.y * sinc * cos(lat0) / rho : 0.0), -1.0, 1.0));
    float lon = uCenter.x + atan(p.x * sinc, rho * cos(lat0) * cosc - p.y * sin(lat0) * sinc);
    vec2 uv = vec2(fract((lon + PI) / (2.0 * PI)), (PI * 0.5 - lat) / PI);

    float pixelAngle = 1.0 / (uR * max(0.05, cosc));
    float stretch = min(8.0, 1.0 / max(0.12, cos(lat)));
    float lod = max(0.0, log2(max(1.0, uTexW * pixelAngle / (2.0 * PI) * stretch)));
    vec3 tex = textureLod(uTex, uv, lod).rgb;

    vec3 n = vec3(p.x, p.y, cosc);
    vec3 L = normalize(vec3(-0.42, 0.46, 0.78));
    float diff = max(dot(n, L), 0.0);

    float lum = dot(tex, vec3(0.299, 0.587, 0.114));
    if (uMode < 0.5) {
      // Satellite photo, sunlit from the upper left, darker toward the edge, with a blue rim.
      vec3 t = pow(tex, vec3(0.88));
      t = mix(vec3(dot(t, vec3(0.299, 0.587, 0.114))), t, 1.22);
      float shade = 0.58 + 0.56 * diff;
      col = t * shade * (0.74 + 0.26 * cosc);
      col += vec3(0.20, 0.42, 0.95) * pow(1.0 - cosc, 3.2) * 0.55;
    } else {
      // Relief: land as mid greys with the terrain shading showing, dark ocean, so borders and pins stand out.
      float water = smoothstep(0.015, 0.16, tex.b - max(tex.r, tex.g * 0.92));
      float land = 0.26 + 1.0 * lum;
      float sea = 0.058 + 0.035 * lum;
      float g = clamp(mix(land, sea, water), 0.0, 1.0);
      float shade = 0.62 + 0.52 * diff;
      col = vec3(g) * shade * vec3(1.0, 0.99, 0.96) * (0.70 + 0.30 * cosc);
      col += vec3(0.5, 0.52, 0.58) * pow(1.0 - cosc, 3.0) * 0.16;
    }
    alpha = 1.0;
    // Soft edge so the limb isn't jagged.
    alpha = smoothstep(1.0, 0.994, rho);
  } else if (rho < 1.2) {
    // Atmosphere glow just outside the limb.
    float k = 1.0 - (rho - 1.0) / 0.2;
    float a = pow(clamp(k, 0.0, 1.0), 3.2) * (uMode < 0.5 ? 0.62 : 0.22);
    col = (uMode < 0.5 ? vec3(0.36, 0.62, 1.0) : vec3(0.72, 0.76, 0.85)) * a;
    alpha = a;
  }
  outColor = vec4(col * alpha, alpha);
}`;

export interface EarthRenderer {
  render(opts: { lonDeg: number; latDeg: number; radiusPx: number; width: number; height: number; look: EarthLook }): void;
  dispose(): void;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader error");
  return sh;
}

/** Create the renderer, or reject when WebGL2 or the picture isn't available (the caller then falls back to the simple globe). */
export async function createEarthRenderer(canvas: HTMLCanvasElement, imageUrl: string): Promise<EarthRenderer> {
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false, preserveDrawingBuffer: false }) as WebGL2RenderingContext | null;
  if (!gl) throw new Error("WebGL2 is not available");
  const img = new Image();
  img.decoding = "async";
  img.src = imageUrl;
  await img.decode();

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link error");
  gl.useProgram(prog);

  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const loc = { res: u("uRes"), center: u("uCenter"), r: u("uR"), mode: u("uMode"), texW: u("uTexW"), tex: u("uTex") };
  gl.uniform1i(loc.tex, 0);
  gl.uniform1f(loc.texW, img.naturalWidth);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.disable(gl.DEPTH_TEST);

  return {
    render({ lonDeg, latDeg, radiusPx, width, height, look }) {
      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(loc.res, width, height);
      gl.uniform2f(loc.center, (lonDeg * Math.PI) / 180, (latDeg * Math.PI) / 180);
      gl.uniform1f(loc.r, radiusPx);
      gl.uniform1f(loc.mode, look === "relief" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteTexture(tex);
      gl.deleteProgram(prog);
      gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
