# Illumination

This project is intended for an overview of Illumina Connected Analytics (ICA) data based on their v2 endpoint, with a focus on the front-end view.
At the moment it utilises only the `GET` HTTP method; modifying data using `POST` or other methods is not supported.

The endpoint is based on the ICA Swagger: <https://ica.illumina.com/ica/api/swagger/index.html>.
This Swagger is used from an SDK in a separate repository: <https://github.com/umccr-illumina/icats>.

## Installing

```bash
yarn install
```

## Running

### App

Currently the app is still in development and only deploys locally. Using `yarn start` the app will run on <http://localhost:3000> which can be viewed in the browser.
Before running the app, make sure that your session's AWS profile is set with valid credentials. This is needed to query environment variables from AWS:

```bash
source get_env.sh
```

After setting the environment variables, you can start the app with:

```bash
yarn start
```

_Before_ starting the app, follow the steps below.

### ICA-Endpoint

Currently the ICA endpoint does not support Cross-Origin Resource Sharing (CORS) where querying from the browser returns a blocked CORS result. This issue has been raised with Illumina and is now a work in progress. As an alternative, there is a lambda acting as a proxy to add cors-origin policy before returning it to the browser. Again, this works only locally at <http://localhost:5000>. The relevant code is at [/infrastructure](./infrastructure/).

Requirements to run:

- `Docker`
- `aws-sam-cli`

There is a Makefile to install/run this proxy. In a different terminal, run the following commands:

```bash
cd infrastructure
make local
```
