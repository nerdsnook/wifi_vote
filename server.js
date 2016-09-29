var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);



var voteTotal = 0;
var voteData = {
    red: {
        votes: 0,
        percentage: 0
    },
    yellow: {
        votes: 0,
        percentage: 0
    },
    green: {
        votes: 0,
        percentage: 0
    }
};

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    io.emit('vote results', voteData);

    socket.on('new vote', function(data) {
        console.log('new vote');
        voteTotal++;
        voteData[data].votes++;

        for(var key in voteData) {
            voteData[key].percentage = (voteData[key].votes / voteTotal) * 100;
        }

        io.emit('vote results', voteData);
    });

    socket.on('reset votes', function(data) {
        voteTotal = 0;
        for (key in voteData) {
            for (detail in voteData[key]) {
                voteData[key][detail] = 0;
            }
        }

        io.emit('vote results', voteData);
    });
});

var PORT = process.env.PORT || 3000;
server.listen(PORT, function(){
    console.log("Listening on PORT " + process.env.PORT);
})
 
 /*
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var IP = process.env.OPENSHIFT_NODEJS_IP;
server.listen(PORT,IP, function(){
    console.log("Listening on PORT " + PORT);
});*/