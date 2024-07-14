import path from "path";
import url from "url";
import os from "os";
import terminate from "terminate";

import { spawn } from "child_process";

import {
    app,
    BrowserWindow,
    Menu,
    Tray,
    ipcMain,
    Notification,
} from "electron";

let mainWindow;
let tray = null;
let serverProcess;

const launchServer = new Promise(async (resolve, reject) => {
    let options = { shell: true, cwd: path.join(__dirname, '..') };

    try {
        serverProcess = spawn('npm', ['run', 'rpg'], options);
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
        terminate(pid, (err) => {
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
            sandbox: true,
            //sandbox: false,
            preload: path.join(__dirname, "preload.js"),
        },
        icon: __dirname + "/resources/icons/512x512.png",
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
    }));

    ipcMain.handle('directories', async (event, arg) => {
        return { directory: __dirname, execPath: process.execPath, resourcesPath: process.resourcesPath};
    });

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
            //console.log({res})
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
        //console.log({res})
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
