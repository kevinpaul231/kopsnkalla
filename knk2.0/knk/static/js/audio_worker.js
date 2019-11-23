self.onmessage = function(e)
{
	   var msg_obj = JSON.parse(e.data);
	   var reply;
	   var opp_continent = msg_obj["opp_loc"].substring(0,3);
	   var my_continent = msg_obj["my_loc"].substring(0,3);
	   var opp_webpage =msg_obj["opp_loc"].substring(3,5);
	   var my_webpage =msg_obj["my_loc"].substring(3,5);
	   //var opp_page_loc = msg_obj["obj_loc"].substring(4);
	   //var my_page_loc = msg_obj["my_loc"].substring(4);
	   if(opp_continent!=my_continent)
	   {
	   	self.postMessage("0");
	   }
	   else if(opp_continent==my_continent && opp_webpage!=my_webpage)
	   {
	   	self.postMessage("10");
	   }
	   else if(opp_continent==my_continent && opp_webpage==my_webpage)
	   {
	   	var kalla_x = parseInt(msg_obj["kalla_x"]);
	   	var kalla_y = parseInt(msg_obj["kalla_y"]);
	   	var my_x = parseInt(msg_obj["my_x"]);
	   	var my_y = parseInt(msg_obj["my_y"]);
	   	var dist = Math.sqrt((Math.pow(kalla_x-my_x,2))+(Math.pow(kalla_y-my_y,2)));
	   	self.postMessage("11"+dist);
	   }

};