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

[Docker]: https://docker.com/
