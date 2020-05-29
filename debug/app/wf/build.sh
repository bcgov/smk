BASE=../..
DEST=/Users/ben/Projects/wfone-public-mobile-war/wfone-public-mobile-war/src/main/angular/src/assets/js/smk

grunt --gruntfile $BASE/src/gruntfile.js release
 
cp $BASE/smk.js $DEST              && echo "copied $BASE/smk.js"
cp -r $BASE/images/* $DEST/images  && echo "copied $BASE/images"
cp map-config.json $DEST           && echo "copied map-config.json"
cp layer-display-config.json $DEST && echo "copied layer-display-config.json"
cp -r layers $DEST                 && echo "copied layers"
