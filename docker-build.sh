#!/bin/bash
ENV_VERSION=cms-adapt-0.0.7
ECR=



function display_message {
  echo ""
  echo "<<==================================================================================>>"
  echo "$1"
  echo "<<==================================================================================>>"
}

display_message "Building the deploy image... " && \
${DRY_RUN} docker build --platform=linux/amd64  -t edugix/authoring:${ENV_VERSION} . && \
display_message "Successfully build ${ENV_VERSION}  images"
display_message "Pushing the new ${ENV_VERSION}  images..." &&
${DRY_RUN} docker tag edugix/authoring:${ENV_VERSION}  ${ECR}/authoring:${ENV_VERSION}
${DRY_RUN} docker login -u AWS -p $(aws ecr get-login-password --profile lms --region ap-southeast-1) ${ECR} && \
${DRY_RUN} docker push ${ECR}/authoring:${ENV_VERSION} && \
display_message "Successfully push docker ${ENV_VERSION}  images"
