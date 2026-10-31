import { connect } from "@vercel/connect/eve";
import { defineMcpClientConnection } from "eve/connections";
import { once } from "eve/tools/approval";

/**
 * Shadows `@onkernel/eve-extension`'s built-in `browser` connection.
 *
 * @remarks
 * - `once()` parks each browser tool on an approval card the first time a
 *   session calls it; after an explicit approval, later calls to that tool in
 *   the same session run without one. A denial leaves it gated.
 * - The allowlist restates the extension's seven defaults, so tools the KERNEL
 *   server adds later stay hidden until listed here. `browser_curl`,
 *   `manage_credentials`, `exec_command`, and `manage_browser_pools` stay out
 *   on purpose: raw HTTP, stored credentials, and shell access widen the blast
 *   radius, and without `manage_credentials` a person completes every sign-in.
 */
export default defineMcpClientConnection({
  approval: once(),
  auth: connect("kernel/kernel-mcp"),
  description:
    "KERNEL cloud browser: create and manage browser sessions, run Playwright against a live page, and drive it with mouse, keyboard, and screenshots.",
  tools: {
    allow: [
      "manage_browsers",
      "execute_playwright_code",
      "computer_action",
      "manage_auth_connections",
      "manage_profiles",
      "manage_proxies",
      "manage_replays",
    ],
  },
  url: "https://mcp.onkernel.com/mcp",
});
