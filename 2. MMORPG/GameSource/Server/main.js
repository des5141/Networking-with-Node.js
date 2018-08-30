/** INFORMATION --

Author: yuto
(C) YUTO SOFT, 2018
*/

{ //Basic setting
	{ //Setup server information
		var tcp_port = 5833; //TCP port
		var ip = '127.0.0.1'; //IP address
	}
	{ //Import classes
		var User = require('./classes/user.js');
		var UserBox = require('./classes/user_box.js');
		var Colors = require('colors');
	}
	{ //Set console colors
		Colors.setTheme({
			asome:'rainbow',
			input:'gray',
			verbose:'cyan',
			prompt:'gray',
			info:'green',
			data: 'gray',
			help:'cyan',
			warn:'yellow',
			debug: 'blue',
			error: 'red'
		});
	}
	{ //Set variables
		var temp_buffer = "";
		var buffer_string = "";
		var buffer_reading_string = "";
		var i = 0, j = 0;
		var array_width = 6;
		var array_height = 5;
		var array = [];
		var array_save = "";
		var split = require('string-split');
		var fs = require('fs');
		fs.readFile('map/map.txt', 'utf8', function(err, data){
			/*array_save = data;
			console.log(array_save);*/
			strArray = split('\n', data);
			
			for(i = 0; i < array_height; i++)
			{
				array[i] = new Array();
				for(j = 0; j < array_width; j++)
				{
					array[i][j] = strArray[i][j];
					array_save += array[i][j];
				}
			}
		});
	}
	{ //Runtime tables
		var authenticated_users = UserBox.create();
	}
}
{ //Signal setting
	//Client-bound signal IDs
	const outsig_login_refused = 0;
	const outsig_login_accepted = 1;
	const outsig_ping = 2;
	const outsig_user_leave = 3;
	const outsig_user_join = 4;
	const outsig_user_position = 5;
	const outsig_user_space = 6;
	const outsig_user_map = 7;

	//Server-bound signal IDs
	const insig_login = 0;
	const insig_ping = 1;
	const insig_user_position = 2;
	const insig_user_space = 3;
}
{ //Server information
	console.log("Networking with Node.js".data);
	console.log(" - Node.js Server".data, "version 1.0");
}
{ //Server run
	var server = require('./classes/server.js').createServer();
}
{ //Send message
	function send_id_message(sock, id, msg) {
	var json_string = JSON.stringify({
		id: id,
		msg: msg
	});
	
	sock.send("㏆" + json_string.length + "®" + json_string);
}
}

{ //Server event - step
	! function step() {
		//Send all
		var json_string = JSON.stringify({
			map: array_save,
			width: array_width,
			height: array_height
		});
		
		authenticated_users.each(function(user) {
			send_id_message(user.socket, outsig_user_map, json_string);
		});
		
		//While
		setTimeout(function() {
			step();
		}, 500);
	}()
}

{ //Message processing
	server.onConnection(function(dsocket) {
		// When get the messages
		dsocket.onMessage(function(data) {
			try{
				//Set the operation
				buffer_string = data.toString();
				buffer_reading_string = temp_buffer + buffer_reading_string;
				temp_buffer = "";
				
				for(i = 0; i < buffer_string.length; i++)
				{
					if(buffer_string.charAt(i) != "#")
					{
						buffer_reading_string += buffer_string.charAt(i);
						if(buffer_string.length-1 == i)
						{
							temp_buffer += buffer_reading_string;
						}
					}

					if(buffer_string.charAt(i) == "#")
					{
						//Parse incoming JSON
						var json_data = JSON.parse(buffer_reading_string);
						var id = json_data.id;
						var msg = json_data.msg;
						//console.log("Message :".data + buffer_reading_string);
						buffer_reading_string = "";

						//Route into different functions
						switch (id) {
							//Ping
							case insig_ping:
								send_id_message(dsocket, outsig_ping, msg);
							break;

							//Sign-in request
							case insig_login:
								//Unauthenticated users only
								if (authenticated_users.findUserBySocket(dsocket) == null) {
									//Name already taken
									if (authenticated_users.findUserByName(msg) != null) {
										send_id_message(dsocket, outsig_login_refused, "");
									}
									//Name OK
									else {
										var new_user = User.create(msg, 0, dsocket);
										authenticated_users.addUser(new_user);
										console.log("New user joined :".data, new_user.name, "(" + new_user.uuid + ")");
										//Tell user to come in
										var new_user_announcement = JSON.stringify({
											name: new_user.name,
											uuid: new_user.uuid
										});
										send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
										//Announce to other users
										authenticated_users.each(function(user) {
											if (user.uuid != new_user.uuid) {
												send_id_message(user.socket, outsig_user_join, new_user_announcement);
											}
										});
									}
								}
							break;
							
							//Invalid message ID
							default:
								console.log("Invaild ID".error);
							break;

							case insig_user_position:
								var from_user;
								if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {

									// 유저 정보를 받아온다! 클라이언트로부터
									user_uuid = json_data.user_uuid;
									user_x = json_data.user_x;
									user_y = json_data.user_y;

									var user_position = JSON.stringify({
										uuid: user_uuid,
										x: user_x,
										y: user_y
									});

									authenticated_users.each(function(user) {
										if ((user.uuid != from_user.uuid)&&(user.space == from_user.space)) {
											send_id_message(user.socket, outsig_user_position, user_position);
										}
									});
								}
							break;

							case insig_user_space:
								var from_user;
								if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {
									from_user.space = msg;
									send_id_message(dsocket, outsig_user_space, from_user.space);
									console.log("User space moved:".data, from_user.name, "is go to".data, from_user.space);
								}
							break;
						}
					}
					
				}
			} catch(e){
				temp_buffer = "";
				buffer_reading_string = "";
				console.log("Error processing message :".error, e);
			}
		});
		// When client disconnect
		dsocket.onClose(function() {
		//Respond for authenticated users only
		var quitter;
		if ((quitter = authenticated_users.findUserBySocket(dsocket)) != null) {
			console.log("Removing user   :".data, quitter.name, "(" + quitter.uuid + ")");
			//Let everyone else know the user is leaving
			var logout_announcement = JSON.stringify({
				name: quitter.name,
				uuid: quitter.uuid
			});
			authenticated_users.each(function(user) {
				if (user.uuid != quitter.uuid) {
					send_id_message(user.socket, outsig_user_leave, logout_announcement);
				}
			});
			//Remove the user
			authenticated_users.removeUser(quitter.uuid);
		}
	});
});
}
{ //Boot the server
	server.listen(tcp_port, ip);
}