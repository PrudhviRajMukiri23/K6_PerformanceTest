# Sign performance tests

This project contains scripts used to performance test Sign's endpoints.

The main technologies used are:

-   [k6](https://k6.io/)
-   [Grafana](https://grafana.com/)
-   [InfluxDB](https://www.influxdata.com/)
-   [Docker](https://www.docker.com/)

# Getting started

This project is designed to be run locally on a developer's machine and not in
a CI environment.

## Prerequisites

### Tools

-   Docker & docker-compose installed

### Authentication

Since all of Unikey's endpoints require authentication, before running a test,
you must provide your `client id` and `client secret` so that they can be used
at run-time to generate an access token.

The convention in this project is to create a `secrets.json` file in the
`scripts` directory with the following structure:

```
{
	"client_id": "<your client id>",
	"client_secret": "<your client secret>"
}
```

**Note:** The `scripts/secrets.json` file is included in the `.gitignore` and
should never be committed to the repository.

## Start metrics server

This project uses a Dockerised Granfana & InfluxDB instance in order to view
performance test metrics in real-time.

The metrics server must be started before any tests are run otherwise k6 will
report an error.

### Start

```
docker-compose up -d influxdb grafana
```

### View

Open the [Grafana Dashboard](http://localhost:3000/d/vs05kC14z/k6-performance-testing-results?orgId=1&refresh=5s).

## Run a test

### Run

Test scripts are located under `./scripts` and are named with their respective
endpoint name e.g. `filename.js`.

Tests can be run against a specific endpoint by calling `docker-compose run k6`
and passing the file name as an argument e.g.:

```
docker-compose run k6 run /scripts/filename.js
```

This will use a Dockerised k6 instance to execute the tests.

### Debug

HTTP debugging can be enabled by passing the `--http-debug` flag (or `--http-debug="full"` for verbose debugging), e.g.:

```
docker-compose run k6 run --http-debug /scripts/filename.js
```

Refer to the [k6 http debug docs](https://k6.io/docs/using-k6/http-debugging/) for more information.

**Note:** The same method can be used to pass other k6 run-time options e.g.:

```
docker-compose run k6 run --summary-trend-stats="p(95),p(99.9)" /scripts/filename.js
```

Refer to the [k6 options docs](https://k6.io/docs/using-k6/k6-options/reference/) for a list of available options.

## Results

Test run results can be found both in the terminal output:

![Terminal](./img/terminal.png)

... and on the Granfana dashboard:

![Grafana](./img/grafana.png)

## Stop metrics server

The metrics server can be stopped by running:

```
docker-compose down
```

# Further topics

## Write a test

New tests can be written by either modifying an existing script or by creating a new file under the `scripts` directory.

Files should follow the naming convention `endpoint_name.js` e.g. `signature.js`.

See the [k6 docs](https://k6.io/docs/) for more information on how to write k6 tests.

Refer to [this documentation](https://k6.io/docs/test-types/introduction/) for more information on the different types of possible performance tests.

## Metrics server configuration

### InfluxDB

The configuration for InfluxDB can be found in the `./docker-compose.yaml` file.

### Grafana

The configuration for Grafana can be found both in the `docker-compose.yaml` file and in those files under the `./grafana` directory.

#### Save dashboard modifications

The provided Grafana dashboard is provisioned at start-up. Therefore, if you want to save any changes you've made to it, you will need to overwrite the contents of the `./grafana/dashboards/performance-test-dashboard.yaml` file.

## Run without metrics

If you do not want to run the tests using the metrics server and/or the k6 Docker image, you can [install k6 locally](https://k6.io/docs/get-started/installation/) and then run `k6 run` e.g.:

`k6 run scripts/signature.js`
