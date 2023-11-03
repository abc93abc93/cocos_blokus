const express = require('express');
const cors = require('cors')
const app = express();

const http = require('http').Server(app);

const io = require('socket.io')(http, {
  allowEIO3: true // false by default
});

app.use(cors({
  origin: '*'
}));


http.listen(3000, () => {
  console.log(`server listen on http://localhost/${3000}`);
});


io.on('connect', (socket) => {
  // socket.emit('message', '連接成功！！！');

  socket.on('message', function (data) {
    console.log(data);
  })
})