# PlayWrightErick
Web automation with the Playwright tool + TypeScript.

[Official Introduction to Playwright](https://playwright.dev/docs/intro)  
[Cypress vs Playwright: A Comparison](https://apiumhub.com/es/tech-blog-barcelona/playwright-vs-cypress-el-rey-ha-muerto-viva-el-rey/)  
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Allure Framework](https://docs.qameta.io/allure/)
- [rimraf on npm](https://www.npmjs.com/package/rimraf)

## Table of Contents
- [Introduction](#playwrighterick)
- [Prerequisites](#prerequisites)
- [Ways to Run Tests](#ways-to-run-tests)
- [Debug Mode](#debug-mode)
- [How to use Allure Reports](#how-to-use-allure-reports)
- [Install YAC Http REST Client](#install-yac-http-rest-client)
- [Troubleshooting](#troubleshooting)

## Prerequisites
Before running the tests, ensure you complete these two important steps:

1. Install all Node.js dependencies:  
   ```bash
   npm install
   ```

2. Install Playwright along with required browsers (Chrome, Firefox, etc.):  
   ```bash
   npx playwright install --force
   ```

   or

2. Update Playwright to latest:  
   ```bash
   npm install @playwright/test@latest
   ```

3. Print environment (Windows) variable for defining test environment
   ```bash
   $Env:TEST_ENV
   ```   

## Ways to Run Tests

### First: 
Run everything in headless mode:  
```bash
npx playwright test
```

Or run everything in headed mode (visible browser):  
```bash
npx playwright test --headed
```

### Second: 
Open a window to run manually and see the actual execution on different web browsers:  
```bash
npx playwright test --ui
```

### Third:
On Visual Studio, click on the "Testing" icon to the left (below GIT) to manually run individual tests in headless mode.

### Fourth:
In the code (`xxx.spec.ts`), click on the "Play" icon before the test name (left) to manually run individual tests in headless mode.

### Debug Mode
To execute tests in Chrome headed mode with debugging enabled:  
```bash
$env:PWDEBUG=1; npx playwright test
```

To undo the above:  
```bash
Remove-Item Env:\PWDEBUG
```

## How to use Allure Reports

### Pre-step 1: 
Install Allure Dependency:  
```bash
npm install --save-dev allure-playwright
```

### Pre-step 2: 
Install rimraf Dependency:  
rimraf is a Node.js package that provides a cross-platform way to delete files and directories.  
```bash
npm install --save-dev rimraf
```

### First: 
Run your tests in the regular way:  
```bash
npx playwright test
```
or  
  
Run your tests in the custom way by using a script declared in package.json file:  
Doing this will first clean everything in the allure folder, this is in order to avoid having trash from previous executions such as displaying a test that was deleted or was renamed  
```bash
npm run testErick
```

```bash
npm run testErickHead
```

### Second:
Generate the results:  
```bash
npx allure generate ./allure-results
```

### Third: 
Open the generated results:  
```bash
npx allure open
```

## Install YAC Http REST Client
[Official httpYac Site](https://httpyac.github.io/)  
[Guide](https://httpyac.github.io/guide/)  

### First thing:
Install dependency:  
```bash
npm install -g httpyac
```

### Then:
Install VSCode Extension:  
```bash
code --install-extension anweber.vscode-httpyac
```

### Finally:
Create .http file with sample test:  
- Open a new file and save it with the .http extension, e.g., requests.http.  
```bash
GET https://jsonplaceholder.typicode.com/posts/1
```
  
- Send the request:  
Click on the "Send Request" button that appears above the GET request line, or use the shortcut Ctrl+Alt+R1.  

## Troubleshooting
- **Issue**: `npx playwright install` fails.
  **Solution**: Ensure Node.js and npm are installed and up-to-date.
- **Issue**: Allure report does not generate.
  **Solution**: Verify that the `allure-results` folder contains valid test results.

