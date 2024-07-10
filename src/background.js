import path from "path";
import url from "url";
import os from "os";
import fs from "fs";
import terminate from "terminate";

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

const { spawn } = require('child_process');

let mainWindow;
let tray = null;
let serverProcess;
let port = 3333;

const nodeModulesPath = path.join(__dirname, '..', 'rpg');

const launchServer = new Promise((resolve, reject) => {
    try {
        serverProcess = spawn(
            'npm', ['run', 'electron'],
            {
                cwd: nodeModulesPath,
                shell: true,
            }
        );
    } catch (error) {
        console.log({error})
        reject(error);
        return;
    }
    console.log('serverProcess.pid: ', serverProcess.pid);
    resolve();
    return;
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
const createWindow = async () => {
    let width = 816;
    let height = 624;
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
        logger.debug("notify");
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
        .then(() => {
            app.commandLine.appendSwitch('enable-webgl');
            app.commandLine.appendSwitch('ignore-gpu-blacklist');
            app.commandLine.appendSwitch('force_high_performance_gpu');
        })
        .then(async () => {
            let _server = await launchServer;
        })
        .then(() => {
            createWindow();
        })
        .catch((error) => {
            console.log({error});
            app.quit();
        });
    }
} else {
    app.whenReady()
    .then(() => {
        app.commandLine.appendSwitch('enable-webgl');
        app.commandLine.appendSwitch('ignore-gpu-blacklist');
        app.commandLine.appendSwitch('force_high_performance_gpu');
    })
    .then(async () => {
        let _server = await launchServer;
    })
    .then(() => {
        createWindow();
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

    app.on("activate", () => {
        if (mainWindow === null) {
            createWindow();
        }
    });
}
