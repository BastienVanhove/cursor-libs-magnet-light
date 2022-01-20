const styleColor = "#6f49cf"

class Cursor{

    private init: Function;
    private unInit: Function;
    private cursorEl: HTMLDivElement;
    private transitonCursor: HTMLDivElement;
    private lightFilter: HTMLDivElement;
    private body: HTMLBodyElement;
    public color: string;
    private height: number;
    private width: number;
    private baseOpacity: string;

    private filterOn: Function;
    private filterOff: Function;
    private movement: EventListener;
    private movementStart: Function;
    private movementStop: Function;
    private initCursor: Function;
    private lastCoor : [number, number];
    private transitionDuration: number;

    private onClickDown : EventListener;
    private onClickUp : EventListener;

    //change stucture of this but now im lazzy so shut up
    private allMagnet: NodeList;
    private magnetMode: [EventListener, EventListener] | null;

    private allClick: NodeList;
    private clickMode: [EventListener, EventListener] | null;

    private allLight: NodeList;
    private lightMode: [EventListener, EventListener] | null;

    //private imageHoverMode; zoom in cursor of image hover

    constructor(baseColor: string,enabledCursor: boolean = true, tickReduction: boolean = false){

        this.body = document.querySelector('body') as HTMLBodyElement
        this.color = baseColor
        this.cursorEl = document.createElement('div') as HTMLDivElement
        this.transitonCursor = document.createElement('div') as HTMLDivElement
        this.lightFilter = document.createElement('div') as HTMLDivElement

        this.height = 15
        this.width = 15

        this.baseOpacity = "0.8"

        this.transitionDuration = 50

        const FOR_CENTER = 2

        this.init = () => {

            if(!enabledCursor) this.body.style.cursor = 'none'

            this.initCursor()

            this.movementStart()

            window.addEventListener('mousedown', this.onClickDown)
            window.addEventListener('mouseup', this.onClickUp)

            this.filterOff()

            this.body.appendChild(this.lightFilter)
            this.body.appendChild(this.cursorEl)

            window.addEventListener('resize', ()=>{
                if(window.innerWidth < 900){
                    this.body.style.cursor = 'none'
                }else{
                    this.body.style.cursor = 'auto'
                }
            })
        }

        this.unInit = () =>{
            console.log('un init the cursor')
        }

        this.filterOn = () =>{
            this.lightFilter.style.opacity = "0.8"
        }

        this.filterOff = () =>{
            this.lightFilter.style.opacity = "0"
        }

        this.initCursor = () =>{

            const style : any = this.cursorEl.style
            style.height = `${this.height}px`;
            style.width = `${this.width}px`;
            style.opacity = "0.7"
            style.position = 'absolute'
            style.pointerEvents = 'none'
            style.transition = `${this.transitionDuration}ms`
            style.transform = 'scale(1)'
            style.zIndex = '1000'

            const transitionStyle : any = this.transitonCursor.style
            transitionStyle.height = "100%"
            transitionStyle.width = "100%"
            transitionStyle.borderRadius = "50%"
            transitionStyle.background = `${this.color}`
            transitionStyle.transition = "400ms"
            transitionStyle.transform = "scale(1)"

            this.cursorEl.appendChild(this.transitonCursor)

            this.lightFilter.style.height = "100vh"
            this.lightFilter.style.width = "100vw"
            this.lightFilter.style.position = "absolute"
            this.lightFilter.style.pointerEvents = "none"
            this.lightFilter.style.background = "black"
            this.lightFilter.style.opacity = this.baseOpacity
            this.lightFilter.style.transition = "0.5s"
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

        //click event
        const exctractScaleValue = () =>{
            let str = this.transitonCursor.style.transform
            str = str.replace('scale(', '').replace(')', '')
            return parseFloat(str)
        }
        let scale : number
        this.onClickDown = (e : Event) =>{
            scale = exctractScaleValue()
            this.transitonCursor.style.transform = `scale(${scale * 0.70})`
        }
        this.onClickUp = (e : Event) =>{
            this.transitonCursor.style.transform = `scale(${scale})`
        }

        //moovement start stop method
        this.movementStart = () =>{
            window.addEventListener("mousemove", this.movement)
        }

        this.movementStop = () =>{
            window.removeEventListener("mousemove", this.movement)
        }
        const self = this
        this.allMagnet = this.body.querySelectorAll('.magnet-hover')
        if(this.allMagnet.length >= 1){

            const SCALE_ENGLOBE = 1.75
            const OPACITY_HOVER = "0.2"
            
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

                domElement.style.transform = `translate(${-ecart[0]/ 3}px, ${-ecart[1]/3}px)`

                const newCoor : [number, number] = [
                    (coor[0] - ecart[0]/2.5) - this.height/2,
                    (coor[1] - ecart[1]/2.5) - this.width/2
                ]

                this.cursorEl.style.left = `${newCoor[0]}px`
                this.cursorEl.style.top = `${newCoor[1]}px`

                //calculer l'ecart avec le center
            }

            const hover : EventListener = ( e : any ) =>{

                const domElement = e.target as HTMLElement
                domElement.addEventListener('mousemove', mousemove)
                domElement.style.transition = '100ms'

                //find center of Dom Element
                this.movementStop()

                const cursorB = this.cursorEl.getBoundingClientRect()
                const cursorValue = (cursorB.height + cursorB.width) / 2

                const elB = e.target.getBoundingClientRect()
                const elValue = (elB.height + elB.width) / 2

                const scaleFactor = (elValue / cursorValue) + SCALE_ENGLOBE

                this.transitonCursor.style.transform = `scale(${scaleFactor})`
                this.transitonCursor.style.opacity = OPACITY_HOVER
            }

            const out = (e : any) => {
                const domElement = e.target as HTMLElement
                domElement.removeEventListener('mousemove', mousemove)
                domElement.style.transform = `translate(0px, 0px)`
                //console.log(e)
                this.movementStart()

                scale = 1
                this.transitonCursor.style.transform = "scale(1)"
                this.transitonCursor.style.opacity = this.baseOpacity

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

        this.allClick = this.body.querySelectorAll('.click')
        if(this.allClick.length >= 1){

            const SCALE_ENGLOBE = 1.5
            const OPACITY_HOVER = "0.2"

            const hover = (e : any) =>{

                const cursorB = this.cursorEl.getBoundingClientRect()
                const cursorValue = (cursorB.height + cursorB.width) / 2

                const elB = e.target.getBoundingClientRect()
                const elValue = (elB.height + elB.width) / 2

                const scaleFactor = (elValue / cursorValue) + SCALE_ENGLOBE

                this.transitonCursor.style.transform = `scale(${scaleFactor})`
                this.transitonCursor.style.opacity = OPACITY_HOVER
            }
            const out = () =>{
                scale = 1
                this.transitonCursor.style.transform = "scale(1)"
                this.transitonCursor.style.opacity = this.baseOpacity
            }

            this.clickMode = [hover, out]

            this.allClick.forEach(function(click){
                if(self.clickMode){
                    click.addEventListener('mouseover', self.clickMode[0])
                    click.addEventListener('mouseout', self.clickMode[1])

                }
            })
        }
        else{
            this.clickMode = null
        }

        this.allLight = this.body.querySelectorAll('.light')
        if(this.allLight.length >= 1){

            let lastLight : HTMLElement
            const hover = (e : any) =>{
                this.filterOn()
                lastLight = e.target
                let targetStyle = e.target.style
                targetStyle.zIndex = 999
                this.transitonCursor.style.background = "white"
            }

            const out = () =>{ 
                this.filterOff() 
                if(lastLight) lastLight.style.zIndex = "0"
                this.transitonCursor.style.background = this.color
            }

            this.lightMode = [hover, out]

            this.allLight.forEach(function(light : any){
                light.style.position = "absolute"
                if(self.lightMode){
                    light.addEventListener('mouseover', self.lightMode[0])
                    light.addEventListener('mouseout', self.lightMode[1])
                }
            })
        }
        else{
            this.lightMode = null
        }
        this.init()
    }
}

const cursorTest = new Cursor(styleColor, true, false)

// arguments : / color?:string / cursor visible?:boolean / tickReduction?:boolean  / sound ?:boolean 
