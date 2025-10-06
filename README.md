# manualai-convex-backend/README.md

# ManualAI Convex Backend

This project is a backend implementation for the ManualAI restaurant management application, utilizing Convex for real-time data handling and TypeScript for type safety. The backend is designed to support various functionalities including restaurant management, inventory tracking, staff management, marketing campaigns, order processing, customer management, and analytics.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Functions Overview](#functions-overview)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with the ManualAI Convex Backend, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/manualai-convex-backend.git
   cd manualai-convex-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the `.env.example` to `.env` and fill in the required variables.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

## Project Structure

The project is organized as follows:

- `convex/`: Contains all Convex-related functions and schema definitions.
  - `functions/`: Contains individual function files for various functionalities.
  - `schema.ts`: Defines the database schema for the Convex backend.
  - `_generated/`: Contains auto-generated API and server types.
  
- `src/`: Contains CLI scripts and utility functions.
  - `cli/`: Scripts for deploying, running, and seeding the database.
  - `utils/`: Utility functions for Convex operations.

- `tests/`: Contains unit and integration tests for the backend functions.

- `.vscode/`: Configuration files for Visual Studio Code.

- `.github/`: Contains CI/CD workflows.

- `scripts/`: Shell scripts for starting the development server and deploying to production.

- `.env.example`: Example environment variable configuration.

- `package.json`: Project dependencies and scripts.

- `tsconfig.json`: TypeScript configuration.

- `jest.config.ts`: Jest testing configuration.

- `eslint.config.js`: ESLint configuration.

- `prettier.config.js`: Prettier configuration.

- `.gitignore`: Specifies files to ignore in Git.

## Functions Overview

The backend provides various functions to manage different aspects of the restaurant management system:

- **Restaurants**: Functions for managing restaurant data and retrieving metrics.
- **Inventory**: Functions for handling inventory management and AI predictions.
- **Staff**: Functions for managing staff-related operations.
- **Marketing**: Functions for managing marketing campaigns.
- **Orders**: Functions for processing and managing orders.
- **Customers**: Functions for managing customer data and interactions.
- **Analytics**: Functions for providing insights based on restaurant data.
- **Integrations**: Functions for handling integrations, such as WhatsApp.
- **AI**: Functions for AI-related tasks, including supply and marketing.

## Testing

To run the tests, use the following command:

```bash
npm test
```

This will execute both unit and integration tests to ensure the functionality of the backend.

## Deployment

To deploy the backend to production, use the following command:

```bash
npm run deploy
```

Make sure to configure your production environment variables before deploying.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch and create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.