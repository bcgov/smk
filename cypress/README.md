# SMK Cypress Testing

## Setup

SMK must be built before tests can be run. From the project root, run `npm run develop` to create the `/dist` directory and files.

## Running Tests

Tests are run using `npm` and are configured in `package.json`.

### Automated

From the project root, run `npm run test`. This runs all tests and outputs the results.

### Interactive

From the project root, run `npm run cypress`. This launches the cypress app, where you can run specific tests and see them run in a browser.
