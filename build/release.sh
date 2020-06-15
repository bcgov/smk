#!/bin/bash

VERSION=$(node --eval "console.log(require('./package.json').version);")
echo "Ready to build SMK v$VERSION into gh-pages."

echo
echo "Existing tags:"
git tag
git status

echo
echo "Has the version number been bumped? Is this the master branch?"
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key
echo

echo "Is gh-pages already present?"
echo 
git branch | grep gh-pages
git branch -r | grep gh-pages

read -n1 -r -p "Ok to delete gh-pages? Press Ctrl+C to cancel, or any other key to continue." key

echo
echo "Recreating gh-pages branch..."
echo

git branch -D gh-pages
git push origin --delete gh-pages

git checkout -b gh-pages

echo
echo "Building..."
echo

npm run build

echo
echo "Creating git tag v$VERSION..."
echo

git add dist --force --all
git commit -m "v$VERSION"
git tag v$VERSION --force

git push --set-upstream origin gh-pages
git push --all --force

git checkout master

echo
echo "All done."
