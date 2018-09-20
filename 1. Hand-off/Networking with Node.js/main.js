




//{ Useful functions
	//min ~ max 사이의 임의의 정수 반환
	function getRandomInt(min, max) { 
		return Math.floor(Math.random() * (max - min)) + min;
	}
	//Stack 생성자 정의
	function Stack() {

		//스택의 요소가 저장되는 배열
		this.dataStore = [];

		//스택의 위치
		this.top = -1;

		//함수정의
		this.push   = push;
		this.pop    = pop;
		this.peek   = peek;
		this.clear  = clear;
		this.length = length;
	}

	//스택에 요소를 추가
	function push(element) {
		this.top = this.top +1;
		this.dataStore[this.top] = element;
	}

	//스택의 꼭대기의 요소를 반환한다.
	//단 top이 감소하는것은 아니다.
	function peek() {
		return this.dataStore[this.top];
	}

	//스택 최상층의 요소를 반환한다.
	function pop() {

		//Stack underflow
		if(this.top<=-1)
		{
			console.log("Stack underflow!!!");
			return;
		}
		else
		{
			var popped = this.dataStore[this.top];
			//top을 1 감소시킨다.
			this.top = this.top -1;
			return popped;        
		}

	}

	//스택의 전체 요소를 삭제한다.
	function clear() {
		this.top = -1;
	}

	//스택에 저장된 데이터 수
	function length() {
		return this.top+1;
	}
//}

//{ Requires
	var cluster = require('cluster');
	var User = require('./classes/user.js');
	var UserBox = require('./classes/user_box.js');
	var Colors = require('colors');
	var split = require('string-split');
	var fs = require('fs');
	var async = require('async');
	var server = require('./classes/server.js').createServer();
//}

//{ Colors
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

//{ Setup server information
	var tcp_port = 20000; //TCP port
	var ip = '127.0.0.1'; //IP address
//}

//{ Set variables
	var temp_buffer = "";
	var buffer_string = "";
	var buffer_reading_string = "";
	var i = 0;
	var authenticated_users = UserBox.create();
//}

//{ Signal setting
	//Client-bound signal IDs
	const outsig_login_refused = 0;
	const outsig_login_accepted = 1;
	const outsig_ping = 2;
	const outsig_user_leave = 3;
	const outsig_user_join = 4;
	const outsig_user_position = 5;
	const outsig_user_move = 6;
	//Server-bound signal IDs
	const insig_login = 0;
	const insig_ping = 1;
	const insig_user_position = 2;
//}

//{ Send message
	function send_id_message(sock, id, msg) {
		if(sock != -1)
		{
			var json_string = JSON.stringify({
				id: id,
				msg: msg
			});
			sock.send("㏆" + json_string.length + "®" + json_string);
		}
	}
//}

//Main code is start from here !
if(cluster.isMaster)
{
	var tasks = [
		function(callback)
		{
			//{ Master processor
				server.listen(tcp_port, ip);
				port = 1;
				worker_list = new Array();
				worker_max = 10;
				callback(null, "Master processor start");
			//}
		},
		function(callback)
		{
			//{ Make worker as much as count of cpu
				console.log("Cluster fork - - - - - - - - - ".inverse);
				for(i = 0; i < worker_max; i++)
				{
					cluster.fork();
					worker_list[i] = 0; 
				}
				callback(null, "Worker forked!");
			//}
		}];
		
	async.series(tasks, function (err, results) {});
	
	//{ If suddenly, worker died
		cluster.on('exit', function(worker, code, signal) {

			//Died worker
			console.log('Worker died - '.error + "processer".gray + worker.id);

			if (code == 200) {
				cluster.fork();
			}
		});
	//}
	
	//{ Send port to workers
		for(var id in cluster.workers)
		{
			cluster.workers[id].send({to : 'worker', type : 'start', port : 20000+port, id : port-1});
			port++;
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
					//console.log(buffer_reading_string);
					
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
											console.log("New user connected : ".data, new_user.name, "(" + new_user.uuid + ")");
											//Tell user to come in
											var new_user_announcement = JSON.stringify({
												name: new_user.name,
												uuid: new_user.uuid
											});
											send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
											
											for(i = 0; i < worker_max; i++)
											{
												if(worker_list[i] < 2)
												{
													send_id_message(dsocket, outsig_user_move, 20001+i);
													break;
												}
											}
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
							}
						}
						
					}
				} catch(e){
					temp_buffer = "";
					buffer_reading_string = "";
					//console.log("Error processing message :".error, e);
				}
			});
			// When client disconnect
			dsocket.onClose(function() {
				//Respond for authenticated users only
				var quitter;
				if ((quitter = authenticated_users.findUserBySocket(dsocket)) != null) {
					//console.log("Removing user   :".data, quitter.name, "(" + quitter.uuid + ")");
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
	
	//{ Server event - step
		!function step() {
			
			setTimeout(function() {
				step();
			}, 10);
		}()
	//}
	
	//{ Processor Message
		cluster.on('message', function (worker, message) {
			if(message.to == 'master')
			{
				switch(message.type)
				{
					case 'process_user_count':
						worker_list[message.id] = message.value;
					break;
				}
			}
			
			if(message.to == 'worker')
			{
				//Message to worker
				for(var id in cluster.workers)
				{
					cluster.workers[id].send(message);
				}
			}
		});
	//}
}

if(cluster.isWorker)
{
	//Worker processor
	process_id = -1;
	
	//{ Processor Message
		process.on('message', function(message) {
			if(message.to == 'worker')
			{
				switch(message.type)
				{
					case 'start':
						server.listen(message.port, ip);
						process_id = message.id;
					break;
				}
			}
		});
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
										var uuid = json_data.uuid;
										var check = true;
										//Name already taken
										/*if (authenticated_users.findUserByName(msg) != null) {
											send_id_message(dsocket, outsig_login_refused, "");
										}*/
										authenticated_users.each(function(user) {
											if(user.uuid == uuid)
											{
												check = false;
											}
										});
										
										if(check)
										{
											// 새로운 계정!
											var new_user = User.create(msg, 0, dsocket);
											new_user.uuid = uuid;
											authenticated_users.addUser(new_user);
											console.log("New user joined :".data, new_user.name, "(" + new_user.uuid + ")");
											
											//Tell user to come in
											var new_user_announcement = JSON.stringify({
												name: new_user.name,
												uuid: new_user.uuid
											});
											send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
										}
										
										else
										{
											authenticated_users.each(function(user) {
												if((user.uuid == uuid)&&(user.socket == -1))
												{
													user.socket = dsocket;
													console.log("Reconnected user :".data, user.name, "(" + user.uuid + ")");
													var new_user_announcement = JSON.stringify({
														name: user.name,
														uuid: user.uuid
													});
													send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
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
										from_user.x = user_x;
										from_user.y = user_y;
										var user_position = JSON.stringify({
											uuid: user_uuid,
											x: user_x,
											y: user_y
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
					console.log("Out user   :".data, quitter.name, "(" + quitter.uuid + ")");
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
					//authenticated_users.removeUser(quitter.uuid);
					quitter.socket = -1;
				}
			});
		});
	//}
	
	//{ Server event - step
		!function step() {
			var user_count = 0;
			authenticated_users.each(function(user) {
				user_count++;
			});
			process.send({to : 'master', type : 'process_user_count', value : user_count, id : process_id});
			
			try{
				authenticated_users.each(function(user) {
					var user_position = JSON.stringify({
						uuid: user.uuid,
						x: user.x,
						y: user.y
					});
												
					send_id_message(user.socket, outsig_user_position, user_position);
												
					authenticated_users.each(function(user2) {
						if ((user.uuid != user2.uuid)&&(user.space == user2.space)&&( (user.x-500 < user2.x)&&(user.x+500 > user2.x)&&(user.y-500 < user2.y)&&(user.y+500 > user2.y) )) {
							send_id_message(user2.socket, outsig_user_position, user_position);
						}
					});
				});
			}catch(e){}
			setTimeout(function() {
				step();
			}, 10);
		}()
	//}
}


