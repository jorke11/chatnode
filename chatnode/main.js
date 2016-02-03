var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});


io.on("connection", function (socket) {
    /**
     * para enviar mensaje a todos incluyendome
     */
    //io.emit("message", 'El usuario ' + socket.id + ' se ha conectado','System');

    socket.broadcast.emit("message", 'El usuario ' + socket.id + ' se ha conectado', 'System');

    var canal = 'canal1';

    socket.join(canal);

    socket.on("message", function (msj) {
//        io.emit("message", msj, socket.id);
        io.sockets.in(canal).emit("message", msj, socket.id);

    })

    socket.on("disconnect", function (e) {
        console.log("Desconectado id", socket.id);
    })

    socket.on("change channel", function (nuevoCanal) {
        socket.leave(canal);
        socket.join(nuevoCanal);
        canal = nuevoCanal;
        socket.emit("change channel", nuevoCanal);
        console.log("change channel", nuevoCanal);
    });

    socket.on("writeOn", function (msj) {
        socket.broadcast.to(canal).emit('writeOn', msj, socket.id);
    })

})


http.listen(8080, function () {
    console.log("funcionando por el puerto 8080");
});