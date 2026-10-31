// One place to change every agent's model. Ids are Vercel AI Gateway strings (<provider>/<model>),
// so routing, credentials, and fallbacks stay on the gateway and no provider SDK is wired in.
// Each agent.ts reads its entry here (model: MODELS.<agent>) instead of hardcoding a string.
export const MODELS = {
  analyst: "google/gemini-2.5-flash",
  classifier: "openai/gpt-oss-120b",
  implementer: "google/gemini-2.5-flash", // the strongest coding model the AI Gateway free tier allows
  orchestrator: "google/gemini-2.5-flash",
  researcher: "google/gemini-2.5-flash",
  reviewer: "openai/gpt-oss-120b", // different vendor than implementer on purpose: independent review
} as const;

export type FactoryAgent = keyof typeof MODELS;
