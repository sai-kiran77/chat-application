const socket = io()

const messageForm = document.querySelector('#message-form')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('#Send')
const loctionButton = document.querySelector('#location')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#send-location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const autoScroll = () => {
    console.log('working');
    
    //new message element
    const newMessage = messages.lastElementChild

    //height of new message
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = messages.offsetHeight

    //height of messages container
    const containerHeight = messages.scrollHeight

    //how far have i scrolled
    const scrollOffset = messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight
    }

}

socket.on('message', (msg) => {
    const html = Mustache.render(messageTemplate, {
        username: msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('kk:mm')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('location-message', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        message: message.url,
        createdAt: moment(message.createdAt).format('kk:mm')
    })
    messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    sidebar.innerHTML = html
})

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    messageFormButton.setAttribute('disabled', 'disabled')

    // const message = document.querySelector('input').value

    let message = e.target.elements.sendMessage.value

    socket.emit('send-message', message, (msg) => {
        messageFormButton.removeAttribute('disabled')
        messageFormInput.value = ''
        messageFormInput.focus()
        console.log(msg);

    })
})

loctionButton.addEventListener('click', () => {
    if (!navigator.geolocation) {

        return alert("your browser dosen't support this feature")


    }

    loctionButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        console.log(location);

        socket.emit('location', location, () => {
            loctionButton.removeAttribute('disabled')
            console.log('location shared');

        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})