const body = document.querySelector("body") as HTMLBodyElement
const styleColor = "white"

class Cursor{

    private init: Function;
    private cursorEl: HTMLDivElement;
    private lightFilter: HTMLDivElement;
    private body: HTMLBodyElement;
    public color: string;
    private height: number;
    private width: number;

    private filterOn: Function;
    private filterOff: Function;
    private movement: EventListener;
    private movementStart: Function;
    private movementStop: Function;
    private squareMode: Function;
    private lastCoor : [number, number];
    private transitionDuration: number;

    private onClickDown : EventListener;
    private onClickUp : EventListener;

    //change stucture of this but now im lazzy so shut up
    private allMagnet: NodeList;
    private magnetMode: [EventListener, EventListener] | null;

    private allClick: NodeList;
    private clickMode: [Function, Function] | null;

    //private simpleHoverMode: Function;
    //private magnetMode: Function;
    //private lightMode: Function;
    //private copyColorMode: Function;
    //private copyBackgroundMode: Function;
    //private lsdMode: Function; multicolor mode quoi
    //private imageHoverMode; zoom in cursor of image hover

    constructor(body: HTMLBodyElement, baseColor: string,enabledCursor: boolean = true, tickReduction: boolean = false){

        const FOR_CENTER = 2

        this.body = body
        this.color = baseColor
        this.cursorEl = document.createElement('div') as HTMLDivElement
        this.lightFilter = document.createElement('div') as HTMLDivElement

        this.height = 15
        this.width = 15

        this.transitionDuration = 50

        this.init = () => {
            if(!enabledCursor) this.body.style.cursor = 'none'

            this.cursorEl.style.position = 'absolute'
            this.cursorEl.style.pointerEvents = 'none'
            this.cursorEl.style.transition = `${this.transitionDuration}ms`

            this.lightFilter.style.height = "100vh"
            this.lightFilter.style.width = "100vw"
            this.lightFilter.style.position = "absolute"
            this.lightFilter.style.pointerEvents = "none"
            this.lightFilter.style.background = "black"
            this.lightFilter.style.opacity = "0.8"
            this.lightFilter.style.transition = "0.5s"

            this.squareMode()
            this.movementStart()

            window.addEventListener('mousedown', this.onClickDown)
            window.addEventListener('mouseup', this.onClickUp)

            this.filterOff()

            this.body.appendChild(this.lightFilter)
            this.body.appendChild(this.cursorEl)
        }

        this.filterOn = () =>{
            this.lightFilter.style.display = "block"
        }

        this.filterOff = () =>{
            this.lightFilter.style.display = "none"
        }

        this.squareMode = () =>{
            let style : any = this.cursorEl.style
            style.height = `${this.height}px`;
            style.width = `${this.width}px`;
            style.borderRadius = '50%'
            style.opacity = "0.7"
            style.background = `${this.color}`
        }

        this.lastCoor = [0, 0]
        this.movement = (e : any) =>{
            const x : number = e.clientX
                const y : number = e.clientY
                const distance : number = Math.abs(this.lastCoor[0] - x) + Math.abs(this.lastCoor[1] - y)
                if(tickReduction){
                    if(distance > (this.height + this.width / FOR_CENTER)/FOR_CENTER){
                        setTimeout(() =>{
                            this.lastCoor[0] = x
                            this.lastCoor[1] = y
                            this.cursorEl.style.left = `${x - (this.width / FOR_CENTER)}px`
                            this.cursorEl.style.top = `${y - (this.height / FOR_CENTER)}px`
                        },50)
                    }
                }
                else{
                    this.cursorEl.style.left = `${x - (this.width / FOR_CENTER)}px`
                    this.cursorEl.style.top = `${y - (this.height / FOR_CENTER)}px`
                }
        }

        this.onClickDown = (e : Event) =>{
            this.cursorEl.style.transform = "scale(0.5)"
        }

        this.onClickUp = (e : Event) =>{
            this.cursorEl.style.transform = "scale(1)"
        }

        this.movementStart = () =>{
            window.addEventListener("mousemove", this.movement)
        }

        this.movementStop = () =>{
            window.removeEventListener("mousemove", this.movement)
        }

        this.allMagnet = body.querySelectorAll('.magnet-hover')
        if(this.allMagnet.length >= 1){

            const self = this
            
            const mousemove : EventListener = (e : any) =>{
                const domElement = e.target
                const clientX = e.clientX
                const clientY = e.clientY

                const findCenterOfDomEl = (el : HTMLElement) : [number, number] =>{
                    const xEl = el.getBoundingClientRect().x
                    const yEl = el.getBoundingClientRect().y

                    const height = el.getBoundingClientRect().height
                    const width = el.getBoundingClientRect().width

                    return [(xEl + (width/FOR_CENTER)) - this.width / FOR_CENTER, (yEl + (height/FOR_CENTER)) - this.height / FOR_CENTER]
                }

                const coor = findCenterOfDomEl(domElement)

                const ecart : [number, number] = [coor[0] - clientX, coor[1] - clientY]

                domElement.style.transform = `translate(${-ecart[0]}px, ${-ecart[1]}px)`

                const newCoor : [number, number] = [
                    (coor[0] - ecart[0]/1.75) - this.height/4,
                    (coor[1] - ecart[1]/1.75) - this.width/4
                ]

                this.cursorEl.style.left = `${newCoor[0]}px`
                this.cursorEl.style.top = `${newCoor[1]}px`

                //calculer l'ecart avec le center
            }

            const hover : EventListener = ( e : any ) =>{
                
                const domElement = e.target as HTMLElement
                domElement.style.transition = '100ms'
                //find center of Dom Element
                this.movementStop()
                domElement.addEventListener('mousemove', mousemove)
            }

            const out = (e : any) => {
                const domElement = e.target as HTMLElement
                domElement.removeEventListener('mousemove', mousemove)
                domElement.style.transform = `translate(0px, 0px)`
                //console.log(e)
                this.movementStart()
            }

            this.magnetMode = [
                hover, out
            ]

            this.allMagnet.forEach(function(magnet : any) {
                if(self.magnetMode){
                    magnet.addEventListener("mouseover", self.magnetMode[0])
                    magnet.addEventListener("mouseout", self.magnetMode[1])
                }
            })
        }else{
            this.magnetMode = null
        }

        this.allClick = body.querySelectorAll('.click')
        if(this.allClick.length >= 1){

        }
        else{
            this.clickMode = null
        }


        
        this.init()
    }
}
const cursorTest = new Cursor(body, styleColor, true, false)
//push in / color / cursor visible?/ tickReduction?

//put class .hover for add cursor interaction with the dom element and
//put class .magnet-hover for add etc..