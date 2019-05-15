/**
Client-side GMS.IO HTML5 bindings for GameMaker Studio.
Author: Dickson Law
(C) GameGeisha Interactive, 2010-2014
*/

var ___gmsio_adapter___ = {
	status : -1,
	socket : null,
	inbox : []
};

function __gmsio_html5_connect__(host, port) {
	port = port || 80;
	var socket = io.connect(host + ":" + port, {'force new connection' : true});
	___gmsio_adapter___.status = 0;
	socket.on('connect', function() {
		___gmsio_adapter___.socket = socket;
		___gmsio_adapter___.status = 1;
	});
	socket.on('connect_failed', function() {
		___gmsio_adapter___.status = -1;
	});
	socket.on('message', function(data) {
		___gmsio_adapter___.inbox.push(data);
	});
	socket.on('disconnect', function() {
		___gmsio_adapter___.status = -1;
	});
}

function __gmsio_html5_status__() {
	return ___gmsio_adapter___.status;
}

function __gmsio_html5_send_message__(msg) {
	if (___gmsio_adapter___.socket != null) {
		___gmsio_adapter___.socket.send(msg);
	}
}

function __gmsio_html5_has_message__() {
	return (___gmsio_adapter___.inbox.length > 0) ? 1 : 0;
}

function __gmsio_html5_get_message__() {
	return (___gmsio_adapter___.inbox.splice(0, 1))[0] || "";
}

function __gmsio_html5_disconnect__() {
	___gmsio_adapter___.socket.disconnect();
}