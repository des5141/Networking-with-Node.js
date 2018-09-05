function Socket(socket) {
	function onMessage(f) {
		socket.on('data', function(data) {
			f(data);
		})
	}
	
	function onClose(f) {
		socket.on('close', f);
		socket.on('error', function (err) {
			socket.destroy();
		});
	}
	
	function send(data) {
		socket.write(data);
	}

	return {
		socket : socket,
		onMessage : onMessage,
		onClose : onClose,
		send : send
	};
}
function createServer() {
	//Setup basic TCP server functionality
	var tcp_server = require('net').createServer();
	tcp_server.on('listening', function() {
		var address = tcp_server.address();
		//console.log("TCP Server Started -".gray + address.address + "," + address.port + "process".gray + process.pid);
	});
	tcp_server.on('error', function(err) {
		console.log("TCP Server crashed! Error message :".red, err.message);
	});
	tcp_server.on('connection', function(s) {
		
	});
	
	
	//Listen
	function listen(tcp_port, ip) {
		if (tcp_port != null) {
			tcp_server.listen(tcp_port, ip);
		}
	}
	
	//On Connection
	function onConnection(f) {
		tcp_server.on('connection', function(s) {
			f(new Socket(s));
		});
	}
	
	return {
		tcp_server : tcp_server,
		listen : listen,
		onConnection : onConnection
	};
}

module.exports.createServer = createServer;