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

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
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
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(url__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! os */ "os");
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(os__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var terminate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! terminate */ "terminate");
/* harmony import */ var terminate__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(terminate__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_5__);








const { spawn } = __webpack_require__(/*! child_process */ "child_process");

let mainWindow;
let tray = null;
let serverProcess;
let port = 3333;

//const nodeModulesPath = path.join(__dirname, '..', 'rpg');

const rpgPath = path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, '../');

// only works in dev mode!
const launchServer = new Promise(async (resolve, reject) => {
    console.log(rpgPath);
    try {
        serverProcess = await spawn('npm', ['run', 'rpg'], { shell: true });
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
            resolve();
            return;
        }
    });
});



function closeServerProcess(pid) {
    return new Promise((resolve, reject) => {
        if (!pid) {
            return resolve();
        }
        terminate__WEBPACK_IMPORTED_MODULE_4___default()(pid, (err) => {
            return resolve();
        });
    });
}

/*
 * Creating the primary window, only runs once.
 */
const createWindow = async () => {
    let width = 816;
    let height = 624;
    mainWindow = new electron__WEBPACK_IMPORTED_MODULE_5__.BrowserWindow({
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
            preload: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "preload.js"),
            //
            experimentalFeatures: true,
            webgl: true,
            disableHardwareAcceleration: false,
            offscreen: false,
            backgroundThrottling: false
        },
        icon: __dirname + "/resources/icons/512x512.png",
    });

    const _url = `http://localhost:${port}/`;
    try {
        mainWindow.loadURL(_url);
    } catch (error) {
        console.log({error});
    }

    electron__WEBPACK_IMPORTED_MODULE_5__.app.on('window-all-closed', async () => {
        if (process.platform !== 'darwin') {
            console.log('window-all-closed');
            await closeServerProcess(serverProcess.pid);
            electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
        }
    });

    tray = new electron__WEBPACK_IMPORTED_MODULE_5__.Tray(__dirname + "/resources/icons/512x512.png");
    const contextMenu = electron__WEBPACK_IMPORTED_MODULE_5__.Menu.buildFromTemplate([
        {
            label: "Show App",
            click: function () {
                mainWindow.show();
            },
        },
        {
            label: "Quit",
            click: async function () {
                electron__WEBPACK_IMPORTED_MODULE_5__.app.isQuiting = true;
                tray = null;
                console.log('quit');
                await closeServerProcess(serverProcess.pid);
                electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
            },
        },
    ]);

    tray.setToolTip("RPGJS client");

    tray.on("right-click", (event, bounds) => {
        tray.popUpContextMenu(contextMenu);
    });


    electron__WEBPACK_IMPORTED_MODULE_5__.ipcMain.on("notify", (event, arg) => {
        logger.debug("notify");
        const NOTIFICATION_TITLE = "Beet wallet notification";
        const NOTIFICATION_BODY =
            arg == "request" ? "Beet has received a new request." : arg;

        if ((os__WEBPACK_IMPORTED_MODULE_2___default().platform) === "win32") {
            electron__WEBPACK_IMPORTED_MODULE_5__.app.setAppUserModelId(electron__WEBPACK_IMPORTED_MODULE_5__.app.name);
        }

        function showNotification() {
            new electron__WEBPACK_IMPORTED_MODULE_5__.Notification({
                title: NOTIFICATION_TITLE,
                subtitle: "subtitle",
                body: NOTIFICATION_BODY,
                icon: __dirname + "/img/beet-tray.png",
            }).show();
        }

        showNotification();
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

electron__WEBPACK_IMPORTED_MODULE_5__.app.disableHardwareAcceleration();

let currentOS = os__WEBPACK_IMPORTED_MODULE_2___default().platform();
if (currentOS === "win32" || currentOS === "linux") {
    // windows + linux setup phase
    const gotTheLock = electron__WEBPACK_IMPORTED_MODULE_5__.app.requestSingleInstanceLock();

    if (!gotTheLock) {
        electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
    } else {
        // Handle the protocol. In this case, we choose to show an Error Box.
        electron__WEBPACK_IMPORTED_MODULE_5__.app.on("second-instance", (event, argv) => {
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

        electron__WEBPACK_IMPORTED_MODULE_5__.app.whenReady()
        .then(() => {
            electron__WEBPACK_IMPORTED_MODULE_5__.app.commandLine.appendSwitch('enable-webgl');
            electron__WEBPACK_IMPORTED_MODULE_5__.app.commandLine.appendSwitch('ignore-gpu-blacklist');
            electron__WEBPACK_IMPORTED_MODULE_5__.app.commandLine.appendSwitch('force_high_performance_gpu');
        })
        .then(async () => {
            let _server = await launchServer;
            return _server;
        })
        .then((res) => {
            createWindow();
        })
        .catch((error) => {
            console.log({error});
            electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
        });
    }
} else {
    electron__WEBPACK_IMPORTED_MODULE_5__.app.whenReady()
    .then(() => {
        electron__WEBPACK_IMPORTED_MODULE_5__.app.commandLine.appendSwitch('enable-webgl');
        electron__WEBPACK_IMPORTED_MODULE_5__.app.commandLine.appendSwitch('ignore-gpu-blacklist');
        electron__WEBPACK_IMPORTED_MODULE_5__.app.commandLine.appendSwitch('force_high_performance_gpu');
    })
    .then(async () => {
        let _server = await launchServer;
        return _server;
    })
    .then((res) => {
        createWindow();
    })
    .catch((error) => {
        console.log({error});
        electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
    });

    electron__WEBPACK_IMPORTED_MODULE_5__.app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
        }
    });

    electron__WEBPACK_IMPORTED_MODULE_5__.app.on("activate", () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
}

/******/ })()
;
//# sourceMappingURL=background.js.map