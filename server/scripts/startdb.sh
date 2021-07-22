#! /usr/bin/env bash
docker run \
  --name e-commerce-postgresql \
  -e POSTGRES_PASSWORD=secret \
  -p 5433:5432 \
  -v `pwd`/db-data:/var/lib/postgresql/data \
  -d postgres
