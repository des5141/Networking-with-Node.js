var adapter = {
	status : -1,
	socket : null,
	inbox : []
};

function html5_connect(host, port) {
	port = port || 80;
	var socket = io.connect(host + ":" + port, {'force new connection' : true});
	adapter.status = 0;
	socket.on('connect', function() {
		adapter.socket = socket;
		adapter.status = 1;
	});
	socket.on('connect_failed', function() {
		adapter.status = -1;
	});
	socket.on('message', function(data) {
		adapter.inbox.push(data);
	});
	socket.on('disconnect', function() {
		adapter.status = -1;
	});
}

function html5_status() {
	return adapter.status;
}

function html5_send_message(msg) {
	if (adapter.socket != null) {
		adapter.socket.send(msg);
	}
}

function html5_has_message() {
	return (adapter.inbox.length > 0) ? 1 : 0;
}

function html5_get_message() {
	return (adapter.inbox.splice(0, 1))[0] || "";
}

function html5_disconnect() {
	adapter.socket.disconnect();
}