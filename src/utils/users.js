const users = [ ]

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()


    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}





//? test add user 
//?=========
// addUser({
//     id:11,
//     username:'Naveen',
//     room:'Family chat Group'
// })
// console.log(users);

//?==========
// const result = addUser({
//     id:33,
//     username:'vishal',
//     room:'friends'
// })
// console.log(result);

//?===========
// const result1 = addUser({
//     id:33,
//     username:'sachin',
//     room:'Family chat Group'
// })
// console.log(result1);

// console.log(users);

// const removeUser = removeUser(11)
// console.log(removeUser);

// console.log(users);

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
} 

const getUser = (id) => {
    return users.find((user) => user.id === id)
}
//?=========
// const user = getUser(33)
// console.log(user);

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}
// const onlineUser = getUsersInRoom('friends')
// console.log(JSON.stringify(onlineUser)+'======>');

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

//?===========
