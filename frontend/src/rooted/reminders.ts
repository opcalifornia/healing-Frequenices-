/**
 * Daily reminders as calendar events with an alarm. Works today on every
 * phone, even when the app is closed; push notifications come with the
 * native app.
 */

export interface Reminder {
  time: string; // "HH:MM"
  title: string;
  note: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function remindersIcs(reminders: Reminder[], url: string, now = new Date()): string {
  const ymd = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const events = reminders.flatMap((r, i) => {
    const [h, m] = r.time.split(":").map(Number);
    const end = h * 60 + m + 5;
    return [
      "BEGIN:VEVENT",
      `UID:rooted-breathe-${ymd}-${i}-${r.time.replace(":", "")}@rooted`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${ymd}T${pad(h)}${pad(m)}00`,
      `DTEND:${ymd}T${pad(Math.floor(end / 60) % 24)}${pad(end % 60)}00`,
      "RRULE:FREQ=DAILY",
      `SUMMARY:${r.title}`,
      `DESCRIPTION:${r.note} Open Rooted: ${url}`,
      `URL:${url}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${r.title}`,
      "TRIGGER:PT0M",
      "END:VALARM",
      "END:VEVENT",
    ];
  });
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Rooted//Breathe reminders//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n") + "\r\n";
}
