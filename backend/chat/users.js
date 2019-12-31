const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  // room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Username and room are required.' };
  if(existingUser){
    const index = users.findIndex((user) => user.name === name);
    users[index].id = id
    
      return { user : users[index] };
    }

  const user = { id, name, room };

  users.push(user);

  return { user };
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => {
  var x = users.find((user) => user.id === id)
  console.log(x);
  return x;
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };