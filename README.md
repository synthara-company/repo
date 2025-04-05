
## 🚀 Build & Preview

To build the project and preview the production version locally, use these commands:

```bash
npm run build
npx serve -s dist
```

### 📋 Command Breakdown

#### `npm run build`

- **What it does**:  
  - Executes the **build script** defined in your `package.json` under the `"scripts"` section.  
  - Compiles and bundles your project into optimized static files (e.g., HTML, CSS, JS).  
  - Outputs these files to a folder, typically named `dist` or `build`, depending on your project setup.  

- **Why it's used**:  
  - Prepares the app for **production deployment**.  
  - Optimizes files for better performance (e.g., minifying code, removing unused assets).

#### `npx serve -s dist`

- **What it does**:  
  - Uses the [`serve`](https://www.npmjs.com/package/serve) package to host the static files.  
  - The `-s` flag enables **single-page app mode**, ensuring client-side routing (e.g., in React or Vue) works correctly.  
  - Serves files from the `dist` folder (replace `dist` with your actual output folder if different).  
  - `npx` runs `serve` without requiring a global installation.  

- **Why it's used**:  
  - Allows you to **preview the production build locally**.  
  - Simulates how the app will behave on a live server for testing.

### 💡 Notes
- Run `npm install` first to ensure all project dependencies are installed before building.
- After running `npx serve -s dist`, check your console for the local URL (usually `http://localhost:5000`).

