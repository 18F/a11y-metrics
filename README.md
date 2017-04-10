[![Build Status](https://travis-ci.org/18F/a11y-metrics.svg?branch=master)](https://travis-ci.org/18F/a11y-metrics)

This is an experiment in obtaining accessibility metrics across all
18F projects.

## Quick start

You'll need [Docker][].

```
docker-compose pull
docker-compose run app yarn
docker-compose run app yarn build
```

This will output the static website at `static/`, including an
accompanying JS bundle for progressive enhancement.

## Developing the front-end

To develop the front-end, run:

```
docker-compose up
```

Then visit `http://localhost:8080/` (or the same port on your Docker host)
in your browser.

Note that the front-end currently only regenerates its JS bundle when you
edit files; it does not regenerate `index.html`, which means that you
may see a warning in your console with a message like this:

```
React attempted to reuse markup in a container but the checksum was invalid.
```

Manually re-building the static site should get rid of this warning; if
it *doesn't*, however, then you've got a problem. Consider delaying any
functionality requiring JS (or specific browser features) until the
React app is mounted in the DOM, so that the initial render of the app
is identical to the static render present in `index.html`.

To quickly see what the dashboard looks like without JavaScript enabled,
add `nojs=on` to the querystring, e.g. `http://localhost:8080/?nojs=on`.

## Adding new 18F projects to track

Currently, the list of 18F projects is actually automatically generated
by iterating through all the GitHub repositories in the 18F organization
(and possibly other related ones) and filtering for the ones that
have a homepage set, along with a minimum number of open issues or
stars.

For more details on this criteria, and on tweaking its parameters,
see [`lib/config.js`][].

We may add an explicit mechanism to allow specific projects to be
tracked in the future.

## Environment-controlled configuration options

Some configuration options can be modified via environment variables.

During development, this is most easily done by creating a `.env` file
containing name-value pairs, e.g.:

```
GITHUB_API_TOKEN=blarg
```

For more details on available configuration options, see [`lib/config.js`][].

## Clearing cached data

All cached data is placed in the `cache` subdirectory. You can delete it
entirely to reset the whole cache, or delete individual subdirectories
or files within it to reset a subset of the cache.

## Testing

We use [Jest][] for tests; tests are in the `test` subdirectory. Run
`docker-compose run app jest --watch` to run the tests and continuously
watch for changes.

We also use [Flow's comment syntax][flow] for strong typing,
and `docker-compose run app yarn test` will fail if any errors are
reported by Flow.

For quick feedback on Flow's type checking, consider running
`docker-compose run app yarn flow:watch`.

## Deployment

Deployment is currently done by a [Travis cron job][] which rebuilds the
dashboard on a daily basis and pushes the new site to the `static-site`
branch. This push is then detected by [Federalist][], which re-deploys
the live site.

[Docker]: https://docker.com/
[flow]: https://flowtype.org/en/docs/types/comments/
[Jest]: http://facebook.github.io/jest/
[`lib/config.js`]: lib/config.js
[Travis cron job]: https://docs.travis-ci.com/user/cron-jobs/
[Federalist]: https://federalist.18f.gov/
