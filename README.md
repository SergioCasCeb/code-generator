# WoT Code Generator

## Code Generator CLI

A command-line interface tool for generating protocol-specific code snippets from Web of Things Thing Descriptions (TDs).

### Features

- Interactive and one-line command modes
- Deterministic Support for multiple programming languages and libraries
- AI-powered code generation for not yet available cases (ChatGPT, Gemini, Llama)
- TD input via file of text editor
- Multiple output options (console of file)

### Installation Steps

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

    This allows you to run the `generate-code` command anywhere in your terminal.

### Usage

The CLI can be used in two modes: interactive and one-line command

#### Interactive Mode

Run the CLI in interactive mode:

```bash
generate-code -i
```

The interactive mode guides you through the following steps:

1. Choose TD input method (file or text editor)
2. Select an affordance
3. Choose a form index (optional)
4. Select and operation
5. Choose between deterministic or AI-powered generation (If a protocol is not supported AI is selected by default)
6. Select programming language
7. Select library
8. Choose output type (console or file)

*Finally, after generating the code, the interactive mode also returns the equivalent options to run the CLI in the one-line mode.*

#### One-line Command Mode

For automated workflows, use the one-line command mode:

#### Options

- `-i, --interactive`: Run CLI in interactive mode
- `-t, --td <path>`: Path to the Thing Description file
- `-a, --affordance <name>`: Affordance to use
- `-f, --form-index <index>`: Form index to use
- `-o, --operation <name>`: Operation to perform
- `-l, --language <name>`: Programming language
- `-L, --library <name>`: Library to use
- `--ai`: Use AI generation
- `--tool <name>`: AI tool to use (ChatGPT, Gemini, Llama)
- `-O, --output <type>`: Output type (console or file)
- `-h, --help`: Display help information
- `-V, --version`: Display version number

#### Examples

Generate code utilizing the deterministic generator

```bash
generate-code --td ./calculator.td.jsonld -a result -f 0 -o readproperty -l javascript -L node-wot -O console
```

Generate code utilizing the AI generator

```bash
generate-code --td ./calculator.td.jsonld -a result -f 0 -o readproperty -l javascript -L axios --ai --tool chatgpt -O console
```

### Supported formats

#### Input files

- JSON (.json)
- JSON-LD (.jsonld)
- Text (.txt)

#### Programming Languages and Libraries

Deterministic:

- JavaScript
    - Fetch
    - node-wot
    - modbus-serial

- Python
    - Requests

No restrictions when using AI generation.

### Output

#### Console Output

The generated code is printed directly to the console in simple text format. AI generation adds markdown syntax to the code.

#### File Output

A new folder called `generator-ouput` is created within the project and the generated code is saved to a file with the following naming convention `<affordance>_<operation>_<language>.<extension>`

---

## UI Installation

1. Navigate to the UI directory:

    ```bash
    cd code-generator/ui
    ```

2. Install all project dependencies:

    ```bash
    npm install
    ```

3. Build the project with Webpack:

    ```bash
    npm run build
    ```

4. Serve the dist folder with express:

    ```bash
    npm run serve
    ```

    This will allow you to utilize the UI, and output the generated code through the projects API.
