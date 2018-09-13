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
	var async = require('async');
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
		console.log(" MMORPG SERVER beta version - - - - - - - - - - - - - - - ".inverse);
		console.log(" - master process started".data);
		console.log(" - server ip :".data, Colors.data(ip), ", server port :".data, Colors.data(tcp_port));
		console.log();
		console.log(" HERE TO STARTING DRAWING CONSOLE LOGS  - - - - - - - - - ".inverse);
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
		var how_much_monster = new Array();
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
		var mon02 = Monster.create(1, 2, 1, 4);
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
						//{
						console.log("Login user : ".gray + message.uuid + "(".gray + message.name +")".gray);
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
								console.log("already logined");
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
						
						var tasks = [
						//Loading the inventory
						//Maximum size is 14
						function(callback) {
						var fs = require('fs');
							fs.exists('ClientData/'+new_user.id+'_inventory.txt', function(exists){
								if(exists)
								{
									// Can load
									fs.readFile('ClientData/'+new_user.id+'_inventory.txt', 'utf8', function(err, data){
										var split = require('string-split');
										var strArray = split('#', data);
										new_user.inventory = new Array();
										for(i = 0; i < 14; i++)
										{
											new_user.inventory[i] = parseInt(strArray[i]);
										}
									});
								}else{
									// Can't load. maybe new user.
									var default_inventory_data = "0#0#0#0#0#0#0#0#0#0#0#0#0#0";
									fs.writeFile('ClientData/'+new_user.id+'_inventory.txt', default_inventory_data, 'utf8', function(error){});
									new_user.inventory = new Array();
									for(i = 0; i < 14; i++)
									{
										new_user.inventory[i] = 0;
									}
								}
							});
							callback(null, "");
						}
						,	
						//Loading the status
						function(callback) {
						var fs = require('fs');
						fs.exists('ClientData/'+new_user.id+'_status.txt', function(exists){
							if(exists)
							{
								// Can load
								fs.readFile('ClientData/'+new_user.id+'_status.txt', 'utf8', function(err, data){
									split2 = require('string-split');
									strArray2 = split2('#', data);
									new_user.space = parseInt(strArray2[0]);
									new_user.x = parseInt(strArray2[1]);
									new_user.y = parseInt(strArray2[2]);
									new_user.xscale = parseInt(strArray2[3]);
									new_user.damage = parseInt(strArray2[4]);
									new_user.hp = parseInt(strArray2[5]);
									new_user.maxhp = parseInt(strArray2[6]);
									new_user.exp = parseInt(strArray2[7]);
									new_user.maxexp = parseInt(strArray2[8]);
									new_user.level = parseInt(strArray2[9]);
									new_user.gold = parseInt(strArray2[10]);
									callback(null, "");
								});
							}else{
								// Can't load. maybe new user
								default_user_data = (new_user.space).toString() + "#" + (new_user.x).toString() + "#" + (new_user.y).toString() + "#" + (new_user.xscale).toString() + "#";
								default_user_data += (new_user.damage).toString() + "#" + (new_user.hp).toString() + "#" + (new_user.maxhp).toString() + "#" + (new_user.exp).toString() + "#" + (new_user.maxexp).toString() + "#"
								default_user_data += (new_user.level).toString() + "#" + (new_user.gold).toString() + "#" 
								fs.writeFile('ClientData/'+new_user.id+'_status.txt', default_user_data, 'utf8', function(error){});
								callback(null, "");
							}
						});
						}
						,
						function(callback) {
						for(var id in cluster.workers)
						{
							cluster.workers[id].send({type : 'login', to : 'worker', uuid : message.uuid, name : message.name, id : message.id, space : new_user.space});
						}
						authenticated_users.addUser(new_user);
						callback(null, "");
						}
						];
						
						async.series(tasks, function (err, results) {});
						//}
					break;
					
					case 'quit':
						//{
						console.log("Removing user   :".data, "(" + message.uuid + ")");
						authenticated_users.removeUser(message.uuid);
						for(var id in cluster.workers)
						{
							cluster.workers[id].send({type : 'quit', to : 'worker', uuid : message.uuid});
						}
						//}
					break;
					
					case 'operator':
						//{
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
							{
								user.control = message.operator;
							}
						});
						//}
					break;
					
					case 'space':
						//{
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
						//}
					break;
					
					case 'inventory':
						//{
						switch(message.type2)
						{
							case 'use':
								//{
								authenticated_users.each(function(user) {
									if(user.uuid == message.uuid)
									{
										switch(user.inventory[message.index])
										{
											case 1:
												user.maxhp += 100;
												user.hp = user.maxhp;
												console.log(" MAXHP UP!".inverse);
											break;
											
											case 2:
												user.damage = 100;
												console.log(" WEAPON EQUIPED!".inverse);
											break;
											
											case 3:
												user.hp = 0;
												console.log(" PPAP!".inverse);
											break;
										}
									}
								});
								//}
							break;
							
							case 'drop':
								authenticated_users.each(function(user) {
									if(user.uuid == message.uuid)
									{
										user.inventory[message.index] = 0;
										
										var i;
										for(i = 0; i < 13; i++)
										{
											if((user.inventory[i] == 0)&&(user.inventory[i+1] != 0))
											{
												user.inventory[i] = user.inventory[i+1];
												user.inventory[i+1] = 0;
											}   
										}
									}
								});
							break;
							
							default:
							
							break;
						}
						var fs = require('fs');
						temp_inventory_data = "";
						authenticated_users.each(function(user) {
							if(user.uuid == message.uuid)
							{
								for(i = 0; i < 14; i++)
								{
									temp_inventory_data += (user.inventory[i]).toString() + "#";
								}
							}
						});
						fs.writeFile('ClientData/'+message.id+'_inventory.txt', temp_inventory_data, 'utf8', function(error){});
						//}
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
	//{ Send Object
		function send_obj(who, string, value, space, x, y){
			var json_string = JSON.stringify({
				asset : string,
				value : value,
				x : x,
				y : y
			});
			for(var id in cluster.workers)
			{
				cluster.workers[id].send({type : 'object', to : 'worker', json : json_string, space : space, who : who});
			}
		}
	//}
	
	//{ Server event - step
		! function step() {
			var tasks = [
				//Respawn Monster
				function(callback){
					for(i = 0; i < max_space; i++)
					{
						how_much_monster[i] = 0;
					}
					
					map_monsters.each(function(monster) {
						how_much_monster[monster.space]++;
					});
					
					if(how_much_monster[0] < 1)
					{
						var respawn_x = 3;
						var respawn_y = 3;
						var can = true;
						map_monsters.each(function(monster) {
							if((monster.x == respawn_x)&&(monster.y == respawn_y))
								can = false;
						});
						authenticated_users.each(function(user) {
							if((user.x == respawn_x)&&(user.y == respawn_y))
								can = false;
						});
						if(can)
						{
							var mon00 = Monster.create(1, 0, respawn_x, respawn_y);
							map_monsters.addMonster(mon00);
						}
					}
					callback(null, 'Respawn Monster');
				}
				,
				//Send all
				function(callback){
					player_info = new Array();
					player_max = new Array();
					monster_info = new Array();
					monster_max = new Array();
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
					callback(null, 'Send All');
				}
				,
				//User data processing
				function(callback){
					authenticated_users.each(function(user) {
					if(user.delay <= 0)
					{
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
												
											}else if((monster.space == user.space)&&(monster.x == user.x)&&(user.y-1 == monster.y)){
												can = false;
												monster.hp-=user.damage;
												send_obj(-1, "obj_eff2", user.damage, monster.space, monster.x, monster.y);
												if(monster.hp <= 0)
												{
													send_obj(-1, "obj_eff1", -1, monster.space, monster.x, monster.y);
													map_monsters.removeMonster(monster.uuid);
												}
											}
										});
										if(can)
										{
											doit = false;
											user.y--;
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
												
											}else if((monster.space == user.space)&&(monster.x == user.x)&&(user.y+1 == monster.y)){
												can = false;
												monster.hp-=user.damage;
												send_obj(-1, "obj_eff2", user.damage, monster.space, monster.x, monster.y);
												if(monster.hp <= 0)
												{
													send_obj(-1, "obj_eff1", -1, monster.space, monster.x, monster.y);
													map_monsters.removeMonster(monster.uuid);
												}
											}
										});
										if(can)
										{
											doit = false;
											user.y++;
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
												
											}else if((monster.space == user.space)&&(monster.x == user.x-1)&&(user.y == monster.y)){
												can = false;
												monster.hp-=user.damage;
												user.xscale = -1;
												send_obj(-1, "obj_eff2", user.damage, monster.space, monster.x, monster.y);
												if(monster.hp <= 0)
												{
													send_obj(-1, "obj_eff1", -1, monster.space, monster.x, monster.y);
													map_monsters.removeMonster(monster.uuid);
												}
											}
										});
										if(can)
										{
											doit = false;
											user.x--;
											user.xscale = -1;
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
												
											}else if((monster.space == user.space)&&(monster.x == user.x+1)&&(user.y == monster.y)){
												can = false;
												monster.hp-=user.damage;
												user.xscale = 1;
												send_obj(-1, "obj_eff2", user.damage, monster.space, monster.x, monster.y);
												if(monster.hp <= 0)
												{
													send_obj(-1, "obj_eff1", -1, monster.space, monster.x, monster.y);
													map_monsters.removeMonster(monster.uuid);
												}
											}
										});
										if(can)
										{
											doit = false;
											user.x++;
											user.xscale = 1;
										}
									}
								}
								break;
						}
						user.control = "";
						user.delay = user.delay_time;
					}else{
						user.delay--;
					}
				});
				callback(null, 'User data processing');
				}
				,
				//Monster reset
				function(callback){
					map_monsters.each(function(monster){
						monster.active = 1;
					});
					callback(null, 'Monster reset');
				}
				,
				//Monster data processing
				function(callback){
					map_monsters.each(function(monster){
					if(monster.delay <= 0)
					{
					//Operation about monster step
					authenticated_users.each(function(user) {
						if((monster.active == 1)&&(monster.space == user.space))
						{
							var width = user.x-monster.x;
							var height = user.y-monster.y;
							if(width < 0)
								width *= -1;
							if(height < 0)
								height *= -1;
							if(sqrt(width*2+height*2) < monster.visual)
							{
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
									authenticated_users.each(function(user2) {
										if(((user2.x == monster.x-1)&&(user2.y == monster.y))&&(user2.space == monster.space))
										{
											can = false;
										}
									});
									if(can)
									{
										monster.x--;
										monster.xscale = -1;
										monster.active = 0;
									}
								}else if((monster.x-1 == user.x)&&(monster.y == user.y))
								{
									send_obj(user.uuid, "obj_shake", 20, user.space, 0, 0);
									send_obj(-1, "obj_eff2",  monster.damage, user.space, user.x, user.y);
									user.hp -= monster.damage;
									monster.xscale = -1;
									monster.active = 0;
								}else
								if((monster.x < user.x)&&((((monster.x+1 != user.x)&&(monster.y == user.y))||((monster.y != user.y)))&&(array[monster.space][monster.y][monster.x+1] == 1)))
								{
									can = true;
									map_monsters.each(function(monster2){
										if(((monster2.x == monster.x+1)&&(monster2.y == monster.y))&&(monster.space == monster2.space))
										{
											can = false;
										}
									});
									authenticated_users.each(function(user2) {
										if(((user2.x == monster.x+1)&&(user2.y == monster.y))&&(user2.space == monster.space))
										{
											can = false;
										}
									});
									if(can)
									{
										monster.x++;
										monster.xscale = 1;
										monster.active = 0;
									}
								}else if((monster.x+1 == user.x)&&(monster.y == user.y))
								{
									send_obj(user.uuid, "obj_shake", 20, user.space, 0, 0);
									send_obj(-1, "obj_eff2", monster.damage, user.space, user.x, user.y);
									user.hp -= monster.damage;
									monster.xscale = 1;
									monster.active = 0;
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
									authenticated_users.each(function(user2) {
										if(((user2.x == monster.x)&&(user2.y == monster.y-1))&&(user2.space == monster.space))
										{
											can = false;
										}
									});
									if(can)
									{
										monster.y--;
										monster.active = 0;
									}
								}else if((monster.x == user.x)&&(monster.y-1 == user.y))
								{
									send_obj(user.uuid, "obj_shake", 20, user.space, 0, 0);
									send_obj(-1, "obj_eff2",  monster.damage, user.space, user.x, user.y);
									user.hp -= monster.damage;
									monster.active = 0;
								}else
								if((monster.y < user.y)&&((((monster.y+1 != user.y)&&(monster.x == user.x))||((monster.x != user.x)))&&(array[monster.space][monster.y+1][monster.x] == 1))){
									can = true;
									map_monsters.each(function(monster2){
										if(((monster2.y == monster.y+1)&&(monster2.y == monster.y))&&(monster.space == monster2.space))
										{
											can = false;
										}
									});
									authenticated_users.each(function(user2) {
										if(((user2.x == monster.x)&&(user2.y == monster.y+1))&&(user2.space == monster.space))
										{
											can = false;
										}
									});
									if(can)
									{
										monster.y++;
										monster.active = 0;
									}
								}else if((monster.x == user.x)&&(monster.y+1 == user.y))
								{
									send_obj(user.uuid, "obj_shake", 20, user.space, 0, 0);
									send_obj(-1, "obj_eff2",  monster.damage, user.space, user.x, user.y);
									user.hp -= monster.damage;
									monster.active = 0;
								}
							}
						}
						
					});
					//monster.delay = monster.delay_time;
					}//else{monster.delay--;}
				});
					callback(null, 'Monster data processing');
				}
				,
				//Monster automatic moving
				function(callback){
					map_monsters.each(function(monster){
					if(monster.delay <= 0)
					{
					if(monster.active == 1)
					{
						try{
							if(array != false)
							{
								while(1)
								{
									var doing = getRandomInt(0, 7);
									switch(doing)
									{
										case 0:
											map_monsters.each(function(monster2){
												if((monster2.x == monster.x-1)&&(monster2.y == monster.y)&&(monster2.space == monster.space))
													monster.active = 0;
											});
											authenticated_users.each(function(user3) {
												if((user3.x == monster.x-1)&&(user3.y == monster.y)&&(user3.space == monster.space))
													monster.active = 0;
											});
											if(monster.x-1 < 0)
												monster.active = 0;
											
											if(monster.x-1 >= 0)
											{
												if(array[monster.space][monster.y][monster.x-1] != 1)
													monster.active = 0;
											}
												
											if(monster.active == 1)
											{
												monster.x = monster.x - 1;
												monster.xscale = -1;
											}
										break;
											
										case 1:
											map_monsters.each(function(monster2){
												if((monster2.x == monster.x+1)&&(monster2.y == monster.y)&&(monster2.space == monster.space))
													monster.active = 0;
											});
											authenticated_users.each(function(user3) {
												if((user3.x == monster.x+1)&&(user3.y == monster.y)&&(user3.space == monster.space))
													monster.active = 0;
											});
											if(monster.x+1 >= array_width)
												monster.active = 0;
											
											if(monster.x+1 < array_width)
											{
												if(array[monster.space][monster.y][monster.x+1] != 1)
													monster.active = 0;
											}
											if(monster.active == 1)
											{
												monster.x = monster.x + 1;
												monster.xscale = 1;
											}
										break;
											
										case 2:
											map_monsters.each(function(monster2){
												if((monster2.x == monster.x)&&(monster2.y == monster.y-1)&&(monster2.space == monster.space))
													monster.active = 0;
											});
											authenticated_users.each(function(user3) {
												if((user3.x == monster.x)&&(user3.y == monster.y-1)&&(user3.space == monster.space))
													monster.active = 0;
											});
											if(monster.y-1 < 0)
												monster.active = 0;
											
												
											if(monster.y-1 >= 0)
											{
												if(array[monster.space][monster.y-1][monster.x] != 1)
													monster.active = 0;
											}
												
											if(monster.active == 1)
												monster.y = monster.y - 1;
										break;
											
										case 3:
											map_monsters.each(function(monster2){
												if((monster2.x == monster.x)&&(monster2.y == monster.y+1)&&(monster2.space == monster.space))
													monster.active = 0;
											});
											authenticated_users.each(function(user3) {
												if((user3.x == monster.x)&&(user3.y == monster.y+1)&&(user3.space == monster.space))
													monster.active = 0;
											});
											if(monster.y+1 >= array_height)
												monster.active = 0;
												
											if(monster.y+1 < array_height)
											{
												if(array[monster.space][monster.y+1][monster.x] != 1)
													monster.active = 0;
											}
											if(monster.active == 1)
												monster.y = monster.y + 1;
										break;
									}
									
									if(monster.active == 1)
										break;
									else
										monster.active = 1;
								}
							}
						}catch(e){}
					}
					monster.delay = monster.delay_time;
					}else{monster.delay--;}
				});
					callback(null, 'Monster automatic moving');
				}
				,
				//If user died
				function(callback){
					authenticated_users.each(function(user) {
					if(user.hp <= 0)
					{
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
						user.hp = user.maxhp;
					}
				});
				callback(null, 'If player died');
				}
				,
				//If monster died
				function(callback){
					map_monsters.each(function(monster) {
						if(monster.hp <= 0)
							map_monsters.removeMonster(monster.uuid);
					});
					callback(null, 'If monster died');
				}
				,
				//Export the monster data in packet
				function(callback){
					map_monsters.each(function(monster){
					//Export the monsters states in packet
					var x = monster.x;
					var y = monster.y;
					var type = monster.type;
					var xscale = monster.xscale;
					monster_info[monster.space] += type.toString() + "#" + x.toString() + "#" + y.toString() + "#" + xscale.toString() + "#";
					monster_max[monster.space]++;
				});
				callback(null, 'Export the monster data in packet');
				}
				,
				//User data in line with
				function(callback){
					authenticated_users.each(function(user) {
						//Save the users state in packet
						var x = user.x;
						var y = user.y;
						var xscale = user.xscale;
						player_info[user.space] += user.name + "#" + x.toString() + "#" + y.toString() + "#" + xscale.toString() + "#";
						player_max[user.space]++;
					});
					callback(null, 'User data in line with');
				}
				,
				//Export the user data in packet
				function(callback){
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
						
						var inventory_send = "";
						for(i = 0; i < 14; i++)
						{
							j = user.inventory[i];
							inventory_send += j.toString()+"#";
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
							user_y : user.y,
							user_hp : user.hp,
							user_maxhp : user.maxhp,
							user_name : user.name,
							user_inventory : inventory_send,
							user_gold : user.gold,
							user_level : user.level
						});
						//console.log(user_map);
						//send_id_message(user.socket, outsig_user_map, json_string);
						
						for(var id in cluster.workers)
						{
							cluster.workers[id].send({type : 'map', to : 'worker', json : json_string, uuid : user.uuid});
						}
					});
						callback(null, 'Export the user data in packet');
				}
				,
				//User status save
				function(callback){
					// Can't load. maybe new user
					authenticated_users.each(function(user) {
						temp_user_data = (user.space).toString() + "#" + (user.x).toString() + "#" + (user.y).toString() + "#" + (user.xscale).toString() + "#";
						temp_user_data += (user.damage).toString() + "#" + (user.hp).toString() + "#" + (user.maxhp).toString() + "#" + (user.exp).toString() + "#" + (user.maxexp).toString() + "#"
						temp_user_data += (user.level).toString() + "#" + (user.gold).toString() + "#" 
						fs.writeFile('ClientData/'+user.id+'_status.txt', temp_user_data, 'utf8', function(error){});
					});
					callback(null, 'User staus saved');
				}
				,
				//While
				function(callback){
				setTimeout(function() {
				step();
			}, 100);
			callback(null, 'return');
			}
			];
			
			async.series(tasks, function (err, results) {
				//console.log("Master process working order - - - - - - - - - - - -".inverse);
				//console.log(Colors.gray(results));
			});
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
								user.space = message.space;
							}
						});
						
						if(check == 1)
						{
							var new_user = User.create(message.name, -1, message.id, message.uuid, message.space);
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
					
					case 'object':
						if(message.who == -1)
						{
							authenticated_users.each(function(user) {
								if((user.space == message.space)&&(user.socket != -1))
								{
									send_id_message(user.socket, outsig_send_obj, message.json);
								}
							});
						}else{
							authenticated_users.each(function(user) {
								if((user.socket != -1)&&(user.uuid == message.who))
								{
									send_id_message(user.socket, outsig_send_obj, message.json);
								}
							});

						}
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
		const outsig_send_obj = 8;

		//Server-bound signal IDs
		const insig_login = 0;
		const insig_ping = 1;
		const insig_user_position = 2;
		const insig_user_space = 3;
		const insig_user_operation = 4;
		const insig_user_register = 5;
		const insig_user_inventory = 6;
		
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
		try{
		sock.send("㏆" + json_string.length + "®" + json_string);
		}catch(e){}
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
										from_user.space = msg;
									}
								break;
								
								case insig_user_inventory:
									var from_user;
									type = json_data.type;
									if ((from_user = authenticated_users.findUserBySocket(dsocket)) != null) {
										process.send({type : 'inventory', to : 'master', uuid : from_user.uuid, type2 : type, index : msg, id : from_user.id});
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