#!/bin/sh
# Starts MongoDB, seeds it, then runs the app. Used by Dockerfile.render.
set -e

mkdir -p /data/db
# A small cache keeps mongod and the app inside the free tier's 512 MB.
mongod --dbpath /data/db --bind_ip 127.0.0.1 --wiredTigerCacheSizeGB 0.25 \
  --fork --logpath /var/log/mongod.log > /dev/null

i=0
until mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  i=$((i + 1))
  if [ "$i" -gt 60 ]; then
    echo "MongoDB did not start" >&2
    tail -n 30 /var/log/mongod.log >&2
    exit 1
  fi
  sleep 1
done

node scripts/seed.js
exec node app.js
