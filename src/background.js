import path from "path";
import url from "url";
import os from "os";
import terminate from "terminate";

//import { buildMode } from "@rpgjs/compiler";
//import buildMode from "@rpgjs/compiler/lib/build/index.js";

import {
    app,
    BrowserWindow,
    Menu,
    Tray,
    dialog,
    ipcMain,
    Notification,
    shell,
} from "electron";

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
        terminate(pid, (err) => {
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
    mainWindow = new BrowserWindow({
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
            preload: path.join(__dirname, "preload.js"),
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

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));

    app.on('window-all-closed', async () => {
        if (process.platform !== 'darwin') {
            console.log('window-all-closed');
            await closeServerProcess(serverProcess.pid);
            app.quit();
        }
    });

    tray = new Tray(__dirname + "/resources/icons/512x512.png");
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Show App",
            click: function () {
                mainWindow.show();
            },
        },
        {
            label: "Quit",
            click: async function () {
                app.isQuiting = true;
                tray = null;
                console.log('quit');
                await closeServerProcess(serverProcess.pid);
                app.quit();
            },
        },
    ]);

    tray.setToolTip("RPGJS client");

    tray.on("right-click", (event, bounds) => {
        tray.popUpContextMenu(contextMenu);
    });

    ipcMain.on("notify", (event, arg) => {
        const NOTIFICATION_TITLE = "Beet wallet notification";
        const NOTIFICATION_BODY =
            arg == "request" ? "Beet has received a new request." : arg;

        if (os.platform === "win32") {
            app.setAppUserModelId(app.name);
        }

        function showNotification() {
            new Notification({
                title: NOTIFICATION_TITLE,
                subtitle: "subtitle",
                body: NOTIFICATION_BODY,
                icon: __dirname + "/img/beet-tray.png",
            }).show();
        }

        showNotification();
    });

    ipcMain.handle("port", async (event, arg) => {
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

app.disableHardwareAcceleration();

let currentOS = os.platform();
if (currentOS === "win32" || currentOS === "linux") {
    // windows + linux setup phase
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
        app.quit();
    } else {
        // Handle the protocol. In this case, we choose to show an Error Box.
        app.on("second-instance", (event, argv) => {
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

        app.whenReady()
        .then(async () => {
            let _server = await launchServer;
            return _server;
        })
        .then((res) => {
            createWindow(res);
        })
        .catch((error) => {
            console.log({error});
            app.quit();
        });
    }
} else {
    app.whenReady()
    .then(async () => {
        let _server = await launchServer;
        return _server;
    })
    .then((res) => {
        createWindow(res);
    })
    .catch((error) => {
        console.log({error});
        app.quit();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
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
