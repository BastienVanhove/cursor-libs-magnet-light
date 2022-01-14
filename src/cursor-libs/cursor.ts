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
    private lastCoor : [number, number];
    private transitionDuration: number;

    private allMagnet: HTMLElement[];
    private magnetMode: [Function, Function] | null;

    //private simpleHoverMode: Function;
    //private magnetMode: Function;
    //private lightMode: Function;
    //private copyColorMode: Function;
    //private copyBackgroundMode: Function;
    //private lsdMode: Function; multicolor mode quoi
    //private imageHoverMode; zoom in cursor of image hover

    constructor(body: HTMLBodyElement, baseColor: string, enabledCursor: boolean = true, tickReduction: boolean = false){
        this.body = body
        this.color = baseColor
        this.cursorEl = document.createElement('div') as HTMLDivElement

        this.height = 30
        this.width = 30

        this.transitionDuration = 50

        this.squareMode = () =>{
            let style : any = this.cursorEl.style
            style.height = `${this.height}px`;
            style.width = `${this.width}px`;
            style.borderRadius = '5px'
            style.border = `6px solid ${this.color}`
        }

        this.lastCoor = [0, 0]
        this.movement = () =>{
            window.addEventListener("mousemove",(e)=>{
                const x : number = e.clientX
                const y : number = e.clientY
                const distance : number = Math.abs(this.lastCoor[0] - x) + Math.abs(this.lastCoor[1] - y)
                if(tickReduction){
                    if(distance > (this.height + this.width / 2)/2){
                        setTimeout(() =>{
                            this.lastCoor[0] = x
                            this.lastCoor[1] = y
                            this.cursorEl.style.left = `${x - (this.width / 2)}px`
                            this.cursorEl.style.top = `${y - (this.height / 2)}px`
                        },50)
                    }
                }
                else{
                    this.transitionDuration = 0
                    this.cursorEl.style.left = `${x - (this.width / 2)}px`
                    this.cursorEl.style.top = `${y - (this.height / 2)}px`
                }
            })
        }

        this.init = () => {
            if(!enabledCursor) this.body.style.cursor = 'none'
            this.cursorEl.style.position = 'absolute'
            this.cursorEl.style.pointerEvents = 'none'
            this.cursorEl.style.transition = `${this.transitionDuration}ms`
            this.squareMode()
            this.movement()
            /*code here*/
            this.body.appendChild(this.cursorEl)
        }

        this.allMagnet = body.querySelectorAll('.magnet-hover')
        if(this.allMagnet.length >= 1){

            console.log('magnet mouse initialiser')

            const self = this
            
            const hover = () =>{
                console.log('hoverThing')
            }
            const out = () =>{
                console.log('outThing')
            }
            this.magnetMode = [
                hover, out
            ]

            this.allMagnet.forEach(function(magnet){
                magnet.addEventListener("mouseover", self.magnetMode[0])
                magnet.addEventListener("mouseout", self.magnetMode[1])
            })
        }
        
        this.init()
    }
}
const cursorTest = new Cursor(body, styleColor, true, false)
//push in / color / cursor visible?/ tickReduction?

//put class .hover for add cursor interaction with the dom element and
//put class .magnet-hover for add etc..