#!/bin/bash

RUN_WHAT=$1
NUM_BLOCKS=$2
ITERATIONS=$(node ./backend/index.js --run=iterations --event=${RUN_WHAT} --num-blocks=${NUM_BLOCKS})
COUNTER=1
while [  $COUNTER -le $ITERATIONS ]; do
  echo "Process ${COUNTER} of ${ITERATIONS}"
  node backend/index.js --run=populate-db --event=${RUN_WHAT} --num-blocks=${NUM_BLOCKS}
  let COUNTER=COUNTER+1
done
