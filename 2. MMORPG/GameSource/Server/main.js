/** INFORMATION --

Author: yuto
(C) YUTO SOFT, 2018
*/

//{ Others
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
	var os = require('os');
	var Colors = require('colors');
	var split = require('string-split');
	var fs = require('fs');
	var User = require('./classes/user.js');
	var UserBox = require('./classes/user_box.js');
	var sqrt = require('math-sqrt');
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
	array = [];
	array_save = [];
	var max_space = 10;
	var strArray = "";
	
	fs.readFile('./map/map0.txt', 'utf8', function(err, data){
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

	fs.readFile('./map/map1.txt', 'utf8', function(err, data){
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
			
	fs.readFile('./map/map2.txt', 'utf8', function(err, data){
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


//Main code is start from here !
if(cluster.isMaster)
{	
	//{ Requires
		var Monster = require('./classes/monster.js');
		var MonsterBox = require('./classes/monster_box.js');
		var map_monsters = MonsterBox.create();
	//}
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
				cluster.fork();
			}
		});
	//}
	//{ Sample make monsters
		var mon00 = Monster.create(1, 0, 1, 0);
		map_monsters.addMonster(mon00);
		var mon01 = Monster.create(1, 0, 2, 2);
		map_monsters.addMonster(mon01);
		var mon02 = Monster.create(1, 0, 0, 3);
		map_monsters.addMonster(mon02);
		var stackObj = new Stack();
		
		var mon02 = Monster.create(0, 1, 0, 4);
		map_monsters.addMonster(mon02);
		var mon02 = Monster.create(0, 2, 0, 4);
		map_monsters.addMonster(mon02);
	//}
	//{ Get message from worker's
		cluster.on('message', function (worker, message) {
			if(message.to == 'master')
			{
				//Message to master
				switch(message.type)
				{
					case 'login':
						console.log("Login user : ".gray + message.uuid + "(".gray + message.name +")".gray);
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
								console.log("already");
						});
						
						var new_user = User.create(message.name, -1, message.id, message.uuid, 0);
						
						var i, j;
						for(i = 0; i < array_height; i++)
						{
							for(j = 0; j < array_width; j++)
							{
								if(array[0][i][j] == "2")
								{
									new_user.x = j;
									new_user.y = i;
								}
							}
						}
						
						authenticated_users.addUser(new_user);
						for(var id in cluster.workers)
						{
							cluster.workers[id].send({type : 'login', to : 'worker', uuid : message.uuid, name : message.name, id : message.id});
						}
					break;
					
					case 'quit':
						console.log("Removing user   :".data, "(" + message.uuid + ")");
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
								user.control = message.operator;
							}
						});
					break;
					
					case 'space':
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
							{
								user.space = message.space;
								var i, j;
								for(i = 0; i < array_height; i++)
								{
									for(j = 0; j < array_width; j++)
									{
										if(array[user.space][i][j] == "2")
										{
											user.x = j;
											user.y = i;
										}
									}
								}
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
				for(var id in cluster.workers)
				{
					cluster.workers[id].send(message);
				}
			}
		});
	//}
	
	
	//{ Server event - step
		! function step() {
			//Send all
			var player_info = new Array();
			var player_max = new Array();
			var monster_info = new Array();
			var monster_max = new Array();
			for(i = 0; i < max_space; i++)
			{
				player_info[i] = "";
				player_max[i] = 0;
				
				monster_info[i] = "";
				monster_max[i] = 0;
			}
			
			//If monster go to out side
			map_monsters.each(function(monster) {
				try
				{
					if(array[monster.space][monster.y][monster.x] == 0)
					{
						map_monsters.removeMonster(monster.uuid);
					}
				}catch(e){}
			});
			
			
			authenticated_users.each(function(user) {
				//Operation about user step
				can = true;
				doit = true;
				switch(user.control)
				{
					case "none":
						break;
						
					case "up":
						if(user.y-1 >= 0)
						{
							if(array[user.space][user.y-1][user.x] != 0)
							{
								map_monsters.each(function(monster){
									if((((user.y-1 != monster.y)&&(user.x == monster.x))||(user.x != monster.x))&&(doit))
									{
										
									}else if(monster.space == user.space){
										can = false;
									}
								});
								if(can)
								{
									user.y--;
									user.control = "";
									doit = false;
								}
							}
						}
						break;
						
					case "down":
						if(user.y+1 < array_height)
						{
							if(array[user.space][user.y+1][user.x] != 0)
							{
								map_monsters.each(function(monster){
									if((((user.y+1 != monster.y)&&(user.x == monster.x))||(user.x != monster.x))&&(doit))
									{
										
									}else if(monster.space == user.space){
										can = false;
									}
								});
								if(can)
								{
									user.y++;
									user.control = "";
									doit = false;
								}
							}
						}
						break;
						
					case "left":
						if(user.x-1 >= 0)
						{
							if(array[user.space][user.y][user.x-1] != 0)
							{
								map_monsters.each(function(monster){
									if((((user.x-1 != monster.x)&&(user.y == monster.y))||(user.y != monster.y))&&(doit))
									{
										
									}else if(monster.space == user.space){
										can = false;
									}
								});
								if(can)
								{
									user.x--;
									user.control = "";
									user.xscale = -1;
									doit = false;
								}
							}
						}
						break;
						
					case "right":
						if(user.x+1 < array_width)
						{
							if(array[user.space][user.y][user.x+1] != 0)
							{
								map_monsters.each(function(monster){
									if((((user.x+1 != monster.x)&&(user.y == monster.y))||(user.y != monster.y))&&(doit))
									{
										
									}else if(monster.space == user.space){
										can = false;
									}
								});
								if(can)
								{
									user.x++;
									user.control = "";
									user.xscale = 1;
									doit = false;
								}
							}
						}
						break;
				}
				
				//Save the users state in packet
				var x = user.x;
				var y = user.y;
				var xscale = user.xscale;
				player_info[user.space] += user.name + "#" + x.toString() + "#" + y.toString() + "#" + xscale.toString() + "#";
				player_max[user.space]++;
			});
			
			map_monsters.each(function(monster){
				//Operation about monster step
				doit = true;
				authenticated_users.each(function(user) {
					if((doit)&&(monster.space == user.space))
					{
						var width = user.x-monster.x;
						var height = user.y-monster.y;
						if(width < 0)
							width *= -1;
						if(height < 0)
							height *= -1;
						if(sqrt(width*2+height*2) < monster.visual)
						{
							console.log(sqrt(width*2+height*2));
							doit = false;
							//console.log("FIND!");
							// here to follow
							if((monster.x > user.x)&&((((monster.x-1 != user.x)&&(monster.y == user.y))||((monster.y != user.y)))&&(array[monster.space][monster.y][monster.x-1] == 1)))
							{
								can = true;
								map_monsters.each(function(monster2){
									if(((monster2.x == monster.x-1)&&(monster2.y == monster.y))&&(monster.space == monster2.space))
									{
										can = false;
									}
								});
								if(can)
								{
									monster.x--;
									monster.xscale = -1;
								}
							}if((monster.x < user.x)&&((((monster.x+1 != user.x)&&(monster.y == user.y))||((monster.y != user.y)))&&(array[monster.space][monster.y][monster.x+1] == 1))){
								can = true;
								map_monsters.each(function(monster2){
									if(((monster2.x == monster.x+1)&&(monster2.y == monster.y))&&(monster.space == monster2.space))
									{
										can = false;
									}
								});
								if(can)
								{
									monster.x++;
									monster.xscale = 1;
								}
							}else
							if((monster.y > user.y)&&((((monster.y-1 != user.y)&&(monster.x == user.x))||((monster.x != user.x)))&&(array[monster.space][monster.y-1][monster.x] == 1)))
							{
								can = true;
								map_monsters.each(function(monster2){
									if(((monster2.y == monster.y-1)&&(monster2.y == monster.y))&&(monster.space == monster2.space))
									{
										can = false;
									}
								});
								if(can)
								{
									monster.y--;
								}
							}else
							if((monster.y < user.y)&&((((monster.y+1 != user.y)&&(monster.x == user.x))||((monster.x != user.x)))&&(array[monster.space][monster.y+1][monster.x] == 1))){
								can = true;
								map_monsters.each(function(monster2){
									if(((monster2.y == monster.y+1)&&(monster2.y == monster.y))&&(monster.space == monster2.space))
									{
										can = false;
									}
								});
								if(can)
								{
									monster.y++;
								}
							}
						}
					}
					
				});
				
				//Save the monsters states in packet
				var x = monster.x;
				var y = monster.y;
				var type = monster.type;
				var xscale = monster.xscale;
				monster_info[monster.space] += type.toString() + "#" + x.toString() + "#" + y.toString() + "#" + xscale.toString() + "#";
				monster_max[monster.space]++;
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
					monster_max : monster_max[user.space],
					monster_info : monster_info[user.space],
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
	
}

if(cluster.isWorker)
{
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
							//console.log("login - ".gray + message.uuid + "|".gray + process.pid);
							//var new_user = User.create(message.name, 0, -1, message.uuid);
							var new_user = User.create(message.name, -1, message.id, message.uuid, 0);
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
							//console.log("quit - ".gray + message.uuid + "|".gray + process.pid);
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
		const insig_user_register = 5;
		
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
									// Unauthenticated users only
									if (authenticated_users.findUserBySocket(dsocket) == null) {

										can = false;

										user_id = json_data.user_id;
										user_pass = json_data.user_pass;

										var fs = require('fs');
										fs.exists('Accounts/'+user_id+'.txt', function(exists){
											if(exists)
											{
												var split = require('string-split');
												fs.readFile('Accounts/'+user_id+'.txt', 'utf8', function(err, data){
													var strArray = split('#', data);
													if(user_pass == strArray[1])
													{
														//Name already taken
														if (authenticated_users.findUserById(strArray[0]) != null) {
															send_id_message(dsocket, outsig_login_refused, "이미 접속중인 계정입니다.");
														}

														// Name OK
														else {
															var new_user = User.create(strArray[2], dsocket, strArray[0], -1, 0);
															authenticated_users.addUser(new_user);
															console.log("New user added :".gray, new_user.name, "(" + new_user.uuid + ")");
															// Tell user to come in
															var new_user_announcement = JSON.stringify({
																name: new_user.name,
																uuid: new_user.uuid,
																id: new_user.id
															});
															send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
															process.send({type : 'login', to : 'master', uuid : new_user.uuid, name : new_user.name, id : new_user.id});
															new_user.mine = 1;
														}

													}else{
														// 로그인 실패
														send_id_message(dsocket, outsig_login_refused, "로그인에 실패하였습니다.");
													}
												});

											}else{
												// 계정이 없어!
												send_id_message(dsocket, outsig_login_refused, "존재하지 않는 계정입니다.");
											}
										});
									}
								break;
								
								case insig_user_register:
									// Unauthenticated users only
									if (authenticated_users.findUserBySocket(dsocket) == null) {

										// 변수 설정
										can = false;

										// 유저 아이디와 비밀번호를 가져온다
										var user_id = json_data.user_id;
										var user_pass = json_data.user_pass;

										var fs = require('fs');
										fs.exists('Accounts/'+user_id+'.txt', function(exists){
											if(exists)
											{
												send_id_message(dsocket, outsig_login_refused, "이미 존재하는 계정입니다.");

											}else{
												// 계정이 존재하지 않는다!
														// ID OK
														
															fs.readFile('System/Nickname_list.txt', 'utf8', function(err, data){
																var split = require('string-split');
																var strArray = split('#', data);
																var each = require('node-each');
																var check = true;

																// 중복되는 닉네임이 있니?
																each.each(strArray, function(el, i){
																	if(el == msg)
																	{
																		check = false;
																	}
																});

																// 체킹
																if(check)
																{
																	// 없으면
																	console.log("New register   :".gray, "ID :".gray, user_id, "| Password :".gray, user_pass, "| Nickname :".gray, msg);
																	fs.writeFile('Accounts/'+user_id+'.txt', user_id + '#' + user_pass + '#' + msg, 'utf8', function(error){});
																	var new_user = User.create(msg, dsocket, user_id, -1, 0);
																	authenticated_users.addUser(new_user);

																	console.log("New user added :".gray, new_user.name, "(" + new_user.uuid + ")");
																	// Tell user to come in
																	var new_user_announcement = JSON.stringify({
																		name: new_user.name,
																		uuid: new_user.uuid,
																		id: new_user.id
																	});

																	send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
																	
																	fs.appendFile('System/Nickname_list.txt', new_user.name + '#', function(err){});
																	process.send({type : 'login', to : 'master', uuid : new_user.uuid, name : new_user.name, id : new_user.id});
																	new_user.mine = 1;
																}else{
																	// 있네
																	send_id_message(dsocket, outsig_login_refused, "이미 사용중인 닉네임 입니다.");
																}
															});

															


														

											}
										});
									}
									break;
								
								
								
								//Processing the user operation
								case insig_user_operation:
									var from_user;
									if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null)
									{
										//from_user.control = msg;
										process.send({type : 'operator', to : 'master', uuid : from_user.uuid, operator : msg});
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
										process.send({type : 'space', to : 'master', uuid : from_user.uuid, space : msg});
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
				//console.log("Removing user   :".data, quitter.name, "(" + quitter.uuid + ")");
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