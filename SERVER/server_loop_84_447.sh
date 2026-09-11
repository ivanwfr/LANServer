#!/bin/sh
#┌────────────────────────────────────────────────────────────────────────────┐
#│ server_loop.sh                                         _TAG(260819:17h:00) │
#└────────────────────────────────────────────────────────────────────────────┘

trap 'kill %1 2>/dev/null' INT

RESTART_DELAY=1

while true; do
  node --trace-deprecation ./SERVER/server.js &
  wait
  echo "RELOADING..."
  sleep $RESTART_DELAY
done
