[![Build Status](https://travis-ci.org/18F/a11y-metrics.svg?branch=master)](https://travis-ci.org/18F/a11y-metrics)

This is an experiment in obtaining accessibility metrics across all
18F projects.

## Quick start

You'll need [Docker][].

```
docker-compose pull
docker-compose run app yarn
docker-compose run app npm run copy:vendor
docker-compose run app node stats.js
```

This will output [stats.csv](stats.csv) and `static/index.html`.

## Adding new 18F projects to track

Currently, the list of 18F projects is actually automatically generated
by iterating through all the GitHub repositories in the 18F organization
(and possibly other related ones) and filtering for the ones that
have a homepage set, along with a minimum number of open issues or
stars.

For more details on this criteria, and on tweaking its parameters,
see `lib/config.js`.

We may add an explicit mechanism to allow specific projects to be
tracked in the future.

## Clearing cached data

All cached data is placed in the `cache` subdirectory. You can delete it
entirely to reset the whole cache, or delete individual subdirectories
or files within it to reset a subset of the cache.

## Testing

We use [Jest][] for tests; tests are in the `test` subdirectory. Run
`docker-compose run app jest --watch` to run the tests and continuously
watch for changes.

We also use [Flow's comment syntax][flow] for strong typing,
and `docker-compose run app npm test` will fail if any errors are
reported by Flow.

For quick feedback on Flow's type checking, consider running
`docker-compose run app npm run flow:watch`.

## Deployment

Currently deployment is done via the
[cloud.gov staticfiles buildpack][cg-static]. You can deploy the site
by running `cf push`.

[Docker]: https://docker.com/
[flow]: https://flowtype.org/en/docs/types/comments/
[Jest]: http://facebook.github.io/jest/
[cg-static]: https://cloud.gov/docs/apps/static/
