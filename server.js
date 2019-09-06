require('dotenv').config();

// Let's go ahead and instantiate a server
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

http.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});

io.on('connection', socket => {
  const history = {
    text: '',
  };

  console.log(`Connection made`);

  // Revealing a section
  socket.on('section:reveal', data => {
    console.log(data);
    io.emit('section:reveal', JSON.stringify(data));
  });

  // Hiding a section
  socket.on('section:hide', data => {
    console.log(data);
    io.emit('section:hide', JSON.stringify(data));
  });

  socket.on('header:update', blob => {
    console.log('Header update');
    io.emit('header:update', blob);
  });

  // Updating client side text
  socket.on('text:update', text => {
    console.log(
      `Text update: difference  of ${Math.abs(
        history.text.length - text.length
      )}`
    );

    history.text = text;

    io.emit('text:update', text);
  });
});
