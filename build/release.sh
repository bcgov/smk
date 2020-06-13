#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

# npm test || exit 1

echo "Existing tags:"
git tag

echo
echo "Ready to release SMK v$VERSION."
echo "Has the version number been bumped?"
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key
echo

git checkout -b build

npm run build

echo
echo "Creating git tag v$VERSION..."
echo

git add dist --force --all
git commit -m "v$VERSION"
git tag v$VERSION --force
# git push --tags --force

# echo "Uploading to NPM..."
# npm publish

git checkout master
git branch -D build

echo
echo "All done."
# echo "Remember to run 'npm run-script integrity' and then commit the changes to the master branch, in order to update the website."
