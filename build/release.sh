#!/bin/bash

BUMP=${1:-patch}

# VERSION=$(node --eval "console.log(require('./package.json').version + '.' + (new Date()).toISOString().replace(/[^0-9]/g,'').slice(0,-5) );")
VERSION=$( node --eval "console.log( require( './package.json' ).version )" )
NEXT=$( semver $VERSION -i $BUMP )

echo ------------------------------------------------------------------
echo "SMK is now v$VERSION, next will be v$NEXT"
echo ------------------------------------------------------------------
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key

npm version $BUMP
VERSION=$( node --eval "console.log( require( './package.json' ).version )" )
git push origin

echo ------------------------------------------------------------------
echo "Ready to build SMK v$VERSION, deploy to gh-pages, and publish."
echo ------------------------------------------------------------------

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

npm run release

echo
echo "Creating git tag v$VERSION..."
echo

git add dist --force --all
git commit -m "v$VERSION"
git tag v$VERSION --force

git push --set-upstream origin gh-pages
git push --tags --force

echo
echo "Publish"
echo

npm publish --access public

echo

git checkout master

echo
echo "All done."
