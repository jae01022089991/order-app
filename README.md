# Coffee Ordering App Frontend

This repository contains the frontend code for the Coffee Ordering App, which is a full-stack web application allowing users to order coffee and enabling administrators to manage orders.

## Project Structure

The project is organized as follows:

```
order-app
├── ui                  # Frontend code
│   ├── package.json    # NPM configuration and dependencies
│   ├── vite.config.js  # Vite configuration
│   ├── index.html      # Main HTML file
│   ├── jsconfig.json   # JavaScript project settings
│   ├── .gitignore      # Git ignore file
│   ├── src             # Source code
│   │   ├── react       # React application
│   │   │   ├── main.jsx  # Entry point for React
│   │   │   ├── App.jsx   # Main App component
│   │   │   ├── components # Reusable components
│   │   │   │   └── Header.jsx # Header component
│   │   │   └── styles    # CSS styles for React
│   │   │       └── app.css
│   │   ├── vanilla      # Vanilla JavaScript application
│   │   │   ├── main.js   # Entry point for vanilla JS
│   │   │   ├── app.js    # Main logic for vanilla JS
│   │   │   └── styles    # CSS styles for vanilla JS
│   │   │       └── app.css
│   │   └── shared       # Shared code between React and vanilla JS
│   │       └── api.js   # Shared API functions
│   └── README.md       # Frontend project documentation
├── docs                # Documentation
│   └── PRD.md         # Project requirements document
└── README.md           # Root project overview
```

## Getting Started

To get started with the frontend development environment, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd order-app/ui
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the development server**:
   ```
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000` (or the port specified in the terminal) to view the application.

## Features

- User-friendly interface for ordering coffee.
- Admin dashboard for managing orders and inventory.
- Responsive design for both mobile and desktop views.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.