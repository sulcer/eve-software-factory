---
description: "Drafting release notes or a changelog entry from merged pull requests on the factory repository. Use this skill when asked to write release notes, a changelog, or a summary of what shipped since a date, tag, or number of pull requests. Not needed for summarizing a single issue or reviewing an open pull request."
---
# Release Notes

How to turn merged pull requests into release notes a user of the project can read in a minute. Load the writing-quality skill too, since this is prose for humans.

## 1. Collect the right pull requests

- List closed pull requests on the factory repository, newest first, and keep only the merged ones. A closed pull request that never merged did not ship.
- Respect the range you were given: a count ("the last 5"), a date ("since October 1"), or a tag. If no range was given, use the pull requests merged since the latest release tag, and say which range you used.
- Skip pull requests that change nothing a user sees: dependency bumps, CI config, release automation. Mention them in one closing line ("Plus 3 maintenance updates") instead of listing them.
- Read each pull request's title, description, and changed files before describing it. Never describe a change from its title alone.

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
- Credit outside contributors by GitHub handle; leave out the maintainers' own names.

## 4. Deliver

- Return the notes as Markdown in your reply. Don't publish a release, push a tag, or edit a file unless asked to, and if asked, treat it as a write that follows the normal approval rules.
- End with the range covered and the number of pull requests read, so the reader can check nothing was missed.
