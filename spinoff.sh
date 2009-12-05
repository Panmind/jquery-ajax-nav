#!/bin/bash

for source in *.js; do
  [ ! -f ../$source ] && continue

  colordiff -u $source ../$source
  [ $? -eq 0 ] && continue # No changes

  echo
  echo -ne "\033[1;31mAdd this patch?\033[0m "
  read x

  [ "X$x" != 'Xy' ] && continue # Don't apply

  diff -u $source ../$source | patch -p0
done
