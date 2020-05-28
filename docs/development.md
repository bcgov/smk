# SMK
## Simple Map Kit

### Setting up SMK Development Environment

Clone this repo, let's say into `projects/smk`.

Install [NodeJS](https://nodejs.org/en/).

After NodeJS is installed, open a terminal window, and execute these commands:

    > cd projects/smk

    # Install node modules:
    > npm install

    # Build smk into dist/
    > npm run build 

    # Start a simple web server to serve dist/
    > npm run serve

Point browser at [https://localhost:8443/debug](https://localhost:8443/debug).
Visit 'layout', and then 'header' for example.

### Automatically rebuild SMK soce

If you would like to build SMK in development mode, and rebuild automatically when the code changes, then do this:

    > cd projects/smk

    # Build smk into dist/
    > npm run debug

In another terminal window:

    > cd projects/smk

    # Build smk into dist/
    > npm run serve

Edit the code in `src` or `debug`, but don't edit anything in `dist`.
When you save changes, the code will automatically rebuild.

### VS Code Integration

If you are editing this project in VS Code, there is a build task and launch configuration defined.

Open VS Code to the `projects/smk` folder, and hit `F5` (or select Run|Start Debugging).
This will build the code, and then open Chrome with the debugger attached to VS Code.

### Code Organization

**TBD**
