/**
 * Stick-figure poses for follow-along routines, in a 100 x 100 box with the
 * floor at y = 92. Each pose lists joint positions; the figure animates
 * between two poses to show the movement.
 */

export type Joint = "head" | "neck" | "mid" | "hip" | "le" | "lh" | "re" | "rh" | "lk" | "lf" | "rk" | "rf";
export type Pose = Record<Joint, [number, number]>;

const STAND: Pose = {
  head: [50, 13], neck: [50, 24], mid: [50, 38], hip: [50, 52],
  le: [44, 38], lh: [42, 52], re: [56, 38], rh: [58, 52],
  lk: [47, 72], lf: [46, 92], rk: [53, 72], rf: [54, 92],
};
const p = (over: Partial<Pose>, base: Pose = STAND): Pose => ({ ...base, ...over });
const shift = (pose: Pose, dx: number, dy: number): Pose =>
  Object.fromEntries(Object.entries(pose).map(([k, [x, y]]) => [k, [x + dx, y + dy]])) as Pose;

const ALL_FOURS: Pose = {
  head: [74, 58], neck: [66, 62], mid: [48, 58], hip: [32, 62],
  le: [66, 76], lh: [66, 91], re: [68, 76], rh: [68, 91],
  lk: [32, 90], lf: [14, 91], rk: [34, 90], rf: [16, 91],
};
const LYING: Pose = {
  head: [82, 85], neck: [72, 86], mid: [58, 86], hip: [44, 86],
  le: [60, 90], lh: [48, 91], re: [62, 90], rh: [50, 91],
  lk: [30, 86], lf: [14, 87], rk: [30, 87], rf: [14, 88],
};
const SEATED: Pose = {
  head: [50, 30], neck: [50, 41], mid: [50, 53], hip: [50, 64],
  le: [44, 54], lh: [44, 66], re: [56, 54], rh: [56, 66],
  lk: [44, 68], lf: [44, 92], rk: [56, 68], rf: [56, 92],
};
const SOFT: Pose = p({ hip: [50, 54], mid: [50, 39], lk: [46, 73], rk: [54, 73], lf: [44, 92], rf: [56, 92] });
const HORSE: Pose = p({ hip: [50, 60], mid: [50, 44], neck: [50, 30], head: [50, 19], lk: [36, 74], lf: [30, 92], rk: [64, 74], rf: [70, 92], le: [44, 44], lh: [44, 56], re: [56, 44], rh: [56, 56] });

export const POSES = {
  stand: STAND,
  reach: p({ le: [45, 14], lh: [43, 3], re: [55, 14], rh: [57, 3] }),
  reachTall: shift(p({ le: [45, 14], lh: [43, 3], re: [55, 14], rh: [57, 3], lf: [46, 88], rf: [54, 88] }), 0, -3),
  sideBend: p({ head: [42, 15], neck: [45, 25], mid: [48, 38], le: [39, 15], lh: [32, 7], re: [50, 13], rh: [41, 4] }),
  neckTilt: p({ head: [43, 16] }),
  neckTiltR: p({ head: [57, 16] }),
  shrug: p({ neck: [50, 21], head: [50, 11], le: [43, 34], lh: [42, 48], re: [57, 34], rh: [58, 48] }),
  fold: p({ head: [60, 80], neck: [58, 70], mid: [53, 60], hip: [46, 50], le: [58, 80], lh: [56, 90], re: [60, 80], rh: [58, 90], lk: [47, 71], lf: [47, 92], rk: [49, 71], rf: [49, 92] }),
  halfLift: p({ head: [72, 52], neck: [64, 54], mid: [56, 52], hip: [46, 50], le: [62, 66], lh: [62, 78], re: [64, 66], rh: [64, 78], lk: [47, 71], lf: [47, 92], rk: [49, 71], rf: [49, 92] }),
  calfUp: shift(p({ lf: [46, 88], rf: [54, 88] }), 0, -4),
  hipLeft: p({ hip: [45, 52], mid: [48, 38], lk: [44, 72], rk: [51, 72] }),
  hipRight: p({ hip: [55, 52], mid: [52, 38], lk: [49, 72], rk: [56, 72] }),
  cow: p({ mid: [48, 66], head: [76, 52], neck: [66, 60] }, ALL_FOURS),
  cat: p({ mid: [48, 50], head: [72, 68], neck: [66, 64] }, ALL_FOURS),
  child: { head: [70, 86], neck: [62, 82], mid: [48, 76], hip: [32, 80], le: [76, 87], lh: [90, 90], re: [77, 88], rh: [91, 91], lk: [42, 90], lf: [22, 91], rk: [44, 90], rf: [24, 91] } as Pose,
  dog: { head: [70, 76], neck: [64, 68], mid: [54, 54], hip: [44, 40], le: [70, 80], lh: [76, 91], re: [72, 80], rh: [78, 91], lk: [36, 66], lf: [28, 91], rk: [38, 66], rf: [30, 91] } as Pose,
  lunge: { head: [50, 26], neck: [50, 36], mid: [49, 50], hip: [48, 64], le: [52, 50], lh: [60, 62], re: [54, 50], rh: [62, 62], lk: [64, 70], lf: [66, 91], rk: [36, 90], rf: [20, 91] } as Pose,
  lungeReach: { head: [48, 24], neck: [49, 34], mid: [48, 49], hip: [47, 64], le: [48, 22], lh: [47, 11], re: [52, 22], rh: [52, 11], lk: [64, 70], lf: [66, 91], rk: [36, 90], rf: [20, 91] } as Pose,
  lying: LYING,
  bridge: p({ hip: [44, 68], mid: [58, 77], lk: [32, 62], lf: [26, 90], rk: [34, 63], rf: [28, 90] }, LYING),
  bridgeDown: p({ hip: [44, 86], mid: [58, 86], lk: [32, 66], lf: [26, 90], rk: [34, 67], rf: [28, 90] }, LYING),
  kneesLeft: p({ lk: [38, 72], lf: [26, 80], rk: [40, 74], rf: [28, 82] }, LYING),
  kneesRight: p({ lk: [34, 76], lf: [20, 84], rk: [36, 78], rf: [22, 86] }, LYING),
  legsUp: p({ hip: [42, 86], mid: [56, 86], lk: [42, 64], lf: [42, 42], rk: [44, 64], rf: [44, 42] }, LYING),
  figure4: p({ lk: [36, 64], lf: [30, 82], rk: [44, 66], rf: [36, 64], lh: [38, 68], le: [52, 78], rh: [40, 70], re: [54, 80] }, LYING),
  figure4Deep: p({ lk: [40, 60], lf: [34, 76], rk: [48, 62], rf: [40, 60], lh: [42, 64], le: [54, 74], rh: [44, 66], re: [56, 76] }, LYING),
  butterfly: p({ lk: [32, 82], lf: [46, 91], rk: [68, 82], rf: [54, 91], hip: [50, 82], mid: [50, 68], neck: [50, 54], head: [50, 43], le: [42, 70], lh: [47, 88], re: [58, 70], rh: [53, 88] }),
  butterflyFold: p({ lk: [32, 82], lf: [46, 91], rk: [68, 82], rf: [54, 91], hip: [50, 82], mid: [50, 72], neck: [50, 62], head: [50, 53], le: [42, 76], lh: [47, 89], re: [58, 76], rh: [53, 89] }),
  seated: SEATED,
  seatedTwist: p({ head: [56, 30], le: [52, 52], lh: [60, 60], re: [62, 50], rh: [66, 62] }, SEATED),
  seatedTwistR: p({ head: [44, 30], re: [48, 52], rh: [40, 60], le: [38, 50], lh: [34, 62] }, SEATED),
  chestOpen: p({ head: [50, 29], le: [40, 52], lh: [46, 64], re: [60, 52], rh: [54, 64] }, SEATED),
  seatedReach: p({ le: [45, 30], lh: [43, 18], re: [55, 30], rh: [57, 18] }, SEATED),
  wristStretch: p({ le: [42, 50], lh: [40, 46], re: [58, 50], rh: [60, 46] }, SEATED),
  wristStretch2: p({ le: [42, 50], lh: [38, 54], re: [58, 50], rh: [62, 54] }, SEATED),
  soft: SOFT,
  shiftLeft: p({ hip: [45, 54], mid: [47, 39], head: [48, 13], neck: [48, 24], lk: [42, 73], rk: [52, 72] }, SOFT),
  shiftRight: p({ hip: [55, 54], mid: [53, 39], head: [52, 13], neck: [52, 24], lk: [48, 72], rk: [58, 73] }, SOFT),
  cloudL: p({ le: [38, 30], lh: [40, 22], re: [56, 44], rh: [52, 54], head: [47, 13] }, SOFT),
  cloudR: p({ re: [62, 30], rh: [60, 22], le: [44, 44], lh: [48, 54], head: [53, 13] }, SOFT),
  pushOut: p({ le: [42, 32], lh: [36, 28], re: [58, 32], rh: [64, 28] }, SOFT),
  gather: p({ le: [42, 40], lh: [46, 32], re: [58, 40], rh: [54, 32] }, SOFT),
  heavens: p({ le: [44, 12], lh: [48, 2], re: [56, 12], rh: [52, 2], lf: [46, 89], rf: [54, 89] }),
  heavensDown: p({ le: [44, 40], lh: [48, 50], re: [56, 40], rh: [52, 50] }),
  bowLeft: p({ le: [32, 30], lh: [16, 29], re: [60, 34], rh: [54, 29], head: [44, 19] }, HORSE),
  bowRight: p({ re: [68, 30], rh: [84, 29], le: [40, 34], lh: [46, 29], head: [56, 19] }, HORSE),
  horse: HORSE,
  splitUp: p({ le: [46, 13], lh: [44, 2], re: [60, 42], rh: [66, 54] }),
  splitUpR: p({ re: [54, 13], rh: [56, 2], le: [40, 42], lh: [34, 54] }),
  owlL: p({ head: [44, 14], le: [42, 38], lh: [38, 52], re: [58, 38], rh: [62, 52] }),
  owlR: p({ head: [56, 14], le: [42, 38], lh: [38, 52], re: [58, 38], rh: [62, 52] }),
  walkA: p({ le: [46, 38], lh: [40, 50], re: [54, 38], rh: [60, 50], lk: [54, 71], lf: [58, 91], rk: [46, 72], rf: [40, 90] }),
  walkB: p({ le: [54, 38], lh: [60, 50], re: [46, 38], rh: [40, 50], lk: [46, 72], lf: [40, 90], rk: [54, 71], rf: [58, 91] }),
} satisfies Record<string, Pose>;

export type PoseName = keyof typeof POSES;
