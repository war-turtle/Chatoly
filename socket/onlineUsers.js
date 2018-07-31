class Users {
  constructor() {
    this.users = [];
  }

  AddUser(id, name, room) {
    let users = { id, room, name };
    this.users.push(users);
    return users;
  }

  RemoveUser(id) {
    let removedUser = this.GetUser(id);
    if (removedUser) {
      this.users = this.users.filter(user => user.id !== id);
    }
    return removedUser;
  }

  GetUser(id) {
    let getUser = this.users.filter(user => user.id === id)[0];
    return getUser;
  }

  GetUsers(room) {
    let users = this.users.filter(user => user.room === room);

    let userName = users.map(user => user.name);

    return userName;
  }
}

module.exports = { Users };
