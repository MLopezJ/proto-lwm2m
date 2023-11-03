#!/bin/bash

set -e
set -x

for DIR in generator lwm2m markdown models senml
do
    npx swc -C jsc.experimental.keepImportAttributes=true -C jsc.experimental.emitAssertForImportAttributes=true -d dist/$DIR ./$DIR
done


