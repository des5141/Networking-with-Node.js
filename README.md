<h1 align="center">Networking with Node.js<br>GM:S 에서 멋진 온라인 게임을 만드는 빠른 방법</h1>
<h3 align="center">보다 쉽고 안정적인 대규모 온라인 게임을 만들 수 있습니다<br />Node.js 와 클러스터링을 통한 환상적인 게임 서버를 만나보세요</h3>

# 이게 무엇인가요?

GM:S에서 보다 쉽고, 안정적인 온라인 게임을 만들 수 있게 만들어주는 네트워크 엔진입니다.

## 어떻게 사용하나요?

먼저, 컴퓨터에 Node.js 설치가 되어있어야 합니다<br />
만약 설치가 되어있지 않다면, 아래 사이트에서 최신버전을 설치하여 주도록 합니다
```
https://nodejs.org/ko/
```
====
### 서버를 어떻게 실행시키나요?

Windows 에서는 폴더 내의 start.bat를 통해 실행할 수 있습니다<br />
Linux 에서는 다음 명령어로 실행할 수 있습니다 (윈도우 포함)

```
node main.js
```
====
### 게임메이커에서 어떻게 서버로 값을 전달하나요?

다음 코드처럼 작성하여 전달할 수 있습니다

```
var buffer = buffer_create(1, buffer_grow, 1);
buffer_write(buffer, buffer_u8, NN.signal_ping);
nn_send_message(buffer);
```

NN.signal_ping 에서 signal 은 sys_nn 오브젝트의 GAMESTART 이벤트에서 enum 으로 선언합니다<br /><br />
buffer_u8 에 대한 정보는 다음 링크를 통해 알 수 있습니다

```
https://docs.yoyogames.com/source/dadiospice/002_reference/buffers/using%20buffers.html
```
====
### Node.js에서 어떻게 클라이언트로 값을 전달하나요?

다음 코드처럼 작성하여 전달할 수 있습니다

```
var buffer = { buffer: Buffer.allocUnsafe(1).fill(0), offset: 0 };
buffer_write(buffer, buffer_u8, signal_ping);
send_raw(dsocket, buffer);
```

게임메이커와 동일한 방식으로 구현하시면 됩니다
====
### 게임메이커에서 받은 값은 어디에 있나요?

obj_network 오브젝트의 Step 이벤트 마지막 코드 블럭을 사용하시면 됩니다
====
### Node.js에서 받은 값은 어디에 있나요?

[Message processing] 주석을 따라가 processing 함수를 열어보시면 됩니다<br />
게임메이커와 받은 값을 읽는 방법은 비슷합니다만, 다음 코드처럼 세번째 인자로 read 가 들어간다는 것이 다릅니다

```
buffer_read(data, buffer_u8, read);
```

이 read는 다음과 같습니다

```
var read = { offset: 0 };
```

## 뭔가 색다른 건 없나요?

- Ctrl+(?) 명령어들로 서버를 효율적으로 관리할 수 있습니다