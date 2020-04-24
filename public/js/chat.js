
var socket = io();
//? Set element
const $messageForm = document.getElementById('message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.getElementById('messages')
//? templates
const messageTemplate = document.getElementById('message-template').innerHTML
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML

//?options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//?send welcome msg when new user arrives
socket.on('message', (message) => {
    console.log(message);
    //? rendering msg to browser with Mustache
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


//? show  online user list 
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, { room, users })
    document.querySelector('#sidebar').innerHTML = html
})



//? =======neglect bad words to send other's===========
//?send msg from input box
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //? don't send the same msg again and again that why we disabled the send button
    $messageFormButton.setAttribute('disabled', 'disabled')

    //?two method to get input box value 
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value 

    socket.emit('sendMessage', message, (error) => {
        //?enable button and also clear the input box when msg is sent
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = '';
        $messageFormInput.focus()
        if (error) {
            return console.log(error);
        }
        console.log('msg delivered!');
    })
})





//? show  online user list 
socket.on('roomData', ({ room, users }) => {
    console.log(room);
    console.log(users);
})


//?==================

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})