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

    private allMagnet: NodeList;
    private magnetMode: [EventListener, EventListener] | null;

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
                    this.transitionDuration = 0
                    this.cursorEl.style.left = `${x - (this.width / FOR_CENTER)}px`
                    this.cursorEl.style.top = `${y - (this.height / FOR_CENTER)}px`
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
            
            const hover = (e : Event) =>{
                const domElement = e.target as HTMLElement
                //find center of Dom Element
                const findCenterOfDomEl = (el : HTMLElement) : [number, number] =>{
                    const height = el.getBoundingClientRect().height
                    const width = el.getBoundingClientRect().width
                    return [width/FOR_CENTER, height/FOR_CENTER]
                }

                const coorRelativeCenter = findCenterOfDomEl(domElement)

                const coorTopLeft : [number, number] = [e.x, e.y]

                const coorCenterAbsolute : [number, number] = [
                    coorRelativeCenter[0] + coorTopLeft[0],
                    coorRelativeCenter[1] + coorTopLeft[1]
                ]
                
                this.cursorEl.style.left = `${coorCenterAbsolute[0] - (this.width/ FOR_CENTER)}px`
                this.cursorEl.style.top = `${coorCenterAbsolute[1]}px`
                console.log(coorCenterAbsolute, 'was coor init')

                //enfaite ca marche avec une erreur de calcul et sa revien instant a la position car je stop pas l'event window donc faut commencer par stop levent window
            }

            const out = (e : Event) => {
                console.log('out')
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