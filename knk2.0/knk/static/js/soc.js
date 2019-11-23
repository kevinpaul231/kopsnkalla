  //var html_tag2 = document.getElementById("html_tag");
  document.addEventListener("mousemove",show,false);
  var window_height=window.innerHeight;
  var window_width=window.innerWidth;
  var max_dist = Math.sqrt((Math.pow(window_width,2))+(Math.pow(window_height,2)));
  var audio=document.getElementById("audio");
  var kalla_x,kalla_y;
  var my_loc,my_x,my_y;
  var opp_loc,opp_ip,opp_type;
  var my_loc,my_type;
  var msg_obj;
  var to_worker;
  var hideout = document.querySelectorAll(".loc");
  
  
  var work = new Worker("audio_worker.js");

  var loc="ws://" + serverIP + ":6969";
    var conn = new WebSocket(loc);

    audio.loop=true;
  audio.preload="auto";
  audio.playbackRate=1.0;

  for(var i=0;i<hideout.length;i++)
{
  hideout[i].addEventListener("click",changeloc,false);
}

  function show(event) {
    var x = event.clientX;
    var y = event.clientY;
    
    if(opp_type=="kalla")
   {
    to_worker= {"opp_loc":opp_loc,"my_loc":my_loc, "kalla_x":kalla_x,"kalla_y":kalla_y,"my_x":x,"my_y":y};
    work.postMessage(JSON.stringify(to_worker));
   }
} 
conn.onopen = function(e) {
    console.log("Connection established!");
    var obj = {"msg_code":"2","my_ip":my_ip};
    var str=JSON.stringify(obj);
    conn.send(str);
    alert("Connected!");
};

conn.onmessage = function(e) {
  console.log(e.data);
   msg_obj = JSON.parse(e.data);
   
   if(msg_obj["msg_code"]=="2")
   {
    my_loc=msg_obj["my_loc"];
    my_type=msg_obj["my_type"];
    opp_ip = msg_obj["opp_ip"];
    opp_loc = msg_obj["opp_loc"];
    opp_type = msg_obj["opp_type"];
    kalla_x = msg_obj["kalla_x"];
    kalla_y = msg_obj["kalla_y"];
   }
   else
   {
    opp_loc = msg_obj["opp_loc"];
   kalla_x = msg_obj["kalla_x"];
   kalla_y = msg_obj["kalla_y"];
   }

   if(msg_obj["opp_loc"]==my_loc)
   {
   	if(opp_type=="kalla")
   	{
   		alert("You caught the kalla");
      window.location.href="http://" + serverIP + "/knk/lobby.php"
   	}
   	if(opp_type=="kop")
   	{
   		alert("You got caught by the kop");
          window.location.href="http://" + serverIP + "/knk/lobby.php"
   	}
   }

  

};
conn.onclose = function(e){
  var x= document.createElement("p");
    x.innerHTML= "Connection Closed! " + e.data ;
    document.body.appendChild(x);
    

}
work.onmessage = function(e)
{
  var msg=e.data;
  var same_con = msg.charCodeAt(0);
  var same_page = msg.charCodeAt(1);
  var dist = parseFloat(msg.substring(2));
  var dist_ratio=dist/max_dist;
  if(opp_type=="kalla" && same_con == 48)
  {
    audio.pause();
    audio.playbackRate = 0.5;
    audio.play();
  }
  else if(opp_type=="kalla" && same_con == 49 && same_page == 48)
  {
    audio.pause();
    audio.playbackRate = 1.0;
    audio.play();
  }
  else if(opp_type=="kalla" && same_con ==49 && same_page == 49)
  {
    audio.pause();
    audio.playbackRate = 1.0;
    if(dist<=60.0)
    {
      audio.volume=1.0;
      audio.playbackRate=2.0;
    }
    else 
    {
      if((1-dist_ratio)<=1.0)
      {
      audio.volume = 1-dist_ratio;
      }
      else
      {
        audio.volume = 1.0;
      }
    }
    audio.play();

  }
};

function changeloc(e)
{
	 my_loc=this.getAttribute("data-location");
	 var obj;
   if(opp_type=="kop")
   {
    obj = {"msg_code":"69","my_loc":this.getAttribute("data-location"),"opp_loc":opp_loc,"kalla_x":e.clientX,"kalla_y":e.clientY,"my_ip":my_ip,"opp_ip":opp_ip};
   }
   if(opp_type=="kalla")
   {
    obj = {"msg_code":"69","my_loc":this.getAttribute("data-location"),"opp_loc":opp_loc,"my_ip":my_ip,"opp_ip":opp_ip,"kalla_x":kalla_x,"kalla_y":kalla_y};
   }
  var str=JSON.stringify(obj);
    conn.send(str);
	if(opp_loc==my_loc)
   {
   	if(opp_type=="kalla")
   	{
   		alert("You caught the kalla");
      window.location.href="http://" + serverIP + "/knk/lobby.php"
   	}
   	if(opp_type=="kop")
   	{
   		alert("You got caught by the kop");
      window.location.href="http://" + serverIP + "/knk/lobby.php"
   	}
   }
   /*
   else{

    if(opp_type=="kop")
    {
      
      freeze_play(20000);
      alert("Alert: You are free to play now");
    }
   }	*/
  

}
/*
function freeze_play(iMilliSeconds)
{
  for(var i=0;i<hideout.length;i++)
      {
        hideout[i].removeEventListener("click",changeloc,false);
      }
  var counter= 0
        , start = new Date().getTime()
        , end = 0;
    while (counter < iMilliSeconds && opp_loc != my_loc) {
        end = new Date().getTime();
        counter = end - start;
    }
    for(var i=0;i<hideout.length;i++)
      {
        hideout[i].addEventListener("click",changeloc,false);
      }
}
*/