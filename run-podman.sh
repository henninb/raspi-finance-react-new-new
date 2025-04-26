#!/bin/sh

date=$(date '+%Y-%m-%d')
ENV=$1
APP=raspi-finance-react
# export NODE_OPTIONS=--openssl-legacy-provider
export BROWSER=browser-start

if [ $# -ne 1 ]; then
  echo "Usage: $0 <prod|dev>"
  exit 1
fi

if [ "$ENV" = "prod" ] || [ "$ENV" = "dev" ]; then
  echo "${ENV}"
else
  echo "Usage: $0 <prod|dev>"
  exit 2
fi

HOST_IP=192.168.10.10

export HOST_IP
export CURRENT_UID="$(id -u)"
export CURRENT_GID="$(id -g)"

echo HOST_IP=$HOST_IP

mkdir -p ssl
rm -rf build

echo npm run build
# npm run build
if [ "$ENV" = "prod" ]; then
  if ! npm run build; then
    echo "npm build failed"
    exit 1
  fi

  export PODMAN_HOST=ssh://henninb@192.168.10.10/run/user/1000/podman/podman.sock
  export CONTAINER_HOST=ssh://henninb@192.168.10.10/run/user/1000/podman/podman.sock
  podman stop raspi-finance-react
  podman rm -f raspi-finance-react
  podman rmi raspi-finance-react
  podman rmi -f $(podman images -q -f dangling=true)

  podman compose build
  podman compose up -d
  podman ps -a
else
  echo npx npm-check-updates -u
  echo npx depcheck
  npm run prettier
  npm install
  npm test
  NODE_OPTIONS=--openssl-legacy-provider yarn start
fi

exit 0
