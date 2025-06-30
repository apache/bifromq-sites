---
sidebar_position: 2
title: "Code Review"
---

## Review a Pull Request

Here’s how you can effectively review a Pull Request (PR) in BifroMQ:

### 1. Understand the Context

Before diving into the code:

- **Read the PR description carefully.** Understand what problem the change solves and how.
- **Check the linked issue**, if any. This gives insight into the motivation, discussion history, and design considerations.
- **Scan the commit message(s)** to ensure they follow the project’s format and are descriptive.

### 2. Review Checklist

While reviewing, consider the following:

#### Correctness

- Does the code behave as described?
- Are edge cases handled properly?
- Is it backwards-compatible?

#### Test Coverage

- Are there new or updated tests that cover the change?
- Do tests pass locally or in CI?

#### Code Quality

- Is the code clear and easy to understand?
- Are any parts overly complex or in need of refactoring?
- Does the code follow BifroMQ’s style and conventions?

#### Design & Architecture

- Does the change align with the existing architecture?
- Could it introduce unnecessary coupling, duplication, or inefficiency?

#### Documentation

- Are code comments helpful and accurate?
- For user-facing changes, is documentation updated where applicable?

### 3. Give Constructive Feedback

Use GitHub’s review tools to:

- Ask clarifying questions
- Suggest improvements
- Point out potential bugs
- Praise good practices and elegant solutions

Be respectful and collaborative — we strive to foster a supportive and inclusive community. Assume positive intent and focus on shared learning and improvement.

### 4. Approve or Request Changes

Once you’re done reviewing:

- If the PR meets the quality bar, approve it.
- If changes are needed, submit a review with comments and select **“Request changes”**.
- If you're not sure, leave comments and mark the review as **“Comment only”** — others can follow up.

### 5. Follow Up

After leaving your review:

- Stay engaged if the author responds with updates or questions.
- Re-review the PR after updates and adjust your review status if needed.
