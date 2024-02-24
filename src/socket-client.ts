import { Manager, Socket } from 'socket.io-client'

export const connetToServer = () => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js')
    const socket = manager.socket('/')
    addListeners( socket )
}

const addListeners = ( socket: Socket ) => {
    const clientsList = document.querySelector<HTMLUListElement>('#clients-list')!
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!
    const messagesList = document.querySelector<HTMLUListElement>('#messages-list')!
    const serverStatusLabel = document.querySelector<HTMLSpanElement>('#server-status')!

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected'
    })
    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected'
    })
    socket.on('clients-updated', ( clients: string[] ) => {
        let clientsHtml = ''
        clients.forEach( clientId => {
            clientsHtml += `
                <li>${ clientId }</li>
            `
        })
        clientsList.innerHTML = clientsHtml
    })

    messageForm.addEventListener('submit', ( event ) => {
        event.preventDefault()
        if( messageInput.value.trim().length <= 0 ) return
        socket.emit('message-from-client', {
            id:'Eu!',
            message:messageInput.value
        })
        messageInput.value = ''
    })

    socket.on('message-from-server', ( payload: { userName: string, message: string } ) => {
        const newMessage = `
            <strong>${ payload.userName }</strong>
            <span>${ payload.message }</span>
        `
        const li = document.createElement('li')
        li.innerHTML = newMessage
        messagesList.append( li )
    })
}