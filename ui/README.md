# Frontend Development for Coffee Ordering App

This directory contains the frontend code for the Coffee Ordering App, which is built using React and vanilla JavaScript with Vite as the build tool.

## Project Structure

- **src/**: Contains the source code for the application.
  - **react/**: Contains the React application code.
    - **components/**: Reusable React components.
    - **styles/**: CSS styles for the React application.
  - **vanilla/**: Contains the vanilla JavaScript application code.
    - **styles/**: CSS styles for the vanilla JavaScript application.
  - **shared/**: Contains shared utilities and API functions.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd order-app/ui
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed. Then run:
   ```bash
   npm install
   ```

3. **Run the Development Server**
   To start the development server, run:
   ```bash
   npm run dev
   ```
   This will start the Vite development server and open the application in your default browser.

## Usage

- The React application can be found in the `src/react` directory. The main entry point is `main.jsx`, which renders the `App` component.
- The vanilla JavaScript application can be found in the `src/vanilla` directory. The main entry point is `main.js`.

## Building for Production

To build the application for production, run:
```bash
npm run build
```
This will create an optimized build of the application in the `dist` directory.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.