
// Export the data thanks to Carbone.io
const fs = require('fs');
const carbone = require('carbone');

// Rest API + modules to manage our requests
const express = require('express');
const cors = require("cors"); // Used in case of cross origin issues
var bodyParser = require("body-parser");
const app = express();

// Parse the body of our requests in order to re-use the parameters
app.use(bodyParser.urlencoded({ extended: true }));

// To prevent from crossorigin issues
app.use(cors());

const http = require('http');
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});


// Database management
const db = require("./js/queries");

// Our endpoints
app.get('/games/get', db.getGames);

app.post('/games/add/', db.createGame);

app.get('/games/update/state/:id', db.updateGame);

app.post('/games/update/score/', db.updateScores);

app.get('/games/delete/:id', db.deleteGame);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/games/export/', (req, res) => {
  // Retrieve the game list with the correct name for each row, we don't have to connect again to the datababse thanks to the pool exported in queries.js
  db.pool.query('SELECT current_state as state, score1, score2, player1, player2, timestamp as time1, timestamp_end as time2 FROM babyfoot_games ORDER BY timestamp ASC', (error, results) => {
    if (error) {
      throw error
    }
    console.log((results.rows));

    table_data = results.rows;

    var ts = Date.now();

    // And here is the magic part !
    carbone.render('./reports/report-template.docx', table_data, function(err, result){
      if (err) return console.log(err);
      fs.writeFileSync('reports/table-'+ts+'.docx', result);
      res.send('http://localhost/easilys/reports/table-'+ts+'.docx');
    });
  })
});
// Socket.io real time data transfer

io.on('connection', (socket) => {
  // This will sent the message to every client in real time
  socket.on('chat message', (msg) => {
    if (msg[1] == "" || msg[1] == undefined){
      io.emit('chat message',"["+(new Date().getHours())+"H"+(new Date().getMinutes())+"] - Anonyme : "+msg[0]);
    }else{
      io.emit('chat message',"["+(new Date().getHours())+"H"+(new Date().getMinutes())+"] - "+msg[1]+" : "+msg[0]);
    }
  });

  // When there is an update this will load the latest version of the data
  socket.on('update', () =>{
    io.emit('update');
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
