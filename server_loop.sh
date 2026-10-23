#!/bin/sh
#┌────────────────────────────────────────────────────────────────────────────┐
#│ server_loop.sh                                         _TAG(261023:22h:23) │
#└────────────────────────────────────────────────────────────────────────────┘
Taskkill /FI "IMAGENAME eq node.exe"  /F 2>/dev/null

trap        'INTERRUPTED=1; kill %1 2>/dev/null;' SIGINT

RESTART_DELAY=1
while true; do
  # node process {{{
  tput clear
             INTERRUPTED=0
  #......................... --inspect[=[host:]port] (default: 127.0.0.1:9229)
  #ode --trace-deprecation --inspect --title=server_loop ./SERVER/server.js &
  node --trace-deprecation --inspect                     ./SERVER/server.js &
  wait $!
             NODE_ERROR=$?
  #}}}
  # 1/2 HANDLED Node.js ERROR .. from process.exit() {{{
echo  "NODE_ERROR==[$NODE_ERROR]"
  if [      "$NODE_ERROR" -ne 0 ] && [ "$NODE_ERROR" -ne 130 ]
  then
      echo  "NODE_ERROR==[$NODE_ERROR]"
      echo  "...Exiting"
      echo
      sleep $RESTART_DELAY
      exit  0
  fi
  echo      "...Reloading"
  #}}}
  # 2/2 OTHER ERROR OR INTERRUPTION Ctrl+C {{{
  echo      "INTERRUPTED=[$INTERRUPTED]"
  #}}}
  # PROMPT USER FOR Ctrl+C to exit the loop {{{
  echo
  echo -n   "...ENTER A QUICK Ctrl+C TO EXIT: "
             INTERRUPTED=0
  sleep     $RESTART_DELAY
  #}}}
  # RELOAD if no Ctrl+C within RESTART_DELAY {{{
  if [      "$INTERRUPTED" -eq 1 ]
  then
      echo  "...Exiting"
      echo
      sleep $RESTART_DELAY
      exit  0
  fi
  echo      "...Reloading"
  #}}}
done
