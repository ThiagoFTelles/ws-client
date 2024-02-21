import './style.css'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>
    <span>offline</span>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
