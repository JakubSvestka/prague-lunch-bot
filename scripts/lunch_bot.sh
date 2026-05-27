#!/bin/bash

TOKEN=""
POST_ON_SLACK=$([ "$1" = "slack" ] && echo true || echo false)

curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  https://api.github.com/repos/JakubSvestka/prague-lunch-bot/actions/workflows/menu.yml/dispatches \
  -d "{
    \"ref\": \"main\",
    \"inputs\": {
      \"post_on_slack\": $POST_ON_SLACK
    }
  }"