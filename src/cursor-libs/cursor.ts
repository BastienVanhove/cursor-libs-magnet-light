const body = document.querySelector("body") as HTMLBodyElement
const styleColor = "red"

class Cursor{

    private init: Function;
    private cursorEl: HTMLDivElement;
    private backgroundCursor: HTMLDivElement;
    private body: HTMLBodyElement;
    public color: string;
    private height: number;
    private width: number;

    private movement: EventListener;
    private movementStart: Function;
    private movementStop: Function;
    private squareMode: Function;
    private lastCoor : [number, number];
    private transitionDuration: number;

    private onClick : EventListener;

    private allMagnet: NodeList;
    private magnetMode: [EventListener, EventListener] | null;

    private deplacementModeMagnetStart: Function;
    private deplacementModeMagnetStop: Function;
    private deplacementModeHover: Function;


    //private simpleHoverMode: Function;
    //private magnetMode: Function;
    //private lightMode: Function;
    //private copyColorMode: Function;
    //private copyBackgroundMode: Function;
    //private lsdMode: Function; multicolor mode quoi
    //private imageHoverMode; zoom in cursor of image hover

    constructor(body: HTMLBodyElement, baseColor: string, enabledCursor: boolean = true, tickReduction: boolean = false){

        const FOR_CENTER = 2

        this.body = body
        this.color = baseColor
        this.cursorEl = document.createElement('div') as HTMLDivElement
        this.backgroundCursor = document.createElement('div') as HTMLDivElement
        this.backgroundCursor.style.position = "absolute"
        this.backgroundCursor.style.height = "100vh"
        this.backgroundCursor.style.width = "100vw"
        this.backgroundCursor.appendChild(this.cursorEl)

        this.height = 20
        this.width = 20

        this.transitionDuration = 50

        this.squareMode = () =>{
            let style : any = this.cursorEl.style
            style.height = `${this.height}px`;
            style.width = `${this.width}px`;
            style.borderRadius = '5px'
            style.border = `5px solid ${this.color}`
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

        this.onClick = (e : Event) =>{
            console.log("onClick Event", e)
        }

        this.movementStart = () =>{
            window.addEventListener("mousemove", this.movement)
        }

        this.movementStop = () =>{
            window.removeEventListener("mousemove", this.movement)
        }

        let interBool = true
        let interval : any = null
        this.deplacementModeMagnetStart = () =>{
            interval = setInterval(() =>{
                if(interBool){
                    console.log(interBool)
                    //this.cursorEl.style.transform = "scale(5)"
                    interBool = false
                }else{
                    console.log(interBool);
                    //this.cursorEl.style.transform = "scale(1)"
                    interBool = true
                }
            },300)
            console.log('start magnet thing')
        }
        this.deplacementModeMagnetStop = () =>{
            clearInterval(interval)
            console.log('stop magnet thing')
        }

        this.deplacementModeHover = () =>{

        }

        this.init = () => {
            if(!enabledCursor) this.body.style.cursor = 'none'
            this.cursorEl.style.position = 'absolute'
            this.cursorEl.style.pointerEvents = 'none'
            this.cursorEl.style.transition = `${this.transitionDuration}ms`
            this.squareMode()
            this.movementStart()
            window.addEventListener('click', this.onClick)
            /*code here*/
            this.body.appendChild(this.cursorEl)
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
                this.deplacementModeMagnetStart()

            }

            const out = (e : any) => {
                const domElement = e.target as HTMLElement
                domElement.removeEventListener('mousemove', mousemove)
                domElement.style.transform = `translate(0px, 0px)`
                console.log(e)
                this.movementStart()
                this.deplacementModeMagnetStop()

            }

            this.magnetMode = [
                hover, out
            ]

            this.allMagnet.forEach(function(magnet){
                if(self.magnetMode){
                    magnet.addEventListener("mouseover", self.magnetMode[0])
                    magnet.addEventListener("mouseout", self.magnetMode[1])
                }
            })
        }else{
            this.magnetMode = null
        }
        
        this.init()
    }
}
const cursorTest = new Cursor(body, styleColor, true, false)
//push in / color / cursor visible?/ tickReduction?

//put class .hover for add cursor interaction with the dom element and
//put class .magnet-hover for add etc..