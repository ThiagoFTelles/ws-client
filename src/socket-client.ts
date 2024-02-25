import { Manager, Socket } from 'socket.io-client'

let socket: Socket

export const connetToServer = ( token: string ) => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token,
        }
    })
    socket?.removeAllListeners()
    socket = manager.socket('/')
    addListeners()
}

const addListeners = () => {
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