#!/usr/bin/env source
# -*- coding: utf-8 -*-
# This wrapper script is mainly for local development purpose only.
#
# Sourcing this script will perform:
#   1. get required config values from SSM Parameter Store
#   2. export them as REACT_x environment variables
#
# REQUIRED CLI:
# aws, jq
#
# USAGE:
#
# Otherwise source it standalone itself by:
#     source start.sh
#     source start.sh unset
#
#
# Try to be POSIX-y. Only tested on macOS! Contrib welcome for other OSs.

if [ "$(ps -p $$ -ocomm=)" = 'zsh' ] || [ "${BASH_SOURCE[0]}" -ef "$0" ]
then
    ps -p $$ -oargs=
    echo "YOU SHOULD SOURCE THIS SCRIPT, NOT EXECUTE IT!"
    exit 1
fi

command -v aws >/dev/null 2>&1 || {
  echo >&2 "AWS CLI COMMAND NOT FOUND. ABORTING..."
  return 1
}

command -v jq >/dev/null 2>&1 || {
  echo >&2 "JQ COMMAND NOT FOUND. ABORTING..."
  return 1
}

if [ -n "$1" ] && [ "$1" = "unset" ]; then
  unset REACT_APP_BUCKET_NAME
  unset REACT_APP_DATA_PORTAL_API_DOMAIN
  unset REACT_APP_REGION
  unset REACT_APP_COG_USER_POOL_ID
  unset REACT_APP_COG_APP_CLIENT_ID
  unset REACT_APP_OAUTH_DOMAIN
  unset REACT_APP_OAUTH_REDIRECT_IN
  unset REACT_APP_OAUTH_REDIRECT_OUT
  echo "UNSET REACT ENV VAR"
  return 0
fi

# Illumination parmeter
bucket_name=$(aws ssm get-parameter --name '/illumination/bucket_name' | jq -r .Parameter.Value)
if [[ "$bucket_name" == "" ]]; then
  echo "Halt, No valid AWS login session found. Please 'aws sso login --profile dev && export AWS_PROFILE=dev'"
  return 1
fi
cog_identity_pool_id=$(aws ssm get-parameter --name '/illumination/cog_identity_pool_id' | jq -r .Parameter.Value)

# Change SSM parameter path for online/local deployment
if [ "$1" = "local" ]; then
  cog_app_client_id=$(aws ssm get-parameter --name '/data_portal/client/cog_app_client_id_local' | jq -r .Parameter.Value)
  oauth_redirect_in=$(aws ssm get-parameter --name '/data_portal/client/oauth_redirect_in_local' | jq -r .Parameter.Value)
  oauth_redirect_out=$(aws ssm get-parameter --name '/data_portal/client/oauth_redirect_out_local' | jq -r .Parameter.Value)
elif [ "$1" = "deploy" ]; then
  cog_app_client_id=$(aws ssm get-parameter --name '/illumination/cognito_app_client_id' | jq -r .Parameter.Value)
  oauth_redirect_in=$(aws ssm get-parameter --name '/illumination/oauth_redirect_in_stage' | jq -r .Parameter.Value)
  oauth_redirect_out=$(aws ssm get-parameter --name '/illumination/oauth_redirect_out_stage' | jq -r .Parameter.Value)
else
  echo "No Option mastch for $1"
  return 0
fi

# Common SSM 
cog_user_pool_id=$(aws ssm get-parameter --name '/data_portal/client/cog_user_pool_id' | jq -r .Parameter.Value)
data_portal_client_domain=$(aws ssm get-parameter --name '/hosted_zone/umccr/name' | jq -r .Parameter.Value)
oauth_domain=$(aws ssm get-parameter --name '/data_portal/client/oauth_domain' | jq -r .Parameter.Value)

# App
export REACT_APP_BUCKET_NAME=$bucket_name
export REACT_APP_REGION=ap-southeast-2
export REACT_APP_ICA_ENDPOINT=https://ica.illumina.com/ica/rest
export REACT_APP_ICAV2_JWT=$ICAV2_ACCESS_TOKEN

# Cognito
export REACT_APP_COG_USER_POOL_ID=$cog_user_pool_id
export REACT_APP_COG_APP_CLIENT_ID=$cog_app_client_id
export REACT_APP_COG_IDENTITY_POOL_ID=$cog_identity_pool_id

# Oauth
export REACT_APP_OAUTH_DOMAIN=$oauth_domain
export REACT_APP_OAUTH_REDIRECT_IN=$oauth_redirect_in
export REACT_APP_OAUTH_REDIRECT_OUT=$oauth_redirect_out
env | grep REACT


# Deployment script
if [ "$1" = "local" ]; then
  yarn
  yarn start
elif [ "$1" = "deploy" ]; then
  yarn build
  yarn deploy
else
  echo "No Option mastch for $1"
  return 0
fi
