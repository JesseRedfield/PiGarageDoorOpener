# PiGarageDoorOpener

## Initial PI Setup
Requires Raspberry Pi Jessie (version 8) Or Newer
Requires Node.JS Installed
run ./setup_pi.sh and reboot

## Build Startup
1) install npm and latest node LTS
2) install expo-cli: npm install -g expo-cli
3) client development run: `cd Client` then `npm run:web` OR `npm run:android`
4) server development run: `cd Server` then `npm run dev`

## Package server and push to pi
1) `cd Client` then `expo build:web`
2) `mv web-build ../Server/Client`
3) `cd Server` `rsync -r username@xxx.xxx.xxx.xxx:/path/on/server`
4) ssh into your server and run `npm run start` in the server target directory.

## Important Documentation
Express JS Server: http://expressjs.com
React Native: https://reactnative.dev
Expo React Native CLI: https://expo.dev
rpio: https://github.com/jperkin/node-rpio
