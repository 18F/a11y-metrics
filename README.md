This is an experiment in obtaining accessibility metrics across all
18F projects.

## Quick start

You'll need [Docker][].

```
docker-compose pull
docker-compose run app yarn
docker-compose run app node axe-stats.js
```

This is very much a **work in progress**. Right now we're just obtaining
metrics and caching them; we still need to export the information in
a format that is nice and human-readable.

## Adding new 18F projects to track

Just add an entry to `websites.json`.

[Docker]: https://docker.com/
