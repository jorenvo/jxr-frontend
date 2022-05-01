#!/usr/bin/env bash
set -eou pipefail

echo 'Running post_build...'

cp "${PWD}"/src/*.html dist/
cp "${PWD}"/src/*.css dist/
cp libs/*.js dist/js/
cp libs/*.css dist/
cp favicon/* dist/

# This echo statement also acts as a safeguard against running without defining JXR_BACKEND.
echo "Replacing JXR_BACKEND with ${JXR_BACKEND}...  "
# Can't double quote ${...} because: echo "\" => \\
sed -i.bak s/JXR_BACKEND/${JXR_BACKEND//\//\\\/}/g dist/js/*.js

echo "Replacing JXR_INDEXED_CODE_ROOT with ${JXR_INDEXED_CODE_ROOT}...  "
sed -i.bak s/JXR_INDEXED_CODE_ROOT/${JXR_INDEXED_CODE_ROOT//\//\\\/}/g dist/js/*.js

# if [ "${JXR_BACKEND}" = "http://localhost:8081" ]; then
#     echo "Copying some test indexed code..."
#     mkdir dist/jxr-code
#     cp -r ~/Code/jxr-backend ~/Code/SameBoy dist/jxr-code
# fi
