var port = 3000;
var counter = 0;

function load_games(){
  // Here we want to retrieve each game in the database and print them
  var retrieveGames = new XMLHttpRequest();
  // Request to our nodeJS Rest API
  retrieveGames.open("GET", "http://localhost:"+port+"/games/get");
  retrieveGames.send();
  // As we are using asynchronous request we must tell the system if there is a response
  retrieveGames.onreadystatechange = function() {
  if (retrieveGames.readyState === 4) {
      // The response contains every row of our table, we will now display it
      printGames(JSON.parse(retrieveGames.response));
    }
  }
}

function addGame(){
  var player1 = document.getElementsByName('player1')[0].value;
  var player2 = document.getElementsByName('player2')[0].value;

  if (player1.length < 1 || player2.length < 1){
    alert("Chaque joueur doit avoir un nom")
  }else{

    // NodeJS Ajax request to add the game
    var requestToCreateGame = new XMLHttpRequest();

    requestToCreateGame.open("POST", "http://localhost:"+port+"/games/add");
    requestToCreateGame.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    requestToCreateGame.send("player1="+player1+"&player2="+player2);

    requestToCreateGame.onreadystatechange = function() {
    if (requestToCreateGame.readyState === 4) {
        // We need to notify the other users that we updated the table
          emitUpdate();
      }
    }
  }
}

function printGames(games){
  counter = 0;
  var table = document.getElementById('game_manager_table');
  table.innerHTML = "";
  if (games.length == 0){
    row = table.insertRow(0);
    newGameData = row.insertCell(0);
    newGameData.innerHTML = "Aucune partie en ce moment, vous pouvez créer la première !";
    newGameData.setAttribute("colspan","12");
    document.getElementById('export-button').disabled = true;
    document.getElementById('export-button').className = "export-button square fg-white darken-red hover-ban";
    document.getElementById('export-button').title = "Il faut au moins une partie pour générer un rapport";
  }else{
    document.getElementById('export-button').disabled = false;
    document.getElementById('export-button').className = "export-button square fg-white darken-red hover";
    document.getElementById('export-button').title = "Exporte la dernière version de la table contenant les parties";
    games.forEach((game, i) => {
        // Add a new row to the table for each game
        newGame = table.insertRow(0);

        // To count the currently active games
        if (game.current_state == "En cours"){
          counter++;
          game.current_state = '<i class="fa fa-stop red hover" title="Terminer la partie" onclick="updateGame('+game.id+')"></i> En cours';
        }else{
          game.current_state = '<i>Terminée</i>';
          newGame.className = "inactive";
        }

        // This table contains each cell of the row
        tableCells = [
          game.timestamp_end == null ? "Début : "+game.timestamp.split(":")[0]+"H"+game.timestamp.split(":")[1] : game.timestamp.split(":")[0]+"H"+game.timestamp.split(":")[1]+" - "+game.timestamp_end.split(":")[0]+"H"+game.timestamp_end.split(":")[1],
          game.current_state,
          '<i class="fa fa-minus red hover" onclick="updateScore('+game.id+',1,-1)"></i>',
          game.score1,
          '<i class="fa fa-plus green hover" onclick="updateScore('+game.id+',1,1)"></i>',
          game.player1,
          '<span class="red emphasize">VS</span>',
          game.player2,
          '<i class="fa fa-minus red hover" onclick="updateScore('+game.id+',2,-1)"></i>',
          game.score2,
          '<i class="fa fa-plus green hover" onclick="updateScore('+game.id+',2,1)"></i>',
          '<i class="fa fa-trash red hover" onclick="deleteGame('+game.id+')"></i>'
        ];

        tableCells.forEach((cell, i) => {
          newGameData = newGame.insertCell(i);
          newGameData.innerHTML = cell;
          if (i==1 || i==11){
            // We need to display every border if it's the first / last cell -> The purpose is only aesthetic
            newGameData.className = "all-border";
          }
        });
    });
  }

  // This will display the number of game currently processing
  if (counter == 0){
    document.getElementById('counter').innerText = "Aucune partie en cours";
  }else if (counter == 1){
    document.getElementById('counter').innerText = "1 partie en cours";
  }else{
    document.getElementById('counter').innerText = counter+" parties en cours";
  }

  hide_games(document.getElementById('gameListCheckbox').checked);
}

function updateGame(id){
  var updateGameWithId = new XMLHttpRequest();
  // Request to our nodeJS Rest API to end game (= modifying current_state and completing the timestamp_end value)
  updateGameWithId.open("GET", "http://localhost:"+port+"/games/update/state/"+id);
  updateGameWithId.send();

  updateGameWithId.onreadystatechange = function() {
  if (updateGameWithId.readyState === 4) {
      // We need to notify the other users that we updated the table
        emitUpdate();
    }
  }
}

function updateScore(id,scoreNumber,move){
  var updateScoreWithId = new XMLHttpRequest();
  // Request to our nodeJS Rest API to end game (= modifying current_state)
  updateScoreWithId.open("POST", "http://localhost:"+port+"/games/update/score/");
  updateScoreWithId.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  updateScoreWithId.send("id="+id+"&scoreNumber="+scoreNumber+"&move="+move);

  updateScoreWithId.onreadystatechange = function() {
  if (updateScoreWithId.readyState === 4) {
      // We need to notify the other users that we updated the table
        emitUpdate();
    }
  }
}

function deleteGame(id){
  var deleteGameWithId = new XMLHttpRequest();
  // Request to our nodeJS Rest API to delete the specified game
  deleteGameWithId.open("GET", "http://localhost:"+port+"/games/delete/"+id);
  deleteGameWithId.send();
  deleteGameWithId.onreadystatechange = function() {
  if (deleteGameWithId.readyState === 4) {
      // We need to notify the other users that we updated the table
        emitUpdate();
    }
  }
}


// Hide inactive games based on the checkbox status
function hide_games(status){
  if (counter > 0){
    if (status){
      [].forEach.call(document.getElementsByClassName('inactive'), function (row) {row.style.display="none"});
    }else{
      [].forEach.call(document.getElementsByClassName('inactive'), function (row) {row.style.display="table-row"});
    }
  }else{
    gameListCheckbox.checked = false;
  }
}

// If the user wants to export every data from the table
function exportTable(){
  var exportTable = new XMLHttpRequest();
  exportTable.open("GET", "http://localhost:"+port+"/games/export/");
  exportTable.send();

  exportTable.onreadystatechange = function() {
  if (exportTable.readyState === 4) {
    // Append an element to download the file without any interaction
      var link = this.response;
      var a = window.document.createElement('a');
      console.log(link)
      a.href = link;
      a.download = "table.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
}
