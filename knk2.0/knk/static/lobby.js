function loadDoc(url, cFunction) {
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction(this);
    }
 };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function cFunction(xhttp){
	console.log("Here")
	var lobbyTable = document.getElementById('lobbyTable');
	while(lobbyTable.firstChild){
		lobbyTable.removeChild(lobbyTable.firstChild);
	}
	lobbyTableHeaderRow = document.createElement("TR");
	lobbyTableHeader1 = document.createElement("TH");
	lobbyTableHeader2 = document.createElement("TH");
	lobbyTableHeader1.innerHTML = "Username";
	lobbyTableHeader2.innerHTML = "Player Type";
	lobbyTableHeaderRow.appendChild(lobbyTableHeader1);
	lobbyTableHeaderRow.appendChild(lobbyTableHeader2);
	lobbyTable.appendChild(lobbyTableHeaderRow);
	var players = JSON.parse(xhttp.responseText)
	console.log(players);
	var playerRow;
	var playerRowUsername;
	var playerRowType;
	var att;
	for (player in players){
		playerRow = document.createElement("TR");
		playerRowUsername = document.createElement("TD");
		playerRowType = document.createElement("TD");
		console.log(players[player]["username"]);
		console.log(players[player]["playerType"]);
		playerRowUsername.innerHTML = players[player]["username"];
		playerRowType.innerHTML = players[player]["playerType"];
		playerRow.appendChild(playerRowUsername);
		playerRow.appendChild(playerRowType);

		lobbyTable.appendChild(playerRow);


	}
}

setInterval(loadDoc,1000,"/players",cFunction);