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

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("process");

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
/* harmony import */ var terminate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! terminate */ "terminate");
/* harmony import */ var terminate__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(terminate__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! child_process */ "child_process");
/* harmony import */ var child_process__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(child_process__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! process */ "process");
/* harmony import */ var process__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(process__WEBPACK_IMPORTED_MODULE_6__);










let mainWindow;
let tray = null;
let serverProcess;

const launchServer = new Promise(async (resolve, reject) => {
    /*
    // doesn't work... esm warnings..
    process.env.RPG_TYPE = 'rpg';
    let devMode;
    import("@rpgjs/compiler/lib/serve/index.js")
    .then(async module => {
      devMode = module.devMode;

      let res;
      try {
          res = await devMode({
              port: 3000
          });
      } catch (error) {
          console.log({error})
          reject(error);
          return;
      }

      return resolve("http://localhost:3333/");

    })
    .catch(err => {
      console.error("Failed to load the module:", err);
    });
    */

    let options = { shell: true, cwd: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, '..') };

    try {
        serverProcess = (0,child_process__WEBPACK_IMPORTED_MODULE_4__.spawn)('npm', ['run', 'rpg'], options);
    } catch (error) {
        console.log(error)
        resolve("ERROR")
        //reject(error);
        return;
    }

    if (!serverProcess || !serverProcess.pid) {
        resolve('Error spawning server process');
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

    const timeoutId = setTimeout(() => {
        resolve("Server error");
    }, 15000);
});

function closeServerProcess(pid) {
    return new Promise((resolve, reject) => {
        if (!pid) {
            return resolve();
        }
        terminate__WEBPACK_IMPORTED_MODULE_3___default()(pid, (err) => {
            return resolve();
        });
    });
}

/*
 * Creating the primary window, only runs once.
 */
const createWindow = async (msg) => {
    let width = 300;
    let height = 150;
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
            //sandbox: true,
            sandbox: false,
            preload: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "preload.js"),
        },
        icon: __dirname + "/resources/icons/512x512.png",
    });

    mainWindow.loadURL(url__WEBPACK_IMPORTED_MODULE_1___default().format({
        pathname: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));

    electron__WEBPACK_IMPORTED_MODULE_5__.ipcMain.handle('directories', async (event, arg) => {
        return { directory: __dirname, execPath: process.execPath, resourcesPath: process.resourcesPath};
    });

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

    electron__WEBPACK_IMPORTED_MODULE_5__.ipcMain.handle("port", async (event, arg) => {
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
        .then(async () => {
            let _server = await launchServer;
            return _server;
        })
        .then((res) => {
            //console.log({res})
            createWindow(res);
        })
        .catch((error) => {
            console.log({error});
            electron__WEBPACK_IMPORTED_MODULE_5__.app.quit();
        });
    }
} else {
    electron__WEBPACK_IMPORTED_MODULE_5__.app.whenReady()
    .then(async () => {
        let _server = await launchServer;
        return _server;
    })
    .then((res) => {
        //console.log({res})
        createWindow(res);
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