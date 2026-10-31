---
description: "Drafting release notes or a changelog entry from merged pull requests on the factory repository. Use this skill when asked to write release notes, a changelog, or a summary of what shipped since a date or over the last few pull requests. Not needed for summarizing a single issue or reviewing an open pull request."
---
# Release Notes

How to turn merged pull requests into release notes a user of the project can read in a minute. Load the writing-quality skill too, since this is prose for humans.

## 1. Collect the right pull requests

- Find merged pull requests with an issue search on the factory repository using `is:pr is:merged`, adding `merged:>=YYYY-MM-DD` for a date range. Listing pull requests is not enough: that list orders by creation date and doesn't say which ones merged.
- Respect the range you were given: a count ("the last 5") or a date ("since October 1"). For a count, read the candidates and keep the ones with the latest merge dates. If no range was given, use the last 10 merged pull requests.
- Always state the range you used, including the oldest and newest merge dates you covered, so the reader can check it.
- Skip pull requests that change nothing a user sees: dependency bumps, CI config, release automation. Mention them in one closing line ("Plus 3 maintenance updates") instead of listing them.
- Read each pull request's full context (description, changed files, merge date) before describing it. Never describe a change from its title alone.

## 2. Group by what users notice

Use these headings, in this order, and drop any that would be empty:

- New: features and capabilities that did not exist before.
- Improved: existing behavior that got better, faster, or clearer.
- Fixed: bugs that no longer happen. Describe the symptom the user saw, not the code that changed.
- Breaking: anything that needs action on upgrade. Put the required action first.

## 3. Write each entry

- One line per change, starting with a verb in the past tense: "Added", "Fixed", "Removed".
- Say what changed for the user, then link the pull request by number, like (#42).
- Merge several pull requests into one line when they deliver one change.

## 4. Deliver

- Return the notes as Markdown in your reply. Don't open issues or pull requests with them unless the requester asks.
- End with the range covered and the number of pull requests read.
