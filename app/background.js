/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "terminate":
/*!****************************!*\
  !*** external "terminate" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("terminate");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var terminate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! terminate */ "terminate");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! electron */ "electron");





//import { buildMode } from "@rpgjs/compiler";
//import buildMode from "@rpgjs/compiler/lib/build/index.js";



//const { spawn } = require('child_process');

//import { buildMode } from "@rpgjs/compiler";

let mainWindow;
let tray = null;
let serverProcess;

const launchServer = new Promise(async (resolve, reject) => {
    return resolve("aaaaa")
    /*
    // Dynamically import the buildMode function from a specific path
    import('@rpgjs/compiler/lib/build/index.js').then(async module => {
        const buildMode = module.default; // Use module.default if buildMode is a default export
        // Or if buildMode is a named export, you can destructure it directly:
        // const { buildMode } = module;
        // Use buildMode here



    }).catch(error => {
        console.error('Failed to load buildMode from @rpgjs/compiler:', error);
        return reject();
    });
    */

    let res;
    try {
        res = await buildMode();
    } catch (error) {
        console.log({error});
        reject(error);
        return;
    }
    console.log({res});
    return resolve('http://localhost:3000/');

    /*
    try {
        serverProcess = await spawn('npm', ['run', 'rpg'], { cwd: __dirname, shell: true });
    } catch (error) {
        console.log({error})
        reject(error);
        return;
    }

    if (!serverProcess || !serverProcess.pid) {
        reject('serverProcess is null');
        return;
    }

    serverProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        const _str = `${data}`;
        if (_str.includes("localhost")) {
            console.log('serverProcess.pid: ', serverProcess.pid);
            resolve(_str);
            return;
        }
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        resolve(`error:  ${data}`)
        return;
    });
    */
});

function closeServerProcess(pid) {
    return new Promise((resolve, reject) => {
        if (!pid) {
            return resolve();
        }
        terminate__WEBPACK_IMPORTED_MODULE_3__(pid, (err) => {
            return resolve();
        });
    });
}

/*
 * Creating the primary window, only runs once.
 */
const createWindow = async (msg) => {
    // webview resolution: 816x624
    let width = 300;
    let height = 150;
    mainWindow = new electron__WEBPACK_IMPORTED_MODULE_4__.BrowserWindow({
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        maxWidth: width,
        maximizable: false,
        maxHeight: height,
        useContentSize: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            sandbox: false,
            //sandbox: true,
            preload: path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "preload.js"),
            //
            webgl: true,
            disableHardwareAcceleration: false,
            offscreen: false,
            backgroundThrottling: false
        },
        icon: __dirname + "/resources/icons/512x512.png",
    });

    /*
    // NOTE: This method uses as much as 100% CPU
    const _url = `http://localhost:${port}/`;
    try {
        mainWindow.loadURL(_url);
    } catch (error) {
        console.log({error});
    }
    */

    mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1__.format({
        pathname: path__WEBPACK_IMPORTED_MODULE_0__.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));

    electron__WEBPACK_IMPORTED_MODULE_4__.app.on('window-all-closed', async () => {
        if (process.platform !== 'darwin') {
            console.log('window-all-closed');
            await closeServerProcess(serverProcess.pid);
            electron__WEBPACK_IMPORTED_MODULE_4__.app.quit();
        }
    });

    tray = new electron__WEBPACK_IMPORTED_MODULE_4__.Tray(__dirname + "/resources/icons/512x512.png");
    const contextMenu = electron__WEBPACK_IMPORTED_MODULE_4__.Menu.buildFromTemplate([
        {
            label: "Show App",
            click: function () {
                mainWindow.show();
            },
        },
        {
            label: "Quit",
            click: async function () {
                electron__WEBPACK_IMPORTED_MODULE_4__.app.isQuiting = true;
                tray = null;
                console.log('quit');
                await closeServerProcess(serverProcess.pid);
                electron__WEBPACK_IMPORTED_MODULE_4__.app.quit();
            },
        },
    ]);

    tray.setToolTip("RPGJS client");

    tray.on("right-click", (event, bounds) => {
        tray.popUpContextMenu(contextMenu);
    });

    electron__WEBPACK_IMPORTED_MODULE_4__.ipcMain.on("notify", (event, arg) => {
        const NOTIFICATION_TITLE = "Beet wallet notification";
        const NOTIFICATION_BODY =
            arg == "request" ? "Beet has received a new request." : arg;

        if (os__WEBPACK_IMPORTED_MODULE_2__.platform === "win32") {
            electron__WEBPACK_IMPORTED_MODULE_4__.app.setAppUserModelId(electron__WEBPACK_IMPORTED_MODULE_4__.app.name);
        }

        function showNotification() {
            new electron__WEBPACK_IMPORTED_MODULE_4__.Notification({
                title: NOTIFICATION_TITLE,
                subtitle: "subtitle",
                body: NOTIFICATION_BODY,
                icon: __dirname + "/img/beet-tray.png",
            }).show();
        }

        showNotification();
    });

    electron__WEBPACK_IMPORTED_MODULE_4__.ipcMain.handle("port", async (event, arg) => {
        return msg;
    });

    tray.on("click", () => {
        mainWindow.setAlwaysOnTop(true);
        mainWindow.show();
        mainWindow.focus();
        mainWindow.setAlwaysOnTop(false);
    });

    tray.on("balloon-click", () => {
        mainWindow.setAlwaysOnTop(true);
        mainWindow.show();
        mainWindow.focus();
        mainWindow.setAlwaysOnTop(false);
    });
};

electron__WEBPACK_IMPORTED_MODULE_4__.app.disableHardwareAcceleration();

let currentOS = os__WEBPACK_IMPORTED_MODULE_2__.platform();
if (currentOS === "win32" || currentOS === "linux") {
    // windows + linux setup phase
    const gotTheLock = electron__WEBPACK_IMPORTED_MODULE_4__.app.requestSingleInstanceLock();

    if (!gotTheLock) {
        electron__WEBPACK_IMPORTED_MODULE_4__.app.quit();
    } else {
        // Handle the protocol. In this case, we choose to show an Error Box.
        electron__WEBPACK_IMPORTED_MODULE_4__.app.on("second-instance", (event, argv) => {
            // Someone tried to run a second instance, we should focus our window.
            if (!mainWindow) {
                console.error("Main window is not defined.");
                return;
            }

            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            }

            mainWindow.focus();
        });

        electron__WEBPACK_IMPORTED_MODULE_4__.app.whenReady()
        .then(async () => {
            let _server = await launchServer;
            return _server;
        })
        .then((res) => {
            createWindow(res);
        })
        .catch((error) => {
            console.log({error});
            electron__WEBPACK_IMPORTED_MODULE_4__.app.quit();
        });
    }
} else {
    electron__WEBPACK_IMPORTED_MODULE_4__.app.whenReady()
    .then(async () => {
        let _server = await launchServer;
        return _server;
    })
    .then((res) => {
        createWindow(res);
    })
    .catch((error) => {
        console.log({error});
        electron__WEBPACK_IMPORTED_MODULE_4__.app.quit();
    });

    electron__WEBPACK_IMPORTED_MODULE_4__.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            electron__WEBPACK_IMPORTED_MODULE_4__.app.quit();
        }
    });

    /*
    app.on("activate", () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
    */
}

/******/ })()
;
//# sourceMappingURL=background.js.map