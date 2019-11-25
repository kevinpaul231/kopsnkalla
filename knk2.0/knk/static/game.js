var socket = io();
/*
socket.on('message', function(data) {
  console.log(data);
});
*/
//For searching for opponent 
socket.on('search', function(data){
	console.log("Match found: "+ data )
});
socket.on('finish', function(data){
	console.log(data);
	socket.disconnect();
	var winDiv = document.getElementById("winStatusDiv");
	var winh1 = document.getElementById("winStatus");
	winh1.innerHTML = "You " + data + "!!"
	winDiv.style.display = "block";
	document.getElementById("vmap").style.display = "none";
	var audio = document.getElementById("pachao");
	audio.parentNode.removeChild(audio);


});



socket.on('move', function(data){
	
	distance = data;
	console.log("Moved: ");
	console.log("Distance: " + data);
	if(thisPlayer.playerType == "kop"){
		pachao.playbackRate = 2.0-(data/144.0);
		pachao.play();
	}


});
socket.on('kopMouse',function(data){
	pachao.playbackRate = 2.0-(data/144.0);
});
var distance;
var kalla_timeout= new Date().getTime();
var thisPlayer = {
	x:0,
	y:0,
	username:"",
	playerType: "",
	ID:""
}

//------------------------------------------------------------------
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    clickPos.x = x
    clickPos.y = y
    console.log("x: " + x + " y: " + y)
}

function startGame(){
	var playerForm = document.getElementById("playerForm");
	playerForm.parentNode.removeChild(playerForm);
	var mapDiv = document.createElement("DIV");
	mapDiv.style.width = '1200px';
	mapDiv.style.height = '800px';
	mapId = document.createAttribute("id")
	mapId.value = "mapDiv";
	document.body.appendChild(mapDiv);
	console.log("Done");

}

//------------------------------------------------------------------
var pachao = document.getElementById('pachao');
pachao.autoplay = false;
pachao.loop = true;
var startButton = document.getElementById('startButton');
startButton.addEventListener('click',function(e){
	var username = document.getElementById('inputUsername').value;
	var type = document.getElementById('inputType').value;
	console.log(username);
	console.log(type);

	thisPlayer = {
		x:0,
		y:0,
		username:username,
		playerType:type,
		oppID:""
	};
	
	socket.emit('new player',thisPlayer)
	document.getElementById("vmap").style.display = "block";
	document.getElementById("playerForm").style.display = "none";
	document.getElementById("startButton").style.display = "none";
	socket.emit('search');

});


$(window).on('load',function(){
	jQuery('#vmap').vectorMap(
{
    map: 'world_en',
    backgroundColor: '#a5bfdd',
    borderColor: '#818181',
    borderOpacity: 0.25,
    borderWidth: 1,
    color: '#f4f3f0',
    enableZoom: true,
    hoverColor: '#c9dfaf',
    hoverOpacity: null,
    normalizeFunction: 'linear',
    scaleColors: ['#b6d6ff', '#005ace'],
    selectedColor: '#f4f3f0',
    selectedRegions: null,
    showTooltip: true,
    onRegionClick: function(element, code, region)
    {
    	var tNow = new Date().getTime();
    	var tBefore = kalla_timeout + 3000;
    	if((thisPlayer.playerType == "kop") || (tBefore < tNow && thisPlayer.playerType == "kalla")){
    	console.log(code + "   " + region);
        var uCode = code.toUpperCase();
        coords = jvmCountries[uCode]["coords"]
        thisPlayer.x = coords[0];
        thisPlayer.y = coords[1];
        kalla_timeout = new Date().getTime();
        socket.emit('play',coords);	
    	}
    	else{
    		var alert = document.getElementById("lockAlert");
    		alert.style.display = "block";
    		$( "#lockAlert" ).fadeOut(2000);
    		console.log("Lock");
    	}
        
    },
    onRegionOver: function(element,code,region)
    {
    	var uCode = code.toUpperCase();
        var coords = jvmCountries[uCode]["coords"]
        socket.emit('kopMouse',coords);
    }
});
})

