function run()
{
	// Colors
	colors = require('colors');
	colors.setTheme({
		silly:'rainbow',
		input:'grey',
		verbose:'cyan',
		prompt:'grey',
		info:'green',
		data: 'grey',
		help:'cyan',
		warn:'yellow',
		debug: 'blue',
		error: 'red'
	});

	// Show server verion
	console.log(version);
	console.log("");

	//Client-bound signal IDs
	outsig_login_refused = 0;
	outsig_login_accepted = 1;
	outsig_shout_relay = 2;
	outsig_user_leave = 3;
	outsig_user_join = 4;
	outsig_ping =  5;
	outsig_user_position = 6;
	outsig_user_space = 7;

	//Server-bound signal IDs
	insig_login = 0;
	insig_shout = 1;
	insig_ping = 2;
	insig_user_position = 3;
	insig_user_space = 4;
	insig_user_register = 5;

	server = require('./dual_server.js').createServer();
	User = require('./user.js');
	UserBox = require('./user_box.js');
	setTitle = require('console-title');
	setTitle(title);
		
	// Runtime tables
	authenticated_users = UserBox.create();

	//Boot the server
	server.listen(tcp_port, sio_port, ip);

}
module.exports.run = run;