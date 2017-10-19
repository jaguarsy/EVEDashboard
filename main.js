const electron = require('electron');
const app = electron.app;
// const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const http = require('http');
// const PORT = 10407;

let mainWindow;
let server;

// function createHttpServer(port) {
//   console.log('create http server at', port);
//
//   let event;
//
//   ipcMain.on('asynchronous-message', (evt, arg) => {
//     if (arg === 'wait-for-sso') {
//       event = evt;
//     } else {
//       event = null;
//     }
//   });
//
//   server = http.createServer((req, res) => {
//     if (event) {
//       event.sender.send('asynchronous-reply', req.url);
//     }
//
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end('登录成功！', 'utf-8');
//   }).listen(10407, 'localhost');
// }

function createWindow() {
  // createHttpServer(PORT);

  mainWindow = new BrowserWindow({
    title: 'EVE Dashboard',
    width: 700,
    height: 500,
    minWidth: 700,
    minHeight: 500,
    frame: false,
    skipTaskbar: true
  });
  mainWindow.loadURL(`file://${path.join(__dirname, './dist/index.html')}`); // load the react app
  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

// on MacOS leave process running also with no windows
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    server && server.close();
    app.quit();
  }
});

// if there are no windows create one
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

module.exports = mainWindow;
