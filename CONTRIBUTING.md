# Contributing to GitHub Stats Card

First off, thank you for considering contributing to the GitHub Stats Card! It's people like you that make the open-source community such an amazing place to learn, inspire, and create.

## 🚀 How Can I Contribute?

### 1. Adding New Themes 🎨
We are always looking for more beautiful themes! To add a theme:
1. Open `functions/index.js`.
2. Locate the `themes` object at the top of the file.
3. Add a new object for your theme with the following structure:
   ```javascript
   your_theme_name: { 
     bg1: "#Color1", // Top color of gradient
     bg2: "#Color2", // Bottom color of gradient
     text: "#TextColor", 
     accent: "#AccentColor", // Used for Username & Main Title
     label: "#LabelColor", // Used for text under numbers
     border: "#BorderColor", // Optional
     title: "FUN TITLE" // e.g. "// PROBLEM SOLVER //"
   }
   ```
4. If it's a transparent theme, add `transparent: true` instead of `bg1`/`bg2`.
5. Update `public/script.js` to include your new theme in the `THEME_DATA` object so it shows up on the website!

### 2. Adding New Layouts 📏
Layouts determine the SVG structure of the card.
1. Add a new generation function in `functions/index.js` (e.g., `generateMyLayoutSVG(data, theme)`).
2. Update the `exports.card` logic to route `layout=mylayout` to your new function.
3. Update `public/index.html` and `public/script.js` to add the layout button to the frontend UI.

### 3. Reporting Bugs
Bugs are tracked as GitHub issues. When creating an issue, please explain:
- What happened.
- What you expected to happen.
- Steps to reproduce the issue.
- Your environment (Browser, OS).

### 4. Suggesting Enhancements
Enhancement suggestions are tracked as GitHub issues. Please provide:
- A clear and descriptive title.
- A step-by-step description of the suggested enhancement in as many details as possible.
- Specific examples to demonstrate the steps.

## 🛠️ Local Development Setup

To run this project locally, you will need Node.js and the Firebase CLI installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR-USERNAME/github-x.git
   cd github-x
   ```

2. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

3. **Install Dependencies:**
   ```bash
   cd functions
   npm install
   cd ..
   ```

4. **Run the Emulators:**
   ```bash
   firebase emulators:start
   ```
   Go to `http://127.0.0.1:5000` to see the frontend, and view the terminal to see the local Cloud Function URL.

## 📝 Pull Request Process

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. Ensure the code runs successfully on your local Firebase emulator.
4. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
5. Create a Pull Request with a clear description of your changes.

Thank you for contributing!
