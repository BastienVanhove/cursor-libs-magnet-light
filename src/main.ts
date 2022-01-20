import './style.css'
import '../assets/cursor-libs/cursor'

const counterP = document.querySelector('.counter>p') as HTMLElement
const counter = document.querySelector('.counter') as HTMLDivElement

counter.addEventListener('click', ()=>{
    let value = parseInt(counterP.innerHTML)
    value++
    counterP.innerHTML = String(value)
})
