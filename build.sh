#!/bin/bash


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

# Note that if a function output is captured like result=$(the_function), this means the_function runs in a subshell,
# therefore even if it contains `exit 1`, that only exits the subshell (not the main script), and the result would be
# empty.

dockerhub_username=denokera
semver_regex='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$'

function verify_version() {
  if ! [[ ${1} =~ $semver_regex ]]
  then
    >&2 echo "ERROR: image version \'$IMAGE_VERSION\' is not a valid version!"
    exit 1
  fi
}

# return the highest version git tag, example: 1.0.0, or the first version: 0.0.1
function get_latest_tag() {
  local VERSION=$(git tag --sort=-version:refname | head -1)
  if [[ -n $VERSION ]]
  then
    echo $VERSION
  else
    echo 0.0.1
  fi
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
  fi


  echo ${IMAGE_VERSION}
}

# set & return the git tag, example: 1.2.3
function tag_new_version() {
  local IMAGE_VERSION="${1}"
  verify_version $IMAGE_VERSION
  git tag --annotate --message="Release ${VERSION}" $IMAGE_VERSION

  echo $IMAGE_VERSION
}


function main() {
  if [[ $RELEASE_TYPE ]]
  then
    local IMAGE_VERSION=$(increment)
    if [[ -z $IMAGE_VERSION ]]
    then
      exit 1
    fi
    RELEASE_TAG=$(tag_new_version $IMAGE_VERSION)
    if [[ -z $RELEASE_TAG ]]
    then
      exit 1
    fi
    echo "Release tag ${RELEASE_TAG} added to HEAD."
  else
    if git diff --quiet
      then
      local IMAGE_VERSION=$(get_latest_tag)
      echo "Latest version: \'$IMAGE_VERSION\'"
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
  DOCKER_TAG="${dockerhub_username}/angular-website.mailnesia.com:${IMAGE_VERSION}"
  echo "Building image: $DOCKER_TAG"
  docker build --file Dockerfile --tag $DOCKER_TAG .
}

function push_image() {
  IMAGE_VERSION="${1}"
  DOCKER_TAG="${dockerhub_username}/angular-website.mailnesia.com:${IMAGE_VERSION}"
  echo "Pushing image: $DOCKER_TAG"
  docker push $DOCKER_TAG
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
