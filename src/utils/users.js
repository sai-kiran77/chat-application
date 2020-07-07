const users = []

const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'username and room should be provided'
        }
    }
    
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: 'username already exists! Try another'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }

    return {}
}

const getUser = (id) => {
    const userData = users.find((user) => {        
        return user.id === id
    })
    
    return { userData }
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const usersInRoom = users.filter((user) => {
        return user.room === room
    })
    
    return  usersInRoom 
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}