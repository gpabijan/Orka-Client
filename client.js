
 const app = require('express')();
'use strict'
const piClient = require('./piClient.js')
const http = require('http');

let client = null
const io = require('socket.io')

const port = process.argv.length > 2 ? process.argv[2] : 1993

 const cc = http.createServer({ shell: 'bash', users: {}, port: port })

const cloudcmd = require('cloudcmd')
const socket = io.listen(cc, {
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
  req.on('data', (chunk) => { data += chunk })
  req.on('end', () => {
    let connectionString = JSON.parse(data)
    if (client != null) {
      client.stop()
      client = null
    }
    client = new piClient(connectionString.settings,connectionString.name)
    client.start()
  })
})


console.log('Orka Client is listening on port ' + port)
cc.listen(port)
