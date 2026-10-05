import { env } from "../config/env";
import { prisma } from "../prisma/client";
import { HttpError } from "../utils/httpError";
import { memo } from "./memoCache";

export type ChatTurn = { role: "user" | "assistant"; text: string };

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

/** Facts the assistant may use, pulled from published CMS content. */
const loadChurchFacts = () =>
  memo("chat:facts", 5 * 60 * 1000, async () => {
    const now = new Date();
    const [settings, events, notices, ministries, schedule] = await Promise.all([
      prisma.siteSetting.findMany(),
      prisma.event.findMany({
        where: { status: "PUBLISHED", date: { gte: new Date(now.getTime() - 86400000) } },
        orderBy: { date: "asc" },
        take: 10
      }),
      prisma.notice.findMany({
        where: {
          status: "PUBLISHED",
          publishDate: { lte: now },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
        },
        orderBy: [{ pinned: "desc" }, { publishDate: "desc" }],
        take: 10
      }),
      prisma.ministry.findMany({ where: { status: "PUBLISHED" }, orderBy: { sortOrder: "asc" } }),
      prisma.scheduleItem.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }]
      })
    ]);
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const s = Object.fromEntries(settings.map((x) => [x.key, x.value]));
    const lines = [
      `Church: EMLR Kicukiro Parish (Eglise Methodiste Libre au Rwanda / Itorero Methodiste Libre mu Rwanda), ${s.address ?? "Kicukiro, Kigali"}.`,
      `Phone: ${s.phone ?? "-"}. Email: ${s.email ?? "-"}.`,
      `Sunday services: ${s.sundayService1 ?? "-"} and ${s.sundayService2 ?? "-"}. Wednesday service: ${s.wednesdayService ?? "-"}.`,
      `In Kinyarwanda say exactly: Ku Cyumweru ${s.sundayService1Rw ?? ""} na ${s.sundayService2Rw ?? ""}; ku wa Gatatu ${s.wednesdayServiceRw ?? ""}.`,
      "Website pages: /about, /about/location (map & contacts), /ministries, /events, /amatangazo (weekly programme, calendar and announcements), /news, /tv, /give (donation accounts), /prayer-requests, /volunteer.",
      "Upcoming events:",
      ...(events.length
        ? events.map((e) => `- ${fmtDate(e.date)}: ${e.title} (${e.time}${e.location ? `, ${e.location}` : ""})`)
        : ["- none published"]),
      "Current notices:",
      ...(notices.length ? notices.map((n) => `- ${fmtDate(n.publishDate)}: ${n.title} — ${n.body}`) : ["- none published"]),
      "Weekly programme (24-hour times):",
      ...(schedule.length
        ? schedule.map(
            (i) =>
              `- ${i.recurrence === "every" ? "Every" : `The ${i.recurrence}`} ${DAYS[i.dayOfWeek]} ${i.startTime}${
                i.endTime ? `-${i.endTime}` : ""
              }: ${i.title}${i.location ? ` (${i.location})` : ""}${i.leader ? `, led by ${i.leader}` : ""}`
          )
        : ["- none published"]),
      "Ministries and groups:",
      ...ministries.map((m) => `- ${m.name}: ${m.shortDescription}`)
    ];
    return lines.join("\n");
  });

const SYSTEM_RULES = `You are the website assistant of EMLR Kicukiro Parish, a Free Methodist church in Kigali, Rwanda.
Rules:
- Reply in the same language as the visitor (English or Kinyarwanda). Use correct, simple Kinyarwanda.
- Keep answers short: 1-4 sentences.
- Kinyarwanda times use the Rwandan clock. Copy the Kinyarwanda times given below exactly (for example "saa mbiri", "saa yine n’igice"). Never invent or borrow words such as "agasefti".
- When a page is useful, mention its path exactly as listed (for example /amatangazo); the website turns it into a link.
- For church facts (times, events, contacts, groups), use ONLY the facts below. If something is not listed, say you don't know and point to the phone number or the relevant page. Never invent dates, names, numbers or bank details.
- For faith questions, answer warmly and biblically from a Wesleyan/Methodist perspective, citing a Bible verse when helpful.
- Do not discuss politics or unrelated topics; gently bring the conversation back to the church.`;

const FALLBACK_MODELS = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest", "gemini-3.5-flash"];

type GeminiResponse = { candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[] };

const callModel = async (model: string, payload: string): Promise<string> => {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.geminiApiKey },
    signal: AbortSignal.timeout(15000),
    body: payload
  });
  if (!res.ok) throw new Error(`${model} responded ${res.status}`);
  const data = (await res.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts
    ?.filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text) throw new Error(`${model} returned no text`);
  return text;
};

export async function askAssistant(history: ChatTurn[]): Promise<string> {
  if (!env.geminiApiKey) throw new HttpError(503, "Assistant is not configured");
  const facts = await loadChurchFacts();
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: `${SYSTEM_RULES}\n\nChurch facts:\n${facts}` }] },
    contents: history.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.text }]
    })),
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 }
  });

  // Gemini models are intermittently overloaded (503/timeouts). Ask two models at once and
  // take the first good answer; if both fail, try the remaining ones in turn.
  const models = [env.geminiModel, ...FALLBACK_MODELS.filter((m) => m !== env.geminiModel)];
  const log = (err: unknown) => console.warn("Gemini:", err instanceof Error ? err.message : err);
  try {
    return await Promise.any(models.slice(0, 2).map((m) => callModel(m, payload)));
  } catch (err) {
    if (err instanceof AggregateError) err.errors.forEach(log);
  }
  for (const model of models.slice(2)) {
    try {
      return await callModel(model, payload);
    } catch (err) {
      log(err);
    }
  }
  throw new HttpError(502, "Assistant is unavailable right now");
}
