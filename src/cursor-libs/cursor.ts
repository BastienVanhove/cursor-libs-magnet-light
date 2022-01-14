const body = document.querySelector("body") as HTMLBodyElement
const styleColor = "purple"

class Cursor{
    private init: Function;
    private cursorEl: HTMLDivElement;
    private body: HTMLBodyElement;
    public color: string;
    private height: number;
    private width: number;

    private movement: Function;
    private squareMode: Function;
    //private simpleHoverMode: Function;
    //private magnetMode: Function;
    //private lightMode: Function;
    //private copyColorMode: Function;
    //private copyBackgroundMode: Function;

    constructor(body: HTMLBodyElement, baseColor: string, enabledCursor: boolean = true){
        this.body = body
        this.color = baseColor
        this.cursorEl = document.createElement('div') as HTMLDivElement

        this.height = 30
        this.width = 30

        this.squareMode = () =>{
            let style : any = this.cursorEl.style
            style.height = `${this.height}px`;
            style.width = `${this.width}px`;
            style.border = `5px solid ${this.color}`
        }

        this.movement = () =>{
            window.addEventListener("mousemove",(e)=>{
                let x : number = e.clientX
                let y : number = e.clientY
                this.cursorEl.style.left = `${x - (this.width / 2)}px`
                this.cursorEl.style.top = `${y - (this.height / 2)}px`
            })
        }

        this.init = () => {
            if(!enabledCursor) this.body.style.cursor = 'none'
            this.cursorEl.style.position = 'absolute'
            this.squareMode()
            this.movement()
            /*code here*/
            this.body.appendChild(this.cursorEl)
        }

        this.init()

    }
}
const cursorTest = new Cursor(body, styleColor, false)