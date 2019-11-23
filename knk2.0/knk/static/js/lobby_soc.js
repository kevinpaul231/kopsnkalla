var msg_obj;
var opp_ip,opp_type,opp_loc;
var my_loc,my_type;
var kalla_x=0,kalla_y=0;
var loc="ws://" + serverIP + ":6969";
    var conn = new WebSocket(loc);
//var opp_ip = prompt("Enter opponents IP address");
//var opp_type = prompt("Enter opponents type(kop/kalla)");
var playBtn = document.getElementById("play_button");
playBtn.addEventListener("click",startGame,false);

conn.onopen = function(e) {
    console.log("Connection established!");
    
    alert("Connected!");
};

conn.onmessage = function(e) {
alert("This shouldn't be happenening");  

};
conn.onclose = function(e){
  var x= document.createElement("p");
    x.innerHTML= "Connection Closed! " + e.data ;
    document.body.appendChild(x);
    

}

function startGame()
{
  opp_ip=document.getElementById("opponent_ip").value;
  opp_type=document.getElementById("opponent_type").value;
  if(opp_type=="kalla")
  {
    my_type="kop";
    my_loc="NAM0101";
    opp_loc="AUS0101";
  }
  else if(opp_type=="kop")
  {
    my_type="kalla";
    my_loc="AUS0101";
    opp_loc="NAM0101";
  }
  var obj = {"msg_code":"1","my_ip":my_ip,"my_loc":my_loc,"my_type":my_type,"opp_ip":opp_ip,"opp_type":opp_type,"opp_loc":opp_loc,"kalla_x":kalla_x,"kalla_y":kalla_y};
    var str=JSON.stringify(obj);
    conn.send(str);
    alert("bro");
    window.location.href="game/map.php";
}