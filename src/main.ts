import './style.css'
import '../assets/cursor-libs/cursor'

const counterP = document.querySelector('.counter>p') as HTMLElement
const counter = document.querySelector('.counter') as HTMLDivElement

counter.addEventListener('click', ()=>{
    let value = parseInt(counterP.innerHTML)
    value++
    counterP.innerHTML = String(value)
})

const burger = document.querySelector('.burger') as HTMLDivElement
const bar1 = document.querySelector('.bar1') as HTMLDivElement
const bar2 = document.querySelector('.bar2') as HTMLDivElement
const bar3 = document.querySelector('.bar3') as HTMLDivElement
const menuBurger = document.querySelector('.menu-burger') as HTMLDivElement
let burgerToggle = true
burger.addEventListener('click', ()=>{
    if(burgerToggle){
        bar1.style.transform = "rotate(45deg) translate(5px, 10px)"
        bar2.style.opacity = "0"
        bar3.style.transform = "rotate(-45deg) translate(5px, -10px)"
        menuBurger.style.transform = "translateX(0px)"
        burgerToggle = false
    }else{
        bar1.style.transform = "rotate(0) translateY(0px)"
        bar2.style.opacity = "1"
        bar3.style.transform = "rotate(0) translateY(0px)"
        menuBurger.style.transform = "translateX(250px)"
        burgerToggle = true
    }
    console.log('clikc')
})
