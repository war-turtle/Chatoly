module.exports = function(io, Users) {
  let usersList = new Users();

  io.on('connection', socket => {
    console.log('connected to client');

    socket.on('join', (params, callback) => {
      socket.join(params.room);

      usersList.AddUser(socket.id, params.name, params.room);

      io.to(params.room).emit('userList', usersList.GetUsers(params.room));

      callback();
    });

    socket.on('createMessage', (message, callback) => {
      io.to(message.room).emit('newMessage', {
        text: message.text,
        room: message.room,
        sender: message.sender
      });

      callback();
    });

    socket.on('disconnect', () => {
      let user = usersList.RemoveUser(socket.id);
      if (user) {
        io.to(user.room).emit('userList', usersList.GetUsers(user.room));
      }
    });
  });
};
