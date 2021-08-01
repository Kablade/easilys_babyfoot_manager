// Connection to the database
const Pool = require('pg').Pool
// You might need to set the data corresponding to your needs in my case those are :
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'babyfoot_manager',
  password: 'Easilys',
  port: 5432,
})

// pgSQL Request to retrieve every game
const getGames = (request, response) => {
  pool.query('SELECT * FROM babyfoot_games ORDER BY timestamp ASC', (error, results) => {
    if (error) {
      throw error
    }
    return response.status(200).json(results.rows);

  })
}

// pgSQL Request to create a new game, with the name of each player
const createGame = (request, response) => {
  const { player1, player2 } = request.body
  // Because it's always nice to check in back-end even if we have already check in front-end :)
  if (player1.length > 0 && player2.length > 0){
    pool.query('INSERT INTO babyfoot_games (player1, player2) VALUES ($1, $2)', [player1, player2], (error, results) => {
      if (error) {
        console.log(error);
        response.send("ERROR");
      }else{
        console.log("A game between "+player1+" and "+player2+" has just started");
        response.status(201).send(`Game added with ID: ${results.insertId}`);
      }
    })
  }else{
    response.send("ERROR");
  }
}

// pgSQL Request to update the state of the game
const updateGame = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('UPDATE babyfoot_games SET current_state = \'Terminée\', timestamp_end = now() WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error);
      response.send("ERROR");
    }else{
      console.log("The state of game with the ID -> "+id+" has been updated");
      response.status(201).send('Game updated with ID : '+id);
    }
  })
}

// pgSQL Request to update the score of each player
const updateScores = (request, response) => {
  const { id, scoreNumber, move} = request.body;
  var score = "score"+scoreNumber;
  console.log(move);
  pool.query('UPDATE babyfoot_games SET '+score+' = '+score+'+$1 WHERE id = $2', [move, id], (error, results) => {
    if (error) {
      console.log(error);
      response.send("ERROR");
    }else{
      console.log("The score of game with the ID -> "+id+" has been updated");
      response.status(201).send('Game updated with ID : '+id);
    }
  })
}

// pgSQL Request to delete any game
const deleteGame = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM babyfoot_games WHERE id = $1', [id], (error, results) => {
    if (error) {
      console.log(error);
      response.send("ERROR");
    }else{
    console.log("The game with the ID -> "+id+" was deleted");
    response.status(200).send(`Game deleted with ID : ${id}`);
  }
  })
}

module.exports = {
  pool,
  getGames,
  createGame,
  updateGame,
  updateScores,
  deleteGame,
}
