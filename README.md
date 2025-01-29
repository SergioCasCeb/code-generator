# Installation

1. Clone the repository using Git:

    ```bash
    git clone https://github.com/SergioCasCeb/code-generator.git
    ```

2. Navigate to the project directory:

    ```bash
    cd code-generator
    ```

3. Install all project dependencies:

    ```bash
    npm install
    ```

4. Link the project globally to make the `generate-code` command available on your system:

    ```bash
    npm link
    ```

    This allows you to run the `generate-code` command from anywhere in your terminal.

## UI Installation

1. Navigate to the UI directory:

    ```bash
    cd code-generator/ui
    ```

2. Install all project dependencies:

    ```bash
    npm install
    ```

3. Build the project with webpack:

    ```bash
    npm run build
    ```

4. Serve the dist folder with express:

    ```bash
    npm run serve
    ```

    This will allow you to utilize the UI, and output the generated code through the projects API.
