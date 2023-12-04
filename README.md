# hello_jyotishi_node_app

Hello Jyotishi Backend with Node.js and Express. This app uses Node.js with Express for the backend, MongoDB for the database, and GraphQL for the APIs.

## Getting Started

## Note:

There's nothing right or wrong mentioned here. It's just that as a team we need to follow same rules for better readability, development & debugging.

## Git management

- Two main branches
  - **development**: It's the default branch, developers should raise PR against this branch.
  - **stable**: After development (and ofcourse testing) is done, `development` is merged into `stable` and released to the production.
- Branch naming conventions
  - **prefix**: Branch name should start with 2 letters and hiphen(`-`), which indicates the author identity. For eg, Rishabh Sethia - `rs-`
  - **suffix**: It can be `Feature` or `Fix`. Eg, `rs-oboardingFeature`, `rs-notificationFix`

## Code practices

### Naming Conventions

- Use camelCase for variable and function names

  ```
  // good
  const getUserData = () => {}

  // bad
  const get_user_data = () => {}
  ```

- Use PascalCase for class names

  ```
  // good
  class UserService {}

  // bad
  class userService {}
  ```

- Use UPPERCASE for constants and enums

  ```
  // good
  const PORT = 8080;

  // bad
  const port = 8080;
  ```

- Use kebab-case for file names

  ```
  // good
  user-model.js

  // bad
  userModel.js
  ```

### Code Style

- Use ES6 features like arrow functions, const/let, template literals etc
- Use async/await syntax for asynchronous code
- Destructure objects for cleaner code when extracting properties
- Add JSDoc comments for functions and complex logic
- Follow Airbnb JavaScript style guide for consistent conventions

### GraphQL Best Practices

- Use a separate schema file for each model type
- Define reusable scalar types like DateTime for consistency
- Minimize nesting in resolvers with well-designed schema
- Handle errors gracefully in resolvers using try/catch blocks
- Modularize resolvers with data loaders to isolate data logic
- Write unit tests for resolvers using Jest test framework
- Follow GraphQL naming conventions and casing

### MongoDB Best Practices

- Define MongoDB models using Mongoose ODM
- Put business logic in model methods instead of controllers
- Validate data before saves and updates in models
- Create indexes on frequently queried fields
- Follow MongoDB field naming conventions like 'first_name'

### Linting & Formatting

- Use ESLint for linting and Prettier for formatting
- Lint code on commit using Husky's pre-commit hooks
- Auto-format code on commit using Prettier
- Follow Airbnb's ESLint and Prettier configuration
- Use EditorConfig to maintain consistent formatting

#### All PRs are to be raised to the **Development Branch ONLY** and **Rishabh** is to be tagged on the PR.

#### Take a **Pull** from the **Development Branch** before you raise a PR. There should be no conflicts while merging of the PR.
