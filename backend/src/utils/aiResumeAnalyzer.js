import fs from "fs/promises";
import path from "path";

const stripCodeFence = (s = "") =>
  s
    .replace(/^\s*```(?:json)?/i, "")
    .replace(/```\s*$/i, "")
    .trim();

const normalize = (v) =>
  String(v || "")
    .trim()
    .toLowerCase();

const fallbackAnalysis = (requiredSkills = [], resumeText = "", extraSkills = []) => {
  const required = [...new Set((requiredSkills || []).map(normalize).filter(Boolean))];
  const haystack = normalize(resumeText) + " " + (extraSkills || []).map(normalize).join(" ");
  const matched = required.filter((s) => haystack.includes(s));
  const missing = required.filter((s) => !matched.includes(s));
  const score = required.length === 0 ? 0 : Math.round((matched.length / required.length) * 100);
  const cap = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    score,
    matchedSkills: matched.map(cap),
    missingSkills: missing.map(cap),
    summary: "Heuristic match generated locally (Gemini API unavailable).",
    recommendation:
      score >= 70
        ? "Strong fit based on skill keywords."
        : score >= 40
        ? "Partial fit — candidate may need upskilling."
        : "Limited match against required skills.",
  };
};

export const extractResumeText = async (filePath) => {
  if (!filePath) return "";
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const buf = await fs.readFile(filePath);
      const data = await pdfParse(buf);
      return (data.text || "").trim();
    }
    if (ext === ".docx") {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ path: filePath });
      return (result.value || "").trim();
    }
    if (ext === ".doc") {
      // .doc (binary) — best-effort: return empty so user falls back to pasted text.
      return "";
    }
    return "";
  } catch (err) {
    console.error("Resume text extraction failed:", err.message);
    return "";
  }
};

export const analyzeWithGemini = async ({
  resumeText = "",
  jobTitle = "",
  jobDescription = "",
  requiredSkills = [],
  extraSkills = [],
}) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    console.warn("GEMINI_API_KEY missing — using fallback analyzer.");
    return fallbackAnalysis(requiredSkills, resumeText, extraSkills);
  }
  if (!resumeText || resumeText.length < 20) {
    return fallbackAnalysis(requiredSkills, resumeText, extraSkills);
  }

  const prompt = `You are an AI Resume Analyzer. Compare the candidate resume with the job description and required skills.
Return ONLY valid JSON (no prose, no markdown fences) matching exactly:
{
  "score": <integer 0-100>,
  "matchedSkills": [<strings>],
  "missingSkills": [<strings>],
  "summary": "<2-3 sentence summary of candidate fit>",
  "recommendation": "<one sentence hiring recommendation>"
}

Job Title: ${jobTitle}
Required Skills: ${(requiredSkills || []).join(", ") || "N/A"}
Job Description:
${jobDescription || "N/A"}

Candidate Resume:
${resumeText.slice(0, 12000)}

Candidate Extra Skills (self-reported): ${(extraSkills || []).join(", ") || "N/A"}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini API HTTP error:", res.status, text.slice(0, 200));
      return fallbackAnalysis(requiredSkills, resumeText, extraSkills);
    }

    const data = await res.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";
    const cleaned = stripCodeFence(text);
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Try to grab first {...} block
      const m = cleaned.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }

    if (!parsed || typeof parsed.score !== "number") {
      return fallbackAnalysis(requiredSkills, resumeText, extraSkills);
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(parsed.score))),
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills : [],
      summary: String(parsed.summary || ""),
      recommendation: String(parsed.recommendation || ""),
    };
  } catch (err) {
    console.error("Gemini analyzer error:", err.message);
    return fallbackAnalysis(requiredSkills, resumeText, extraSkills);
  }
};
