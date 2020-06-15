#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")

# npm test || exit 1

echo "Existing tags:"
git tag

echo
echo "Ready to build SMK v$VERSION into gh-pages."
echo "Has the version number been bumped?"
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key
echo

echo "Is gh-pages already present?"
echo 
git branch | grep gh-pages
git branch -r | grep gh-pages

read -n1 -r -p "Ok to delete gh-pages? Press Ctrl+C to cancel, or any other key to continue." key

git branch -D gh-pages
git push origin --delete gh-pages

git checkout -b gh-pages
# git merge master
# git checkout -b build

npm run build

echo
echo "Creating git tag v$VERSION..."
echo

git add dist --force --all
git commit -m "v$VERSION"
git tag v$VERSION --force

git push --set-upstream origin gh-pages
git push --all --force
# git checkout gh-pages
# read -n1 -r -p "Merge ok? Press Ctrl+C to cancel, or any other key to continue." key
# echo "Uploading to NPM..."
# npm publish
# git commit -m "v$VERSION"

git checkout master
# git branch -D build

echo
echo "All done."
# echo "Remember to run 'npm run-script integrity' and then commit the changes to the master branch, in order to update the website."
