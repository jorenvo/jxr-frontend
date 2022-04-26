
$PWD/jxr-indexed-code is a directory containing code that will be searchable. It will be copied into dist/, this keeps webserver configuration simple.

TODO
====
To avoid large recursive copies, symlink jxr-indexed-code instead.
Bug on trailing files

Run locally
===========
Frontend:
- JXR_BACKEND=http://localhost:8081 npm run watch
- npx http-server -c-1 -p 8080 ./dist

Backend:
- JXR_CODE_DIR=~/Code/jxr-frontend/dist/jxr-code RUST_BACKTRACE=1 cargo run
- npx http-server -c-1 -p 8081 --cors --proxy 'http://127.0.0.1:8000'