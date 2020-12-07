###### [SMK](..)

# Setting up SMK Development Environment

Clone this repo, let's say into `projects/smk`.

Install [NodeJS](https://nodejs.org/en/).

After NodeJS is installed, open a terminal window, and execute these commands:

    > cd projects/smk

    # Install node modules:
    > npm install

    # Build smk into dist/, start a web server pointing to this directory
    > npm start

Your web browser will automatically open a new page to [https://localhost:8080/debug](https://localhost:8080/debug).
Visit 'layout', and then 'header' for example.
When you edit the code in `src`, the changed files will trigger a re-build, and then the page that you have open in the browser will reload.
Be sure to watch the console window, in case there are build errors.
