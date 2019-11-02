/**
A simple relay server class powered by TCP and Socket.IO.
Author: Dickson Law
(C) GameGeisha Interactive, 2010-2014
*/

function DualSocket(socket, is_tcp) {
	function onMessage(f) {
		
		if (is_tcp) {
			socket.on('data', function(data) {
				f(data);
			});
		}
		else {
			socket.on('message', function(data) {
				f(data);
			});
		}
	}
	
	function onClose(f) {
		
		if (is_tcp) {
			socket.on('close', f);
			socket.on('error', function (err) {
				socket.destroy();
			});
		}
		else {
			socket.on('disconnect', f);
			socket.on('error', function (err) {
				socket.destroy();
			});
		}
	}
	
	function send(data) {
		
		if (is_tcp) {
			var success = socket.write(data);
			if(!success)
				console.log("ark!");
		}
		else {
			socket.send(data);
		}
	}

	return {
		socket : socket,
		is_tcp : is_tcp,
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

		var text = address.address + ":" + address.port;
		console.log("TCP       server listening at".gray, text);
	});

	tcp_server.on('error', function(err) {
		console.log("TCP       server에 에러가 발견됨 :".error, err.message);
	});

	tcp_server.on('connection', function(s) {
		
	});
	
	//Setup basic Socket.IO server functionality
	var sio_proxy = require('http').createServer();
	var sio_server = require('socket.io').listen(sio_proxy);
	sio_proxy.on('error', function(err) {
		console.log("Socket.IO server에 에러가 발견됨 :".error, err.message);
	});
	sio_proxy.on('close', function() {
		console.log("Socket.IO server shut down successfully");
	});
	
	//Listen
	function listen(tcp_port, sio_port, ip) {
		try{
		if (tcp_port != null) {
			tcp_server.listen(tcp_port, ip);
			tcp_server.on('error', function(err) {
				console.log("tcp server에 에러가 발견됨 :".error, err.message);
			});
		}
		if (sio_port != null) {
			sio_proxy.listen(sio_port, ip);
			sio_proxy.on('error', function(err) {
				console.log("Socket.IO server에 에러가 발견됨 :".error, err.message);
			});

			var text = ip + ":" + sio_port;
			console.log("Socket.IO server listening at".gray, text);
		}}catch(e){console.log("error");}
	}
	
	//On Connection
	function onConnection(f) {
		tcp_server.on('connection', function(s) {
			f(new DualSocket(s, true));
			console.log("Client connect :".gray, s.remoteAddress);
		});

		tcp_server.on('error', function(err) {
				console.log("tcp server에 에러가 발견됨 :".error, err.message);
			});
		sio_server.sockets.on('connection', function(s) {
			f(new DualSocket(s, false));
		});
		sio_server.sockets.on('error', function(err) {
				console.log("Socket.IO server에 에러가 발견됨 :".error, err.message);
		})
	}
	
	return {
		tcp_server : tcp_server,
		sio_server : sio_server,
		listen : listen,
		onConnection : onConnection
	};
}

module.exports.createServer = createServer;