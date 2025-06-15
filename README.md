# Bookstore API Test Suite

This project contains a comprehensive Playwright-based API testing framework for validating the core functionality of a FastAPI-powered bookstore application. The framework supports test automation for user authentication and book CRUD operations, includes environment setup via Docker, and is CI-integrated using GitHub Actions.

## Project Structure

```
bookstore-api-tests/
├── .github/workflows/            # CI/CD workflows
├── api-tests/                    # API testing Framework
│   ├── config/                   # Environment configs
│   ├── data/                     # Test data (users, books)
│   ├── tests/                    # Test suites (auth, books)
│   ├── utils/                    # Utility helpers (token, setup)
│   ├── playwright-report/        # HTML test reports
│   ├── package.json              # NPM scripts
├── bookstore/                    # FastAPI backend
│   ├── main.py                   # App entry point
│   ├── requirements.txt          # Backend dependencies
│   ├── Dockerfile                # API container
├── docker-compose.yml            # Combined service runner
├── README.md                     # Documentation and Steps to use
```

## How to Run the Test Suite

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Python 3.10+
- Git
- Playwright

### 1. Clone the Repository

```bash
git clone https://github.com/Manjyyot/bookstore-api-tests.git
cd bookstore-api-tests
```

### 2. Start the Backend with Docker

```bash
docker-compose up -d
```

This runs the FastAPI server at http://localhost:8000.

### 3. Install Frontend Test Dependencies

```bash
cd api-tests
npm install
```

### 4. Run the Tests

```bash
npx playwright test
```

To run the full lifecycle with DB reset (locally):

```bash
npm run clean-test
```

### 5. View Test Reports

```bash
npm run report
```

Opens an HTML report with a detailed breakdown of passes and fails.

## Testing Strategy

### Test Flow Design

Test cases were designed based on:

- API documentation and functional specifications
- CRUD lifecycle coverage for books
- Auth workflows with positive & negative paths
- Schema validation and edge cases

Tests are structured in a clean, chained flow to simulate real user journeys, ensuring confidence in functional integrity.

### Reliability & Maintainability

- **Modular Structure**: Separate concerns (data, config, logic)
- **Reusable Functions**: Utility methods reduce redundancy
- **DB Reset Support**: Scripts to start from a clean slate
- **No Flaky Tests**: Reliable assertions and retry logic
- **CI Automation**: GitHub Actions for continuous testing

### Challenges & Resolutions

| Challenge | Resolution |
|----------|------------|
| API failed silently for missing fields | Wrapped responses in try/catch to parse both JSON and raw text |
| CI failing due to Docker image build issues | Switched to docker-compose with explicit setup commands |
| GitHub Actions YAML errors | Validated syntax and used supported artifact version & health checks |
| Playwright dependencies not being installed | Used `npx playwright install --with-deps` for reliable CI installation |
| HTML report not uploading | Used `actions/upload-artifact@v4` to comply with deprecation notices |

## CI/CD Pipeline

**Location**: `.github/workflows/playwright.yml`

### Workflow Steps

- Checkout code
- Set up Node.js and install dependencies
- Start backend with Docker Compose
- Wait for backend health confirmation
- Run Playwright tests
- Upload HTML test report as GitHub artifact

This workflow triggers on every push to `main` or on pull requests.

## Sample Report

Location: `playwright-report/index.html`

Contents include:

- Test summary (pass/fail/skip)
- Request/response data
- Full error stack traces
- Screenshots (if applicable)

## What's Implemented

- Auth: Signup, Login (Positive/Negative)
- Book CRUD: Full lifecycle + validations
- Dockerized backend
- Playwright test framework
- GitHub Actions CI pipeline
- HTML test reporting
- Manual DB reset via script
