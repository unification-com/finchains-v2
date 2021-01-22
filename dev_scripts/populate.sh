#!/bin/bash

function format_seconds() {
  (($1 >= 86400)) && printf '%d days and ' $(($1 / 86400)) # days
  (($1 >= 3600)) && printf '%02d:' $(($1 / 3600 % 24))     # hours
  (($1 >= 60)) && printf '%02d:' $(($1 / 60 % 60))         # minutes
  printf '%02d%s\n' $(($1 % 60)) "$( (($1 < 60 )) && echo ' s.' || echo '')"
}

RUN_WHAT=$1
NUM_BLOCKS=$2
ITERATIONS=$(node ./backend/index.js --run=iterations --event=${RUN_WHAT} --num-blocks=${NUM_BLOCKS})
COUNTER=1
TOTAL_TIME=0
while [  $COUNTER -le $ITERATIONS ]; do
  START_TIME=`date +%s`
  echo "Process ${COUNTER} of ${ITERATIONS}"
  node backend/index.js --run=populate-db --event=${RUN_WHAT} --num-blocks=${NUM_BLOCKS}
  END_TIME=`date +%s`
  RUN_TIME=$((END_TIME-START_TIME))
  TOTAL_TIME=$((TOTAL_TIME+RUN_TIME))
  MEAN_TIME=$(($TOTAL_TIME/$COUNTER))
  let COUNTER=COUNTER+1
  NUM_LEFT=$((ITERATIONS-COUNTER))
  EST_TIME_LEFT=$(($NUM_LEFT*$MEAN_TIME))
  echo "Estimated time left: $(format_seconds $EST_TIME_LEFT)"
done

echo "Total time taken: $(format_seconds $TOTAL_TIME)"
