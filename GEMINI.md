# GEMINI.md - Code-Themed CV Project Context

This project is a personal CV repository designed with a "Code-Themed" aesthetic, mimicking a modern code editor (VS Code Dark theme with Go-style syntax highlighting). It provides both an interactive web-based version and a LaTeX-based version for PDF generation.

## Project Overview
- **Interactive Web CV:** A responsive, interactive CV built with HTML, CSS, and JavaScript. Features include syntax highlighting, a "Like" button, profile image upload via drag-and-drop, and a "Print to PDF" shortcut.
- **LaTeX CV:** High-quality PDF generation using LaTeX. It maintains the same code-editor aesthetic and supports multiple languages.
- **Design Philosophy:** Uses the **JetBrains Mono** font to reinforce the developer-centric feel.

## Key Technologies
- **Web Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6).
- **LaTeX Framework:** XeLaTeX/LuaLaTeX (required for `fontspec` to use local `.ttf` fonts), `paracol` for multi-column layout, and `tikz` for custom graphics.
- **Typography:** JetBrains Mono (Bold, Italic, Regular).

## Key Files
- `index.html`: Main entry point for the interactive web version.
- `style.css`: Contains the dark theme colors and layout for the web version.
- `script.js`: Handles interactivity, like button logic, profile image updates, and keyboard shortcuts (`Ctrl+L` for Like, `Ctrl+P` for Print).
- `en.tex`: LaTeX source for the English version of the CV.
- `sv.tex`: LaTeX source for the Swedish version of the CV.
- `profile.jpg`: The profile picture used across both versions.
- `en.pdf` / `sv.pdf`: Pre-compiled PDF versions.

## Building and Running

### Web Version
Simply open `index.html` in any modern web browser. No build step is required.
- **Customization:** Edit `index.html` to update personal information and `style.css` for color adjustments.

### LaTeX Version
To compile the LaTeX sources, you must use a compiler that supports system/local fonts (XeLaTeX or LuaLaTeX).
- **Command:** `xelatex en.tex` (or `lualatex en.tex`)
- **Dependencies:** Ensure you have a TeX distribution (like TeX Live or MiKTeX) installed with the necessary packages (`geometry`, `xcolor`, `paracol`, `fontspec`, etc.).

## Development Conventions
- **Syntax Highlighting:** Both versions follow a Go-like syntax for personal data (e.g., `var Info = struct { ... }`).
- **Responsive Design:** The web version is designed to be mobile-friendly and print-optimized.
- **Language Consistency:** When updating information, ensure changes are reflected in both `index.html` and the corresponding `.tex` files to keep the versions in sync.
