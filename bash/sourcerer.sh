#!/bin/bash
_LOCKFILE="$(pwd)/.logs/.freecodecamp-os-lockfile"

if [ -f "$_LOCKFILE" ]; then
  _AGE=$(( $(date +%s) - $(stat -c %Y "$_LOCKFILE") ))
  if [ "$_AGE" -lt 10 ]; then
    _FREECODECAMP_NO_LOG=1
  fi
  rm "$_LOCKFILE"
fi
unset _LOCKFILE _AGE

source ./bash/.bashrc
echo "BashRC Sourced"
