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

### 서버를 어떻게 실행시키나요?

Windows 에서는 폴더 내의 start.bat를 통해 실행할 수 있습니다<br />
Linux 에서는 다음 명령어로 실행할 수 있습니다 (윈도우 포함)

```
node main.js
```

### 게임메이커에서 어떻게 서버로 값을 전달하나요?

다음 코드처럼 작성하여 전달할 수 있습니다

```
var buffer = buffer_create(1, buffer_grow, 1);<br />
buffer_write(buffer, buffer_u8, NN.signal_ping);<br />
nn_send_message(buffer);
```

NN.signal_ping 과 같은 signal 은 sys_nn 오브젝트의 GAMESTART 이벤트에서 enum 으로 선언합니다