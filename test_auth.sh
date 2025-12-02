#!/bin/bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmOTZlNmFlOC1lYmYwLTQyYTItYWI5NS0yZmZlNDUxMTI5YTQiLCJlbWFpbCI6ImFkbWluQGxleGlmbG93LmNvbSIsIm9yZ2FuaXphdGlvbl9pZCI6IjQzMTRiNzUwLTM4MGYtNGMzYy04Y2ZmLTkzOTk1Mzk0ZWM1OCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2NDY0MzQ2NywiZXhwIjoxNzY0NzI5ODY3fQ.oQtLZZgVlIWQjAY11f3QKIoU6wRl6Ngv2GqIjfj1kLM"
curl -v -X PUT http://localhost:3001/api/v1/user-profiles/user/f96e6ae8-ebf0-42a2-ab95-2ffe451129a4/last-active \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'
