#!/bin/bash
ENV_VERSION=icms-authoring-tool-0.1.21
ECR=183631338529.dkr.ecr.ap-southeast-1.amazonaws.com


function display_message {
  echo ""
  echo "<<==================================================================================>>"
  echo "$1"
  echo "<<==================================================================================>>"
}

display_message "Building the deploy image... " && \
${DRY_RUN} docker build --platform=linux/amd64  -t edugix/icms:${ENV_VERSION} . && \
display_message "Successfully build ${ENV_VERSION}  images"
display_message "Pushing the new ${ENV_VERSION}  images..." &&
${DRY_RUN} docker tag edugix/icms:${ENV_VERSION}  ${ECR}/icms:${ENV_VERSION}
${DRY_RUN} docker login -u AWS -p $(aws ecr get-login-password --profile icms --region ap-southeast-1) ${ECR} && \
${DRY_RUN} docker push ${ECR}/icms:${ENV_VERSION} && \
display_message "Successfully push docker ${ENV_VERSION}  images"
