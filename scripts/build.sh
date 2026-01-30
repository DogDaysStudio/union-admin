#!/bin/sh

echo "当前目录：`pwd`"

VERSION=${VERSION:-uat}
PROJECT=${PROJECT:-uni-platform-admin}
GROUP=${GROUP:-anjueasy}
REGISTRY=${REGISTRY:-'registry.cn-shanghai.aliyuncs.com'}

TRIGGER_URL='https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjMTNmMDc4M2ZjMDdlNDhiODgzOGRkOWY0MzcwMDEyNjEiLCJpZCI6IjIxNzg0NyJ9.H2ljPLcOgITC8N-FQnA4FXAviBZiR5D7z4tc4OfrtjFzeDa3FpeL51115J6y8WRzg9ZPpPt4z_DxCgLVSG9MpLG41NOembFsWInV78XtJAd-nf9E3_mYWmrbPWz_6-TIIOQI1hEskLE9mtQKuQFhq3mNG4bXJHrymZpKEJedz-0'
TRIGGER_URL_PROD='https://cs.console.aliyun.com/hook/trigger?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVzdGVySWQiOiJjMTNmMDc4M2ZjMDdlNDhiODgzOGRkOWY0MzcwMDEyNjEiLCJpZCI6IjIxODgyNSJ9.KvYUeOTQNeCzXfGmboUrz9kwQTE8re5J-OxChinUHBY9URNS2spgJnpCxg1CAgotgqqSQzWTJkkBWIftyfoMWLx_qnej3kUnVIC6jJFyRqNhzn9PgMg-s4a6WqTAXIJ72E1KdA9RvrjrCW7vYvl1yuay8YqN5a8ln6yQuJcAclE'
WEB_HOOK='https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=8967c374-ec98-48f2-8ea2-3fe8eb1a7fa7'

CI=false
export GENERATE_SOURCEMAP=false

send_msg() {
  curl "$WEB_HOOK" -H 'Content-Type: application/json' -d '{"msgtype": "text", "text": {"content": "'"$1"'"}}'
}

if [ "$VERSION" = "prod" ]; then
  echo "正在打包生产版本"
  export VITE_APP_ENV=prod
  # GENERATE_SOURCEMAP=false VITE_APP_ENV=prod npm run build
else
  echo "正在打包 uat 版本"
  # GENERATE_SOURCEMAP=false npm run build
fi

pnpm run build
result=$?
msg="前端WEB发布: $PROJECT - $VERSION"

if [ $result -ne 0 ]; then
  msg=$msg" - 打包失败，请尽快处理！！"
  send_msg "$msg"
  exit $result
fi

TAG="$REGISTRY/$GROUP/$PROJECT:$VERSION"

docker build . -t "$TAG" --platform=linux/amd64

docker push "$TAG"

if [ "$?" -eq 0 ]; then
  curl $TRIGGER_URL
  send_msg "$msg"
else
  echo "推送失败，请查看log信息！"
fi
