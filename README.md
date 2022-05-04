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

- local - This will set local environment variable, and deploy the app locally at <http://localhost:3000>. You could BYO ICAV2 JWT token by setting environment variable `ICAV2_ACCESS_TOKEN`.
- deploy - This will update the remote application. The script will set environment needed for remote deployment, build the app, and store to the S3 bucket. NOTE: Make sure correct/valid environemt variables for the remote environment.

Example
```bash
source start.sh local
source start.sh deploy
```

### Infrastructure
Details on the infrastucture is on the [infrastrucutre](infrastructure/README.md) directory.
