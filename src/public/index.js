

  /* SE PUDE AGREGAR UN ID PERSONALIZADO EN UN PRIMER CAMPO DE Peer */
  /* CreANDO conexión WebRTC al peerServer*/
  const peer = new Peer({
    host: '54.167.87.198',
    port: 9000,
    path: '/peerServer',
    config: {'iceServers': [
      { url: 'stun:stun.l.google.com:19302' },
      { url: 'turn:54.167.87.198:3478?transport=tcp', username:"deem",credential:'12345678' }
    ]}
  });

  // Si el servidor peerServer responde y asigna un id disponible para webRTC
  peer.on('open', function(id) {
    const miIdNode = document.getElementById("miidShow")
    miIdNode.innerHTML = id
    console.log('My peer ID is: ' + id);
    /* CODE */
  });


  /* CREATE CONEXION OBJECT PARA ALMACENAR LA CONEXIÓN QUE SE GENERE */
  let conGeneral = null


  /* SE EJECUTA CUANDO SE RECIBE UNA CONEXIÓN DESDE OTRO PAR ------------------------------ */
  peer.on('connection', function(conn) {
    console.log("He recibido una conexión ", conn)
    /* 
      SE EJECUTA CUANDO LA CONEXIÓN ESTÁ LISTA PARA SER USADA
      DENTRO DE ESTE EVENTO SE DEBEN DECLARAR QUE HACER CON LA 
      DATA RECIBIDA O LA CONEXIÓN ES TERMINADA O EXISTIÓ ALGÚN 
      ERROR 
    */
    conn.on('open', function() {
      console.log("Conexión lista para ser usada")
      printStatusMessage("Conexión recibida con: "+conn.peer)

      /* listen de mensajes recibidos  */
      conn.on('data', function(data) {
        printMessajeRecived(data)
      });

      /* se ejecuta cuando se cierra la conexión  */
      conn.on('close', function() {
        printStatusMessage("Conexión cerrada")
      });

      /* se ejecuta cuando se cierra la conexión  */
      conn.on('error', function(err) {
        printStatusMessage("Error: "+err)
      });

      /* CONEXION GUARDADA */
      conGeneral = conn
    });
  });
  /* ------------------------------------------------------------------------------------ */


  /* SE DEBE EJECUTAR PARA ESTABLECER UNA CONEXIÓN NUEVA CON OTRO PAR ------------------- */
  function conect(){
    const valueIDDest = document.getElementById("destid").value //ID DEL ID CON EL QUE SE QUIERE CONECTAR
    if(conGeneral==null){
      /* SE CREA UNA CONEXION CON EL ID DE OTRO PAR */
      var conn = peer.connect(valueIDDest);
      console.log("Se envió una conexión a "+valueIDDest)

      /* SE EJECUTA CUANDO LA CONEXIÓN SE HA ESTABLECIDO DE FORMA EXITOSA */
      conn.on('open', function() {
        console.log("sconexión lista para ser usada")
        printStatusMessage("Conexión enviada a: "+valueIDDest)

        /* LISTEN PARA RECIBIR MENSAJES */
        conn.on('data', function(data) {
          console.log('Received: ', data);
          printMessajeRecived(data)
        });

        /* se ejecuta cuando se cierra la conexión  */
        conn.on('close', function() {
          printStatusMessage("Conexión cerrada")
        });

        /* se ejecuta cuando se cierra la conexión  */
        conn.on('error', function(err) {
          printStatusMessage("Error: "+err)
        });

        /* CONEXION GUARDADA */
        conGeneral = conn
      });
    }
    else{
      console.log("ya existe una conexión ",conGeneral)
      printStatusMessage("Ya existe una conexión")
    }
  }
  /* --------------------------------------------------------------------------------- */


  function sendMessage(){
    if(conGeneral != null){
      const message = document.getElementById("message").value
      const timeStamp = new Date()
      const msgToSend = message +" |"+timeStamp.getTime()

      console.log("Se enviará el mensaje: "+ msgToSend)
      document.getElementById("timeSend").innerHTML = timeStamp.getMinutes()+":"+timeStamp.getSeconds()+":"+timeStamp.getMilliseconds()

      conGeneral.send(msgToSend)
    }else{
      console.log("No existe una conexión no se puede enviar mensaje")
      printStatusMessage("Error: No existe una conexión")
    }
  }

  let latencyPromedio = 0;
  let moreLatency = 0 ;
  let countMsjsLatency= 0;
  let totalLatency = 0;

  function printMessajeRecived(text){

    if(text.indexOf("xxx") != -1 ){

      const codeMsj = text.split("|")[0];
      const TimeStampOut =parseInt(text.split("|")[1]);
      const TimeStampIn = new Date().getTime();
      let difTime = TimeStampIn - TimeStampOut;
      if(difTime < 0) difTime = difTime*-1
      countMsjsLatency = countMsjsLatency + 1;

      totalLatency = totalLatency+difTime;
      latencyPromedio = totalLatency/countMsjsLatency

      if(difTime > moreLatency) moreLatency = difTime

      console.log("latencyPromedio: ",latencyPromedio);
      console.log("moreLatency: ",moreLatency);

      const viwValue = document.getElementById("latencyFull100msgs")
      const latencyMore = document.getElementById("latencyMore")
      viwValue.innerHTML = "Promedio: "+latencyPromedio
      latencyMore.innerHTML = "Mayor: "+moreLatency

      if(codeMsj == "xxx100"){
         latencyPromedio = 0;
         moreLatency = 0 ;
         countMsjsLatency= 0;
         totalLatency = 0;
      }

    }else{

      const TimeStampIn = new Date()
      document.getElementById("timeReceived").innerHTML = TimeStampIn.getMinutes()+":"+TimeStampIn.getSeconds()+":"+TimeStampIn.getMilliseconds()

      const messageRecivedNode = document.getElementById("messaguerecivedid")
      messageRecivedNode.innerHTML = text.split("|")[0]
      const TimeStampOut =parseInt(text.split("|")[1]) 
      
      const TimeInTransmision = TimeStampIn.getTime() - TimeStampOut
      printLatenci(TimeInTransmision)
      console.log("Tiempo latencia: "+ TimeInTransmision)
    }
  }


  function printStatusMessage(text){
    const errorNode = document.getElementById("statusmessage")
    errorNode.innerHTML = text
  }


  function printLatenci(TimeInTransmision){
    const nodeShowLatency = document.getElementById("latenciShow")
    nodeShowLatency.innerHTML = TimeInTransmision + " ms"
  }



  /* CONSTRUIR UN MEDIDOR DE UN  */
  function startTestLatencyFull(){
    if(conGeneral != null){
      for (var i = 0; i <= 100; i++) {
        const TimeStamp = new Date().getTime()
        const payToSend = "xxx"+i+"|"+TimeStamp
        conGeneral.send(payToSend)
      }
    }
    else{
      console.log("No hay una funcion")
    }
  }