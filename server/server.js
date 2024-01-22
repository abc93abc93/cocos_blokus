const express = require("express");
const cors = require("cors");
const app = express();

const http = require("http").Server(app);

const io = require("socket.io")(http, {
	allowEIO3: true,
	cors: {
		origin: "http://localhost:7456", // 允许的源
		methods: ["GET", "POST"], // 允许的HTTP方法
		credentials: true,
	},
});

app.use(cors());

http.listen(3000, () => {
	console.log(`server listen on http://localhost:${3000}`);
});

io.on("connect", (socket) => {
	socket.emit("message", "連接成功！！！");

	socket.on("message", function (data) {
		console.log(data);
	});
});
