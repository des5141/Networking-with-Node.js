/** INFORMATION --

Author: yuto
(C) YUTO SOFT, 2018
*/

//{ Requires
	var cluster = require('cluster');
	var os = require('os');
	var Colors = require('colors');
	var split = require('string-split');
	var fs = require('fs');
	var User = require('./classes/user.js');
	var UserBox = require('./classes/user_box.js');
//}
//{ Setup console colors
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
//}
//{ Setup variables
	var authenticated_users = UserBox.create();
	var temp_buffer = "";
	var buffer_string = "";
	var buffer_reading_string = "";
	var i = 0, j = 0;
	var array_width = 9;
	var array_height = 5;
	var array = [];
	var array_save = [];
	var max_space = 10;
	var strArray = "";
	fs.readFile('map/map0.txt', 'utf8', function(err, data){
		strArray = split('\n', data);
		array[0] = new Array();
		array_save[0] = new Array();
		for(i = 0; i < array_height; i++)
		{
			array[0][i] = new Array();
			for(j = 0; j < array_width; j++)
			{
				array[0][i][j] = strArray[i][j];
				array_save[0] += array[0][i][j];
			}
		}
	});
			
	fs.readFile('map/map1.txt', 'utf8', function(err, data){
		strArray = split('\n', data);
		array[1] = new Array();
		array_save[1] = new Array();
		for(i = 0; i < array_height; i++)
		{
			array[1][i] = new Array();
			for(j = 0; j < array_width; j++)
			{
				array[1][i][j] = strArray[i][j];
				array_save[1] += array[1][i][j];
			}
		}
	});
			
	fs.readFile('map/map2.txt', 'utf8', function(err, data){
		strArray = split('\n', data);
		array[2] = new Array();
		array_save[2] = new Array();
		for(i = 0; i < array_height; i++)
		{
			array[2][i] = new Array();
			for(j = 0; j < array_width; j++)
			{
				array[2][i][j] = strArray[i][j];
				array_save[2] += array[2][i][j];
			}
		}
	});
//}
//{ Setup server information
	var tcp_port = 5833;
	var ip = '127.0.0.1';
//}
a = 10;

// Main code is start from here !
if(cluster.isMaster)
{	
	//{ Server information
		console.log("Networking with Node.js".data);
		console.log(" - Node.js Server".data, "version 1.0");
	//}
	//{ Make worker as much as count of cpu
		os.cpus().forEach(function (cpu) {
			cluster.fork();
		});
	//}
	//{ If suddenly, worker died
		cluster.on('exit', function(worker, code, signal) {

			//Died worker
			console.log('Worker died - '.error + "processer".gray + worker.id);

			if (code == 200) {
				//종료 코드가 200인 경우, 워커 재생성
				cluster.fork();
			}
		});
	//}
	//{ Get message from worker's
		cluster.on('message', function (worker, message) {
			if(message.to == 'master')
			{
				//Message to master
				switch(message.type)
				{
					case 'login':
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
								console.log("already");
						});
						console.log("logined - ".gray + message.uuid + "(".gray + message.name +")".gray);
						var new_user = User.create(message.name, 0, -1, message.uuid);
						authenticated_users.addUser(new_user);
						for(var id in cluster.workers)
						{
							cluster.workers[id].send({type : 'login', to : 'worker', uuid : message.uuid, name : message.name});
						}
					break;
					
					case 'quit':
						console.log("quit - ".gray + message.uuid);
						authenticated_users.removeUser(message.uuid);
						for(var id in cluster.workers)
						{
							cluster.workers[id].send({type : 'quit', to : 'worker', uuid : message.uuid});
						}
					break;
					
					case 'operator':
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
							{
								user.control = message.uuid;
								console.log(user.uuid , message.uuid);
							}
						});
					break;
					
					default:
						console.log("Wrong message type from process message".error, "-".gray, message.type);
					break;
				}
			}
			
			if(message.to == 'worker')
			{
				//Message to worker
				
			}
		});
	//}
	
	/*
	//{ Server event - step
		! function step() {
			//Send all
			var player_info = new Array();
			var player_max = new Array();
			for(i = 0; i < max_space; i++)
			{
				player_info[i] = "";
				player_max[i] = 0;
			}
			
			authenticated_users.each(function(user) {
				//Operation about user step
				switch(user.control)
				{
					case "none":
						break;
						
					case "up":
						if(user.y-1 >= 0)
						{
							if(array[user.space][user.y-1][user.x] == 1)
							{
								user.y--;
								user.control = "";
							}
						}
						break;
						
					case "down":
						if(user.y+1 < array_height)
						{
							if(array[user.space][user.y+1][user.x] == 1)
							{
								user.y++;
								user.control = "";
							}
						}
						break;
						
					case "left":
						if(user.x-1 >= 0)
						{
							if(array[user.space][user.y][user.x-1] == 1)
							{
								user.x--;
								user.control = "";
							}
						}
						break;
						
					case "right":
						if(user.x+1 < array_width)
						{
							if(array[user.space][user.y][user.x+1] == 1)
							{
								user.x++;
								user.control = "";
							}
						}
						break;
				}
				
				//Save the users state in packet
				var x = user.x;
				var y = user.y;
				player_info[user.space] += user.name + "#" + x.toString() + "#" + y.toString() + "#";
				player_max[user.space]++;
			});
				
			authenticated_users.each(function(user) {
				var user_map = "";
				var i, j;
				var base_x = user.x - 7;
				var base_y = user.y - 7;
				for(i = 0; i < 15; i++)
				{
					for(j = 0; j < 15; j++)
					{
						if((user.y-7+i >= 0)&&(user.y-7+i < array_height)&&(user.x-7+j >= 0)&&(user.x-7+j < array_width))
						{
							//This is map inside
							user_map += array[user.space][user.y-7+i][user.x-7+j];
						}else{
							//This is map outside
							user_map += "0";
						}
					}
				}
				
				
				var json_string = JSON.stringify({
					map: array_save[user.space],
					width: array_width,
					height: array_height,
					player_max: player_max[user.space],
					player_info : player_info[user.space],
					user_x : user.x,
					user_y : user.y
				});
				//console.log(user_map);
				//send_id_message(user.socket, outsig_user_map, json_string);
				
				for(var id in cluster.workers)
				{
					cluster.workers[id].send({type : 'map', to : 'worker', json : json_string, uuid : user.uuid});
				}
			});
			
			//While
			setTimeout(function() {
				step();
			}, 200);
		}()
	//}
	*/
}

else if(cluster.isWorker){
	//{ Data get from master server
		process.on('message', function(message) {
			if(message.to == 'worker')
			{
				switch(message.type)
				{
					case 'login':
						var check = 1;
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
							{
								check = -1;
							}
						});
						
						if(check == 1)
						{
							console.log("login - ".gray + message.uuid + "|".gray + process.pid);
							var new_user = User.create(message.name, 0, -1, message.uuid);
							authenticated_users.addUser(new_user);
						}
					break;
					
					case 'quit':
						var check = -1;
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
							{
								check = 1;
							}
						});
						
						if(check == 1)
						{
							console.log("quit - ".gray + message.uuid + "|".gray + process.pid);
							authenticated_users.removeUser(message.uuid);
						}
					break;
					
					case 'map':
						authenticated_users.each(function(user) {
							if((message.uuid == user.uuid)&&(user.mine == 1))
							{
								send_id_message(user.socket, outsig_user_map, message.json);
							}
						});
					break;
				}
			}
		});
	//}

	//{ Signal setting
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
		const insig_user_operation = 4;
		
	//} Signal setting
	//{ Server run
		var server = require('./classes/server.js').createServer();
	//}
	//{ Send message
		function send_id_message(sock, id, msg) {
		var json_string = JSON.stringify({
			id: id,
			msg: msg
		});
		
		sock.send("㏆" + json_string.length + "®" + json_string);
		}
	//}
	//{ Message processing
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
											var new_user = User.create(msg, 0, dsocket, -1);
											authenticated_users.addUser(new_user);
											new_user.mine = 1;
											console.log("New user joined :".data, new_user.name, "(" + new_user.uuid + ")");
											
											//Tell user to come in
											var new_user_announcement = JSON.stringify({
												name: new_user.name,
												uuid: new_user.uuid
											});
											send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
											
											process.send({type : 'login', to : 'master', uuid : new_user.uuid, name : new_user.name});
										}
									}
								break;
								
								//Processing the user operation
								case insig_user_operation:
									var from_user;
									if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null)
									{
										//from_user.control = msg;
										process.send({type : 'operator', to : 'master', uuid : from_user.uuid, operator : msg});
										console.log("operator");
									}
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
								
								
								//Invalid message ID
								default:
									console.log("Invaild ID".error);
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
				process.send({type : 'quit', to : 'master', uuid : quitter.uuid});
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
	//}
	//{ Boot the server
		server.listen(tcp_port, ip);
	//}
}