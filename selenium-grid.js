//windows protractor version


const STANDALONE_PATH = './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.6.0.jar'
const CHROME_PATH = './node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.33.exe'
const HUB_PATH = './hub.json'
const NODE_PATH = './node.json'

const spawn = require('child_process').spawn;

const fs = require('fs');
const out = fs.openSync('./out.log', 'a');
const err = fs.openSync('./out.log', 'a');

const hubProc = spawn('java', ['-jar', `${STANDALONE_PATH}`, '-role', 'hub', '-hubConfig', `${HUB_PATH}`, '-debug'], {
    detached: true,
    stdio: ['ignore', out, err]
});
hubProc.unref();


const nodeProc = spawn('java', [`-Dwebdriver.chrome.driver=${CHROME_PATH}`,'-jar', `${STANDALONE_PATH}`,'-role', 'node',  '-nodeConfig', `${NODE_PATH}`], {
    detached: true,
    stdio: ['ignore', out, err]
});

nodeProc.unref()