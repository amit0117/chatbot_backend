let users = [];


// Join user to chat
const addUser = ({id, username, room }) => {
    // checking for an existing user 
  const user = { id, username, room };
  users.push(user);
  return  user ;
};


// Get current user
const getCurrentUser=(id)=>{
  return users.find(user=>user.id===id);
}

// User Leave Chat
const userLeave = (id) => {
  const index = users.findIndex((currentUser) => currentUser.id === id);
  if (index !== -1) {
  return users.splice(index,1)[0]
  } else {
    console.log("NO user found");
  }
};

// Get room users
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}


module.exports = { addUser, userLeave, getCurrentUser, getRoomUsers };
