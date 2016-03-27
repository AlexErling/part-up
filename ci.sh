#!/bin/bash

set -eu

# Doing this in two steps so that the script fails if GIT_BRANCH is not set.
git_branch=${GIT_BRANCH}
vault_password=${VAULT_PASS}

image_tag=${git_branch#*/}
image_name="partup/partup:${image_tag}"

echo "{\"version\": \"`git describe`\", \"deploydate\": \"`date +\"%Y-%m-%dT%H:%M:%SZ\"`\"}" > app/public/VERSION

docker build -t ${image_name} app/

docker push ${image_name}

if [ ! -f config/development/env-encrypted ] ; then
	echo "This branch can't be auto-deployed to docker cloud, exiting.."
	exit 0
fi

service_name="staging-${image_tag:0:17}-meteor"
service=$(docker-cloud service ps | tail -n +2 | awk '{print $1}' | grep ${service_name} || echo 'NOTHING')

if [ "${service_name}" != "${service}" ] ; then
  echo ${vault_password} > ./.vaultpass
  ansible-vault decrypt --output=./.cloud-env --vault-password-file=./.vaultpass config/development/env-encrypted
  rm ./.vaultpass

  vhost=${image_tag}.staging.part-up.com

  echo "Creating service ${service_name}"
  docker-cloud service create \
  	-n ${service_name} \
    --memory 512 \
    --env-file ./.cloud-env \
    -e MONGO_URL=mongodb://staging-mongo-1,staging-mongo-2,staging-mongo-3/${image_tag}-meteor?replicaSet=rs01 \
    -e ROOT_URL=http://${vhost} \
		-e VIRTUAL_HOST=https://${vhost} \
		-e FORCE_SSL=TRUE \
		-e NODE_ENV=staging \
		-e NEW_RELIC_APP_NAME=${service_name} \
    --tag staging \
    --autoredeploy \
    --autorestart ALWAYS \
    --sync \
    ${image_name}

  rm ./.cloud-env

	certificator=$(docker-cloud container ps -s Running --service staging-certificator -q)
	docker-cloud container exec $certificator /request-cert.sh $service_name $vhost

  echo "Starting service ${service_name}"
  docker-cloud service start --sync ${service_name}

  echo "Updating HAProxy..."
  links=$(docker-cloud service inspect staging-haproxy | jq -r '.linked_to_service[].name')
  linkCmd="--link-service ${service_name}:${service_name}"
  for l in ${links}; do
  	linkCmd="${linkCmd} --link-service ${l}:${l}"
  done
  docker-cloud service set ${linkCmd} staging-haproxy
	docker-cloud service redeploy staging-haproxy
else
  echo "Service ${service_name} already exists.. Not changing"
fi
