---
sidebar_position: 2
title: "Code Contribution"
---

## Contribute Code to Apache BifroMQ (Incubating)

This guide will walk you through the process of proposing, developing, and submitting code changes to the project.

### 1. Find or Propose an Issue

Before writing any code, we recommend the following:

- **Check for Existing Issues:** Browse open issues in [GitHub Issues](https://github.com/apache/bifromq/issues) to see if someone is already working on the task.
- **Propose a New Issue:** If your idea is new, open an issue describing the problem or feature clearly. Include motivation, background, and potential approaches.

> For larger changes, it's a good idea to discuss your proposal on the [dev@bifromq.apache.org](mailto:dev@bifromq.apache.org) mailing list before starting implementation.

### 2. Work on the Code

Once an issue is assigned to you or you’ve received a green light from the community:

#### Clone the Repository

```bash
git clone https://github.com/apache/bifromq.git
cd bifromq
```

#### Follow Coding Guidelines

Please follow BifroMQ’s:

- Code style conventions (Java)
- Commit message format (`[Component] Description`)

> Tip: Include meaningful tests for your changes and ensure existing tests pass.

### 3. Submit a Pull Request (PR)

Once your changes are ready:

- Push your branch to your fork
- Open a Pull Request against the target branch
- Reference the corresponding issue in the PR description (e.g., “Fixes #123”)
- Include a clear summary of the changes and motivation

### 4. Address Review Feedback

During the review phase:

- Engage constructively with feedback
- Revise your code as needed
- Rebase your branch to keep the commit history clean

Once your PR is approved, a committer will merge it. Congratulations!

### 5. Merge change

The code will be merged by a committer once the review is finished.

After your contribution is merged:

- Consider picking up another issue
- Help review others’ PRs
- Share your experiences and ideas on the mailing list
