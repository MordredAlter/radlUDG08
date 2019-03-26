const { app,BrowserWindow,Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');

if (process.env.NODE_ENV !== 'production'){
    require("electron-reload")(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow
let NewProduct

app.on('ready', () => {
    mainWindow = new BrowserWindow({})
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => {
        app.quit();
    })
});

function createNewProduct(){
    newProduct = new BrowserWindow({
        width: 400,
        height: 285,
        title: 'Agregar Nuevo Producto'
    });
    newProduct.setMenu(null);
    newProduct.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-product.html'),
        protocol: 'file',
        slashes: true
    }));
    newProduct.on('closed', () => {
        newProduct = null;
    });
}

ipcMain.on('product:new', (e, nuevoProduct) => {
    mainWindow.webContents.send('product:new', nuevoProduct);
    newProduct.close();
});

const templateMenu = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Nuevo Producto',
                accelerator: 'Ctrl+N',
                click(){
                    createNewProduct();
                }
            },
            {
                label: 'Quitar Todos Los Productos',
                click(){
                    mainWindow.webContents.send('products:remove-all');
                }
            },
            {
                label: 'Salir',
                accelerator: process.platform === 'darwin' ?
                     'command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
    
];

if(process.platform === 'darwin'){
    templateMenu.unshift({
        label: app.getName()
    });
}

if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Show/Hide DevTools',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}