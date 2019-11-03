using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Dpoch.SocketIO;

public class socketManager : MonoBehaviour
{
	void Start()
	{
		Debug.Log("hello world");
		var socket = new SocketIO("ws://localhost:5005/socket.io/?EIO=4&transport=websocket");

		socket.OnOpen += () => socket.Emit("message", "This string will get sent to the server");
		socket.OnConnectFailed += () => Debug.Log("Socket failed to connect!");
		socket.OnClose += () => Debug.Log("Socket closed!");
		socket.OnError += (err) => Debug.Log("Socket Error: " + err);

		socket.Connect();
	}
}
