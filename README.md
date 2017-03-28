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

[Docker]: https://docker.com/
