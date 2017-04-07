#!/bin/bash

# This script is based on:
# http://www.steveklabnik.com/automatically_update_github_pages_with_travis_example/

# Note that the static files branch (specified by STATIC_BRANCH) must exist
# at the time this script is run. You may want to create an orphan branch
# using the instructions at http://stackoverflow.com/a/4288660/2422398.

set -o errexit -o nounset

export SOURCE_BRANCH="master"
export STATIC_BRANCH="static-site"
export REPO="18F/a11y-metrics"
export STATIC_DIR="static"
export USER_NAME="Atul Varma"
export USER_EMAIL="atul.varma@gsa.gov"

if [ "$TRAVIS_BRANCH" != "$SOURCE_BRANCH" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not $SOURCE_BRANCH! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cp .travis.yml $STATIC_DIR

cd $STATIC_DIR

git init
git config user.name $USER_NAME
git config user.email $USER_EMAIL

git remote add upstream "https://$GITHUB_API_TOKEN@github.com/$REPO.git"
git fetch upstream
git reset upstream/$STATIC_BRANCH

touch .

git add -A .
git commit -m "rebuild static site at ${rev}"
git push -q upstream HEAD:$STATIC_BRANCH
