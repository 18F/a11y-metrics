[![Build Status](https://travis-ci.org/18F/a11y-metrics.svg?branch=master)](https://travis-ci.org/18F/a11y-metrics)

This is an experiment in obtaining accessibility metrics across all
18F projects.

## Quick start

You'll need [Docker][].

```
docker-compose pull
docker-compose run app yarn
docker-compose run app node stats.js
```

This will output [stats.csv](stats.csv).

## Adding new 18F projects to track

Just add an entry to `websites.json`.

## Clearing cached data

All cached data is placed in the `cache` subdirectory. You can delete it
entirely to reset the whole cache, or delete individual subdirectories
or files within it to reset a subset of the cache.

## Testing

Unfortunately, this project does not yet have any unit tests.

However, it does use [Flow's comment syntax][flow] for strong typing,
and `docker-compose run app npm test` will fail if any errors are
reported by Flow.

For quick feedback on Flow's type checking, consider running
`docker-compose run app flow-watch`.

[Docker]: https://docker.com/
[flow]: https://flowtype.org/en/docs/types/comments/
