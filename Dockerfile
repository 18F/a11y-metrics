FROM node:7.7.4

ENV PATH /app/node_modules/.bin:$PATH

# Needed for Flow.
RUN apt-get update && apt-get install -y ocaml libelf-dev
