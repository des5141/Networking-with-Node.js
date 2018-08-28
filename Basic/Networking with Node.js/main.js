/** INFORMATION --
Networking with Node.js (BASED GMSIO)
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
		var i = 0;
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

	//Server-bound signal IDs
	const insig_login = 0;
	const insig_ping = 1;
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
						console.log("Message :".data + buffer_reading_string);
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
										console.log("Name rejected.");
									}
									//Name OK
									else {
										var new_user = User.create(msg, dsocket);
										authenticated_users.addUser(new_user);
										console.log("New user added:", new_user.name, "(" + new_user.uuid + ")");
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
							
							//Shout message
							case insig_shout:
								//Authenticated users only
								var from_user;
								if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {
									//Relay it to everyone else
									var message_announcement = JSON.stringify({
										from: from_user.name,
										msg: msg
									});
									authenticated_users.each(function(user) {
										if (user.uuid != from_user.uuid) {
											send_id_message(user.socket, outsig_shout_relay, message_announcement);
										}
									});
								}
							break;
							
							//Invalid message ID
							default:
								console.log("Discarded garbage (invalid ID).");
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
			console.log("Removing user:", quitter.name, "(" + quitter.uuid + ")");
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