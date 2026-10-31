import kernel from "@onkernel/eve-extension";

/**
 * KERNEL cloud browser for the orchestrator, mounted as an eve extension.
 *
 * @remarks
 * - Credentials are brokered per user by the Vercel Connect connector
 *   `kernel/kernel-mcp`; `KERNEL_API_KEY` stays unset, so no shared key can
 *   make every caller act as the whole KERNEL org.
 * - Mounted at the root only, never under `agent/subagents/`: stations run in
 *   task mode and cannot pause for consent, approval, or sign-in.
 * - `connections/browser.ts` shadows the extension's built-in `browser`
 *   connection to add the approval gate and pin the tool allowlist.
 */
export default kernel({ connect: "kernel/kernel-mcp" });
