# Illumination

This project intended for an overview of Illumina Connected Analytics (ICA) data based on their v2 endpoint. The project is inteded for a front-end view only, utilizing the `GET` endpoint. At the moment modifying data using `POST` or similar method endpoint is not supported.  

The endpoint is based on their Swagger: https://ica.illumina.com/ica/api/swagger/index.html
Swagger is used from an SDK at seperate repository: https://github.com/umccr-illumina/icats

## Running


### Running the APP

Currently the app is still in development and only deploy locally. The app will be able to run via `npm start` which will run it on [http://localhost:3000](http://localhost:3000) to view it in the browser.

Command:
```bash
npm start
```

### Running the ICA-Endpoint

Currently ICA-endpoint does not support Cross-Origin Resource Sharing (CORS) resulting quering from browser return a blocked CORS results. This issue has been raised at Illumina side and is now working in progrss. As an alternative, there is a lambda acting as a proxy to add cors-origin policy before returning it to the browser. Again this works only locally which will run at [http://localhost:5000](http://localhost:5000). This code is located at [/infrastructure](./infrastructure/)

Requirements to run:
- Docker
- aws-sam-cli

There is a Makefile to install/run this proxy

```bash
cd infrastructure
make local
```

