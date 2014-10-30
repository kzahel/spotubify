rm package.zip

zip package.zip -r *.js *.html flowplayer.full/*.swf flowplayer.full/*.js flowplayer.full/example/index*.js flowplayer.full/example/index*.html flv*.png cws_32*.png manifest.json web-server-chrome/*.js bin/index.html bin/js/*.js bin/Jar*.swf -x package.sh -x *.git* -x bin/* -x bin/js/* -x jquery* -x index_old.html

