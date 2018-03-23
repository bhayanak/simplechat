var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var db_name='chatdb'
var dbUrl = 'mongodb://user:password@ds113169.mlab.com:13169/chatdb'
//var dbUrl = 'mongodb://127.0.0.1:27017/' + db_name
//provide a sensible default for local development
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
    dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL + db_name
}

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.get('/messages/:user', (req, res) => {
    var user = req.params.user
    Message.find({ name: user }, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', async (req, res) => {
    try {
        var message = new Message(req.body)
        var savedMessage = await message.save()
        var censored = await Message.findOne({ message: 'badword' })
        if (censored)
            await Message.remove({ _id: censored.id })
        else
            io.emit('message', req.body)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('Done with it.')
    }
})

io.on('connection', (socket) => {
    console.log('user connected..')
})

mongoose.connect(dbUrl, (err) => {
    console.log('MongoDB: ', err)
})


//var server = http.listen(3000, () => {
//    console.log('server is listening on port: ', server.address().port)
//})

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = http.listen(server_port, server_ip_address, ()=> {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});