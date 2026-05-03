# Assessments: Foundation Healthcare

An assessment for Foundation Healthcare using Playwright. This project includes both API and UI testing capabilities, focusing on FHIR R4 standards and modern web applications.

## Features

- **API Testing**: Comprehensive FHIR R4 API tests for patient resource management
- **UI Testing**: Cross-browser testing for web applications using TodoMVC as a reference implementation
- **TypeScript Support**: Full TypeScript implementation for better code maintainability
- **Test Data Builders**: Fluent API for creating test data using the Builder pattern
- **Page Object Model**: Clean separation of concerns for UI tests
- **Parallel Execution**: Optimized for CI/CD with parallel test execution
- **Visual Testing**: Screenshot-based visual regression testing

## Project Structure

```bash
├── builders/           # Test data builders (PatientBuilder)
├── data/              # Test data and fixtures
├── pages/             # Page Object Model classes
├── specs/             # Test specifications
│   ├── API/          # FHIR R4 API tests
│   └── UI/           # Web UI tests
├── utils/             # Utility functions and API clients
├── playwright.config.ts  # Playwright configuration
└── package.json      # Project dependencies and scripts
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/norikhwan-ali/assessments-foundation-healthcare.git
cd assessments-foundation-healthcare
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
API_BASE_URL=https://hapi.fhir.org/baseR4
UI_BASE_URL=https://demo.playwright.dev/todomvc
```

## Running Tests

### ⚠️ Visual Snapshot Tests ⚠️

Visual snapshots are generated in **CI**, not on local machines.  
This ensures consistent rendering across browsers, fonts, and operating systems.

Because local environments may render UI differently, visual tests may fail when run locally.  
This is expected.

If you intentionally want to update the visual baselines, run:

```bash
npx playwright test --update-snapshots
```

Only run this when you intend to update the snapshots.  
After updating, commit the new `*-snapshots` folders so CI can use them as the new baseline.

If you only want to run functional tests locally. use:

```bash
npx playwright test --grep-invert "Visual Regression Tests"
```

### Run All Tests

```bash
npx playwright test
```

### Run API Tests Only

```bash
npx playwright test --project=API
```

### Run UI Tests On All Browsers

```bash
npx playwright test --project="UI - Chromium" --project="UI - Firefox" --project="UI - WebKit"
```

### Run UI Tests On Chromium Only

```bash
npx playwright test --project="UI - Chromium"
```

### Run UI Tests On Firefox Only

```bash
npx playwright test --project="UI - Firefox"
```

### Run UI Tests On Webkit Only

```bash
npx playwright test --project="UI - Webkit"
```

### Run Tests in Specific File

```bash
npx playwright test specs/API/fhir-r4.spec.ts
```

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

### Generate Test Report

```bash
npx playwright show-report
```

## Test Categories

### API Tests (FHIR R4)

- Patient resource creation and validation
- Patient retrieval by ID
- Patient updates and patches
- Error handling for invalid requests
- Data integrity verification

### UI Tests (TodoMVC)

- Initial application state
- Adding single and multiple todo items
- Item completion and toggling
- Item deletion
- Filtering (All, Active, Completed)
- Accessibility compliance
- Visual regression testing

## Development

### Adding New Tests

1. **API Tests**: Add to `specs/API/` directory
2. **UI Tests**: Add to `specs/UI/` directory
3. Use existing helpers and utilities for consistency

### Test Data

- Use builders in `builders/` for complex test data
- Static data available in `data/` directory
- Faker.js integration for dynamic test data generation

### Page Objects

- Extend `pages/index.ts` for new page objects
- Follow the existing TodoPage pattern for UI interactions

## CI/CD Integration

The project is configured for CI environments:

- Parallel execution disabled in CI (single worker)
- HTML and list reporters enabled
- Traces captured on first retry
- Forbidden "only" tests in CI

## Technologies Used

- **Playwright**: End-to-end testing framework
- **TypeScript**: Type-safe JavaScript
- **Node.js**: Runtime environment
- **Faker.js**: Fake data generation
- **dotenv**: Environment variable management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

ISC License - see package.json for details
