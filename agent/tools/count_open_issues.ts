import { defineTool } from "eve/tools";
import { z } from "zod";
import { FACTORY_REPO } from "#lib/constants.js";
import { githubCredentials } from "#lib/github/credentials.js";
import { mintInstallationToken } from "#lib/github/git-remote.js";

/**
 * Tool that counts the open issues on the factory repository.
 *
 * @remarks
 * Uses GitHub's issue search rather than the repository's `open_issues_count`, which also counts
 * open pull requests. The repository comes from `FACTORY_REPO`, never from model input, and the
 * installation token is brokered by Vercel Connect per call. Read-only, so it needs no approval.
 */
export default defineTool({
  description:
    "Count the open issues (not pull requests) on the factory repository. Use it for questions " +
    "like how many issues are open or how big the backlog is.",
  /**
   * Count open issues on `FACTORY_REPO`.
   *
   * @param _input - No input.
   * @returns The `count` and whether GitHub's search timed out (`incomplete`), or an `error`
   *   without a count, so a failure can't read as zero open issues.
   */
  async execute() {
    try {
      const token = await mintInstallationToken(githubCredentials);
      const query = encodeURIComponent(`repo:${FACTORY_REPO} is:issue is:open`);
      const response = await fetch(
        `https://api.github.com/search/issues?q=${query}&per_page=1`,
        {
          headers: {
            accept: "application/vnd.github+json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      const body = (await response.json()) as {
        incomplete_results?: boolean;
        message?: string;
        total_count?: number;
      };
      if (!response.ok || body.total_count === undefined) {
        return {
          error: `GitHub search failed with status ${response.status}: ${body.message ?? "no message"}`,
        };
      }
      return {
        count: body.total_count,
        incomplete: body.incomplete_results === true,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Failed to count issues",
      };
    }
  },
  inputSchema: z.object({}),
  outputSchema: z.object({
    count: z.number().optional(),
    error: z.string().optional(),
    incomplete: z.boolean().optional(),
  }),
});
