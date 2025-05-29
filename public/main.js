const socket = io("http://localhost:3000")

const clientsTotal = document.getElementById('clients-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('connectedUsers', (data) => {
    clientsTotal.innerText = `Total connected users: ${data}`
})

function sendMessage() {
    if (!messageInput.value.trim()) return
    const message = {
        name: nameInput.value,
        text: messageInput.value,
        dateTime: new Date().toLocaleString()
    }

    socket.emit('sendMessage', message)

    appendMessage(true, message)
    messageInput.value = ''
}

socket.on('message', (message) => {
    appendMessage(false, message)
})

function appendMessage(isOwnMessage, message) {
    const messageElement = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <div class="message-bubble">
            <span class="message-name">${message.name}</span>
            <p class="message-text">
            ${message.text}
            </p>
            <span class="message-time">${moment(message.dateTime).fromNow()}</span>
        </div>
    </li>`

    messageContainer.innerHTML += messageElement
    scrollToBottom()
}

function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('typing', { feedback: `${nameInput.value} is typing...` })
})
messageInput.addEventListener('keypress', (e) => {
    socket.emit('typing', { feedback: `${nameInput.value} is typing...` })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('typing', { feedback: '' })
})

socket.on('typing', (data) => {
    const typingFeedback = document.getElementById('typing-feedback')
    if (data.feedback) {
        typingFeedback.innerText = data.feedback
    } else {
        typingFeedback.innerText = ''
    }
})