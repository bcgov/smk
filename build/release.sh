#!/bin/bash

BUMP=${1:-patch}

VERSION=$( node --eval "console.log( require( './package.json' ).version )" )
NEXT=$( semver $VERSION -i $BUMP )

echo ------------------------------------------------------------------
echo "SMK is now v$VERSION, next will be v$NEXT"
echo ------------------------------------------------------------------
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key

if npm version $BUMP ; then
    echo "Set version to v$NEXT"
else
    echo "Failed to set version to v$NEXT"
    exit 1
fi

VERSION=$( node --eval "console.log( require( './package.json' ).version )" )
git push origin

echo ------------------------------------------------------------------
echo "Ready to build, branch, tag, and publish SMK v$VERSION."
echo ------------------------------------------------------------------

echo
echo "Existing tags:"
git tag
git status

echo
echo "Has the version number been bumped? Is this the master branch?"
read -n1 -r -p "Press Ctrl+C to cancel, or any other key to continue." key

echo
echo "Is branch v$VERSION already present?"
echo
git branch | grep v$VERSION
git branch -r | grep v$VERSION

read -n1 -r -p "If branch v$VERSION is present, hit Ctrl+C now. Any other key to continue." key

echo
echo "Checkout v$VERSION branch..."
echo

git checkout -b v$VERSION

echo
echo "Building..."
echo

if npm run build ; then
    echo "Build was successful"
else
    echo "Build failed"
    exit 1
fi

echo
echo "Creating git tag v$VERSION..."
echo

git add dist --force --all
git commit -m "v$VERSION"
git tag v$VERSION --force

git push --set-upstream origin v$NEXT
git push --tags --force

echo
echo "Publish"
echo

npm publish --access public

echo

git checkout master

echo
echo "All done."
