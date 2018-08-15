# smk-client

Simple Map Kit Client - A versatile and lightweight toolkit for building a simple web map.

[Client API](docs/SMK-Client-API.md) and [examples](docs/SMK-Client-API-Examples.md)

[Client Configuration](docs/SMK-Client-Configuration.md)

# Development

Clone this repo, let's say into `projects/smk-client`.

Install [NodeJS](https://nodejs.org/en/).

Install node modules:

    > cd projects/smk-client
    > npm install

Start Grunt in development mode:

    > grunt

Point browser at [https://localhost:8443](https://localhost:8443).

Edit code, and when a file is saved, the website is automatically reloaded.

The configurations in `example/config` are available to any of the pages at [https://localhost:8443](https://localhost:8443).
Use a URL parameter like `config=config/bcparks-test.json`.


# License
```
Copyright 2018 Province of British Columbia

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
