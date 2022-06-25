#!/bin/bash

set -eo pipefail

function show_help() {
  cat <<EOF
Function to build, push, and increment the semantic version number based on the provided arguments.
The version is used to tag the Docker image and the git commit.

Optional flags:
  – -i RELEASE_TYPE : increment version based on RELEASE_TYPE, which can be major|minor|patch.
  – -b              : build docker image.
  – -p              : push docker image to registry.
  The version to be used is:
   - if -i is used, the incremented version
   - otherwise if the working directory is clean (no modified files):
     the latest version
   - otherwise: 'devel'

Example $0 -bpi minor
EOF
}

dockerhub_username=denokera

function verify_version() {
  local VERSION="${1}"
  local semver_regex='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$'
  [[ $VERSION =~ $semver_regex ]]
}

# return the highest version git tag
# example: 1.0.0
function get_latest_tag() {
  git tag --sort=-version:refname | head -1
}


# return the incremented version, example: 1.2.3
function increment() {
  local LATEST_TAG=$(get_latest_tag)
  verify_version $LATEST_TAG
  local MAJOR=${BASH_REMATCH[1]:-0}
  local MINOR=${BASH_REMATCH[2]:-0}
  local PATCH=${BASH_REMATCH[3]:-0}
  local IMAGE_VERSION=""

  if [[ $RELEASE_TYPE == "major" ]]
  then
    IMAGE_VERSION="$((MAJOR+1)).0.0"
  elif [[ $RELEASE_TYPE == "minor" ]]; then
    IMAGE_VERSION="${MAJOR}.$((MINOR+1)).0"
  elif [[ $RELEASE_TYPE == "patch" ]]; then
    IMAGE_VERSION="${MAJOR}.${MINOR}.$((PATCH+1))"
  else
    >&2 echo "ERROR: can only use major or minor or patch as RELEASE_TYPE!"
    exit 1
  fi


  echo ${IMAGE_VERSION}
}

# set & return the git tag, example: 1.2.3
function tag_new_version() {
  local IMAGE_VERSION="${1}"
  if ! verify_version $IMAGE_VERSION
  then
    >&2 echo "ERROR: image version $IMAGE_VERSION is not a valid version!"
    exit 1
  fi
  git tag --annotate --message="Release ${VERSION}" $IMAGE_VERSION

  echo $IMAGE_VERSION
}


function main() {
  if [[ $RELEASE_TYPE ]]
  then
    local IMAGE_VERSION=$(increment)
    RELEASE_TAG=$(tag_new_version $IMAGE_VERSION)
    echo "Release tag ${RELEASE_TAG} added to HEAD."
  else
    if git diff --quiet
      then
      local IMAGE_VERSION=$(get_latest_tag)
      echo "Latest version: $IMAGE_VERSION"
    else
      local IMAGE_VERSION=devel
    fi
  fi

  if [[ $BUILD ]]
  then
    build_image $IMAGE_VERSION
  fi

  if [[ $PUSH ]]
  then
    push_image $IMAGE_VERSION
  fi
}


function build_image() {
  IMAGE_VERSION="${1}"
  docker build --network=host --file Dockerfile --tag ${dockerhub_username}/angular-website.mailnesia.com:${IMAGE_VERSION} .
}

function push_image() {
  IMAGE_VERSION="${1}"
  docker push --network=host ${dockerhub_username}/angular-website.mailnesia.com:${IMAGE_VERSION}
}

# process command line arguments
while getopts i:bp flag
do
  case "${flag}" in
    i) RELEASE_TYPE=${OPTARG};;
    b) BUILD=1;;
    p) PUSH=1;;
  esac
done

main

if [[ -z $RELEASE_TYPE && -z $BUILD && -z $PUSH ]]
then
  echo
  show_help
fi
