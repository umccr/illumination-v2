# Illumination

This project is intended for an overview of Illumina Connected Analytics (ICA) data based on their v2 endpoint, with a focus on the front-end view.
At the moment it utilises only the `GET` HTTP method; modifying data using `POST` or other methods is not supported.

The endpoint is based on the ICA Swagger: <https://ica.illumina.com/ica/api/swagger/index.html>.
This Swagger is used from an SDK in a separate repository: <https://github.com/umccr-illumina/icats>.

## Running

### App

Currently the app is still in development and deployed at <https://illumination.dev.umccr.org>. 
You could still run this app locally by invoking the [start.sh](start.sh) script.

When sourcing [start.sh](start.sh), there is argument need to specify. Arguments as follow.

- local - This will set local environment variable, and deploy the app locally at <http://localhost:3000>.
- deploy - This will update the remote application. The script will set environment needed for remote deployment, build the app, and store to the S3 bucket. NOTE: Make sure correct/valid environemt variables for the remote environment.
- unset - Will unset all environment variable that were set for the app.

Example
```bash
source start.sh local
source start.sh deploy
```

_Before_ starting the app, follow the steps below.

### ICA-Endpoint

Currently the ICA endpoint does not support Cross-Origin Resource Sharing (CORS) where querying from the browser returns a blocked CORS result. This issue has been raised with Illumina and is now a work in progress. As an alternative, there is a lambda acting as a proxy to add cors-origin policy before returning it to the browser. Again, this works only locally at <http://localhost:5000>. The relevant code is at [/infrastructure](./infrastructure/).

Requirements to run:

- `Docker`
- `aws-sam-cli`
- *ICAV2_ACCESS_TOKEN*

There is a Makefile to install/run this proxy. In a different terminal, run the following commands:

```bash
export ICAV2_ACCESS_TOKEN=`cat ~/.icav2/.session.ica.yaml | grep access-token | sed -e 's/access-token: //'`
cd infrastructure
make local
```

### Infrastructure
Details on the infrastucture is on the [infrastrucutre](infrastructure/README.md) directory.
