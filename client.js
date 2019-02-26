
const http = require('http');
const cloudcmd = require('cloudcmd');
const io = require('socket.io');
const app = require('express')();
const piClient = require('./piClient.js')

const port = process.argv.length > 2 ? process.argv[2] : 1993

const server = http.createServer(app);
const socket = io.listen(server, {
  path: '/cloud/socket.io'
})

app.get('/cloud/*', cloudcmd({
  socket: socket,
  config: {
    prefix: '/cloud'
  }
}))
app.put('/cloud/*', cloudcmd({
  socket: socket,
  config: {
    prefix: '/cloud'
  }
}))
app.delete('/cloud/*', cloudcmd({
  socket: socket,
  config: {
    prefix: '/cloud'
  }
}))
app.post('/connect', function (req, res) {
  let data = ''
  let client = null
  req.on('data', (chunk) => { data += chunk })
  req.on('end', () => {
    let connectionString = JSON.parse(data)
    if (client != null) {
      client.stop()
      client = null
    }
    client = new piClient(connectionString.settings,connectionString.name);
    console.log("Finished setup. Starting connection");
    client.start();
  })
})


console.log('Orka Client is listening on port ' + port)
server.listen(port)
