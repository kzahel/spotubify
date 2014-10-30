this is a work in progress

the idea is to have a chrome app that you sign in using your spotify
account and then play your playlists/tracks but by searching youtube
for the album/track/title and playing in a small embed window.

development instructions
=========
this project uses some polymer components, which currently don't play well with chrome apps.
you'll need to do a "bower update" in the root folder, but then additionally you'll need to then manually run "Refactor for CSP" on the created "bower_components" folder inside the [Chrome Dev Editor](https://chrome.google.com/webstore/detail/chrome-dev-editor-develop/pnoffddplpippgcfjdhbmhkofpnaalpg)