#!/usr/bin/env bash
set -e

#
cp README.md ghpage/src/
npm run prepublishOnly
cd "ghpage";
npm install && npm start
