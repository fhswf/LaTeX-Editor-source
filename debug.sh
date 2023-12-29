#!/bin/bash
# ==============================================================================
#
#          FILE: debug.sh
#
#         USAGE: ./debug.sh
#
#   DESCRIPTION: This script builds the web application in a local directory
#                named 'debug'.
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Fabian Eberts
#  ORGANIZATION: ---
#       CREATED: ---
#      REVISION: ---
#
# ==============================================================================

TARGET_DIR=debug
rm -rf "$TARGET_DIR" &>/dev/null && mkdir "$TARGET_DIR"
./build.sh "$TARGET_DIR" gituser/example-repo latex.example.net
