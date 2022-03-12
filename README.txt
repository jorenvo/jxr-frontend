Run with: npx http-server -c-1 ./dist

$PWD/jxr-indexed-code is a directory containing code that will be searchable. It will be copied into dist/, this keeps webserver configuration simple.

TODO
====
To avoid large recursive copies, symlink jxr-indexed-code instead.