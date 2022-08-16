const express = require('express');
const { ExpressPeerServer } = require('peer');
const port = 9000

/* CONTROLADOR DE LOGS EN ARCHIVO DE LOGS -----------------------------------------------------*/
var fs = require('fs'); var util = require('util');
var log_file = fs.createWriteStream('/var/log/peer-server/node-peer-server.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
 };
/* --------------------------------------------------------------------------------------------*/

/* ----------------------------------------------------------------------------------------------
  PEER JS DISPONE DE UN SERVIDOR PARA FACILIDAR EL EMPAREJAMIENTO ENTRE PARES WebRTC EL 
  SERVIDOR SE EXTRAE DE https://github.com/peers/peerjs-server FUNCIONANDO ESPECIFICAMENTE
  PARA EXPRESS DENTRO DE UNA MAQUINA UBUNTU, PERO TAMBIEN SE PUEDE REALIZAR SOBRE SERVICIOS
  ESCALABLES DE APLICACIONES WEB

  DOCUMENTACIÓN COMPLETA DE PEER JS EN https://peerjs.com/
-----------------------------------------------------------------------------------------------*/

const app = express();
const server = app.listen(port);
console.log("Iniciando servidor puerto: "+port)

app.get('/', (req, res, next) => res.send('Soy peerServer'));

const peerServer = ExpressPeerServer(server, {
  path: '/'
});

/* Si hay una nueva conexión */
peerServer.on('connection', (client) => {
  console.log("se ha conectado: "+client.getId())
});

/* Si se pierde una conexión */
peerServer.on('disconnect', (client) => {
  console.log("se ha desconectado: "+client.getId())
});

/* Instalación del servidor */
app.use('/peerServer', peerServer);

