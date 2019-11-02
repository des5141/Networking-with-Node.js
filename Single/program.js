/*
	ProjectName : (Client) GM:S <-> Node.js (Server)
*/

// Server setting
tcp_port = 5833;
sio_port = 5883;
ip = '127.0.0.1';
version = "본격 GM:S 와 Node.js 를 이용한 네트워킹";
title = "자본주의 Node.js 서버";

// Server Run
require('./classes/yuto_server_v1.js').run();

// Send Methods
function send_id_message(sock, id, msg) {
	sock.send(JSON.stringify({
		id: id,
		msg: msg
	}) + "®");
}

// Running
server.onConnection(function(dsocket) {
	dsocket.onMessage(function(data) {
		try {
			var gc=require("js-gc");
			gc();
			// Parse incoming JSON
			var json_data = JSON.parse(data);
			var id = json_data.id;
			var msg = json_data.msg;
			
			switch (id) {

				case insig_login:
					// Unauthenticated users only
					if (authenticated_users.findUserBySocket(dsocket) == null) {

						// 변수 설정
						can = false;

						// 유저 아이디와 비밀번호를 가져온다
						user_id = json_data.user_id;
						user_pass = json_data.user_pass;

						var fs = require('fs');
						fs.exists('Accounts/'+user_id+'.txt', function(exists){
							if(exists)
							{
								// 계정이 존재한다!
								var split = require('string-split');
								fs.readFile('Accounts/'+user_id+'.txt', 'utf8', function(err, data){
									var strArray = split('\n', data);
									if(user_pass == strArray[1])
									{
										// 로그인 성공
										//Name already taken
										if (authenticated_users.findUserById(strArray[0]) != null) {
											send_id_message(dsocket, outsig_login_refused, "이미 접속중인 계정입니다.");
											//console.log("이미 접속되어 있는 계정입니다.");
										}

										// Name OK
										else {
											var new_user = User.create(strArray[2], dsocket, strArray[0]);
											authenticated_users.addUser(new_user);
											console.log("New user added :".gray, new_user.name, "(" + new_user.uuid + ")");
											// Tell user to come in
											var new_user_announcement = JSON.stringify({
												name: new_user.name,
												uuid: new_user.uuid,
												id: new_user.id
											});
											send_id_message(dsocket, outsig_login_accepted, new_user_announcement);
											//Announce to other users
											authenticated_users.each(function(user) {
												if (user.uuid != new_user.uuid) {
													send_id_message(user.socket, outsig_user_join, new_user_announcement);
												}
											});
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
												var strArray = split('\n', data);
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
													fs.writeFile('Accounts/'+user_id+'.txt', user_id + '\n' + user_pass + '\n' + msg, 'utf8', function(error){});
													var new_user = User.create(msg, dsocket, user_id);
													authenticated_users.addUser(new_user);

													console.log("New user added :".gray, new_user.name, "(" + new_user.uuid + ")");
													// Tell user to come in
													var new_user_announcement = JSON.stringify({
														name: new_user.name,
														uuid: new_user.uuid,
														id: new_user.id
													});

													send_id_message(dsocket, outsig_login_accepted, new_user_announcement);

													//Announce to other users
													authenticated_users.each(function(user) {
														if (user.uuid != new_user.uuid) {
															send_id_message(user.socket, outsig_user_join, new_user_announcement);
														}
													});

													fs.appendFile('System/Nickname_list.txt', new_user.name + '\n', function(err){

													});
												}else{
													// 있네
													send_id_message(dsocket, outsig_login_refused, "이미 사용중인 닉네임 입니다.");
												}
											});

											


										

							}
						});
					}
					break;
				
				case insig_shout:
					//Authenticated users only
					var from_user;
					if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {
						var user_name = json_data.name;
						//Relay it to everyone else
						var messages = JSON.stringify({
							from: from_user.name,
							msg: msg,
							name: user_name
						});

						if(user_name == "none")
						{
							console.log("(Space chat)".gray, from_user.name, ":", msg);
							authenticated_users.each(function(user) {
								if ((user.uuid != from_user.uuid) && (user.space == from_user.space)) {
									send_id_message(user.socket, outsig_shout_relay, messages);
								}
							});
						}else if(user_name == "all")
						{
							console.log("(All chat)".gray, from_user.name, ":", msg);
							authenticated_users.each(function(user) {
								if (user.uuid != from_user.uuid) {
									send_id_message(user.socket, outsig_shout_relay, messages);
								}
							});
						}else{
							console.log("(Whisper chat)".gray, from_user.name, "is to".gray, user_name, ":".gray, msg);
							authenticated_users.each(function(user) {
								if ((user.uuid != from_user.uuid) && (user.name == user_name)) {
									send_id_message(user.socket, outsig_shout_relay, messages);
								}
							});
						}
						
					}
					break;

				case insig_ping:
						send_id_message(dsocket, outsig_ping, msg);
					break;

				case insig_user_position:
					var from_user;
					if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {

						// 유저 정보를 받아온다! 클라이언트로부터
						user_uuid = json_data.user_uuid;
						user_x = json_data.user_x;
						user_y = json_data.user_y;
						user_name = json_data.user_name;

						var user_position = JSON.stringify({
							uuid: user_uuid,
							x: user_x,
							y: user_y,
							name: user_name
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
					var temp;
					if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {
						var space_moving = JSON.stringify({
							uuid: from_user.uuid,
							space: msg
						});

						authenticated_users.each(function(user) {
							if (user.space == from_user.space){
								send_id_message(user.socket, outsig_user_space, space_moving);
							}
						});

						temp = from_user.space;
						from_user.space = msg;
						console.log("Space move     :".gray, from_user.name, "is move space".gray, temp, "to".gray, from_user.space, "(" + from_user.uuid + ")");
					}
					break;
				
				default:
					console.log("알 수 없는 메세지 타입입니다".error);
					break;
			}
		}

		// Error get!
		catch (e) {
			//console.log("메세지를 처리하는 도중, 에러가 발생하였습니다".error, e);
		}
	});
	
	dsocket.onClose(function() {
		var quitter;
		if ((quitter = authenticated_users.findUserBySocket(dsocket)) != null) {
			console.log("User removing  :".gray, quitter.name, "(" + quitter.uuid + ")");

			//Let everyone else know the user is leaving
			var logout_announcement = JSON.stringify({
				name: quitter.name,
				uuid: quitter.uuid
			});
			authenticated_users.each(function(user) {
				if (user.uuid != quitter.uuid) {
					_msg = logout_announcement;
					send_id_message(user.socket, outsig_user_leave, logout_announcement);
				}
			});
			authenticated_users.removeUser(quitter.uuid);
		}
	});
});