
const chessBoard = document.querySelector('.chessBoard')

const generateCase = (color : string) => {
    let piece = document.createElement('i')
    piece.className = 'fas fa-chess-pawn magnet-hover'
    piece.style.fontSize = "3.5em"
    piece.style.padding = "15px"
    piece.style.color = "grey"
    piece.style.marginTop = "auto"
    piece.style.marginBottom = "auto"


    let div = document.createElement('div')
    div.style.height = '12.5%'
    div.style.width = '12.5%'
    div.style.background = color
    div.style.display = "flex"

    div.appendChild(piece)
    return div
}
const boardConstruct = () =>{
    for(let x = 0; x < 8; x++){
        for(let y = 0; y < 8; y++){
            if((x + y) % 2 == 0){
                chessBoard?.appendChild(generateCase('rgb(128, 27, 27)'))
            }else{
                chessBoard?.appendChild(generateCase('transparent'))
            }
        }
    }
}
boardConstruct()