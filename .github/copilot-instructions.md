<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project is a React web application built with Vite and TypeScript. The goal is to create a form for the game Yatzy. Please follow best practices for React, TypeScript, and modern frontend development.

For all new features add playwright tests to cover 100% of the code. If new labels are introduced, make sure to add translations for English and German in the [i18n.ts](../src/i18n.ts) file.

When changing the code make sure to fix linting and testing errors. Here are the commands to run:

- `npm run format` to run format test. You may can fix errors and warnings using `npm run format:fix`.
- `npm run lint` to check for linting errors. You may can fix errors and warnings using `npm run lint:fix`.
- `npm run test:e2e` to run the e2e-tests. Use `npm run coverage:html` to update the coverage report.

In playwright:

- use `input.clear();` rather than `input.fill('');` to clear input fields.
- use `input.fill('value');` to fill input fields rather to use `input.type('value');`.
