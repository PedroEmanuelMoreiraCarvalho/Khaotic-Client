import { useContext, useEffect, useRef, useState } from "react"
import { GameContext } from "../contexts/gamecontext"

function Khaotic(){
    const { game_socket } = useContext(GameContext)
    const [game_data, setGameData] = useState({characters: [],entitys: [],tiles: []})
    const canvas_ref = useRef(null)
    const CanvasWidht = 900
    const CanvasHeight = 600
    let camerax = 0
    let cameray = 0
    let life = 0
    let died = false
    let hidden = false

    let sky = new Image
    sky.src = `/sky/sky1.png`

    let sky_i = new Image
    sky_i.src = `/sky/sky-1.png`
    
    let map = new Image
    map.src = "/tiles/grass.jpg"
    
    let bush = new Image
    bush.src = "/tiles/bush.png"

    let wall = new Image
    wall.src = "/tiles/wall.jpg"

    let heal = new Image
    heal.src = "/entities/heal.png"

    const metrics = {
        players_size: 48,
        tile_size: 48,
        projectile_size: 10
    }

    game_socket.on('gameData',(game_data)=>{
        setGameData(game_data)
    })

    const Render = ctx => {
        if(!game_data)return
        ctx.clearRect(0,0,CanvasWidht,CanvasHeight)
        ctx.beginPath()
        
        game_data && game_data.characters.forEach((character)=>{
            if(character.id == game_socket.id){
                camerax = character.x - (CanvasWidht/2) + (metrics.players_size/2)
                cameray = character.y - (CanvasHeight/2) + (metrics.players_size/2)
                died = (character.died) ? true: false
                hidden = (character.hidden) ? true: false
            }
        })

        
        ctx.fillStyle = "#71BCE1"
        ctx.fillRect(0,0,CanvasWidht,CanvasHeight)

        game_data && game_data.tiles.forEach((tile)=>{
            if(tile.x-camerax<-metrics.tile_size||tile.x-cameray>CanvasWidht+metrics.tile_size
            && tile.y-cameray<-metrics.tile_size||tile.y-cameray>CanvasHeight+metrics.tile_size)return
            switch(tile.id){
                case 1:
                    ctx.drawImage(map,tile.x-camerax,tile.y-cameray)
                    break
                case 2:
                    ctx.drawImage(bush,tile.x-camerax,tile.y-cameray)
                    break
                case 3:
                    ctx.drawImage(wall,tile.x-camerax,tile.y-cameray)
                    break
                default:
                    break
            }
        })

        game_data.characters.forEach((character)=>{
            character.id == game_socket.id ? ctx.fillStyle = "#00FF00" : ctx.fillStyle = "#ff0000"
            if(character.id == game_socket.id){
                if(died)ctx.globalAlpha = 0.3
                life = character.life
                ctx.fillStyle = "#00FF00"
                character.dir == 1 ?
                    ctx.drawImage(sky, character.x-camerax, character.y-cameray,48,48):
                    ctx.drawImage(sky_i, character.x-camerax, character.y-cameray,48,48)
                ctx.fillStyle = "#111"
                ctx.strokeStyle = "black"
                ctx.lineWidth = 1
                ctx.font = "14px sans-serif"
                ctx.textAlign = 'center'
                ctx.fillText("Você", character.x+(metrics.players_size/2)-camerax, character.y-10-cameray)
            }else{
                if(died)ctx.globalAlpha = 1
                if(character.died)return
                if(character.hidden)return
                character.dir == 1 ?
                    ctx.drawImage(sky, character.x-camerax, character.y-cameray,48,48):
                    ctx.drawImage(sky_i, character.x-camerax, character.y-cameray,48,48)
                ctx.fillStyle = "#111"
                ctx.strokeStyle = "black"
                ctx.lineWidth = 1
                ctx.font = "14px sans-serif"
                ctx.textAlign = 'center'
                ctx.fillText(character.nick, character.x+(metrics.players_size/2)-camerax, character.y-10-cameray)    
                ctx.fillStyle = "#333"
                ctx.fillRect(character.x-camerax-1,character.y-cameray-9,0.5*100+2,8)
                ctx.fillStyle = "#F00";
                ctx.fillRect(character.x-camerax, character.y-cameray-8, 0.5*character.life, 6)
            }
        })

        ctx.globalAlpha = 1;
        game_data.entitys.forEach((entity)=>{
            switch(entity.type){
                case "SkyProjectile":
                    ctx.fillStyle = "#111";
                    ctx.fillRect(entity.x-camerax, entity.y-cameray, metrics.projectile_size, metrics.projectile_size)
                    break

                case "Heal":
                    ctx.drawImage(heal,entity.x-camerax,entity.y-cameray)
                    break
                default:
                    break
            }
        })
        
        if(hidden){
            ctx.globalAlpha = 0.4
            ctx.fillStyle = "#F0F";
            ctx.fillRect(0, 0, CanvasWidht, CanvasHeight)
        }
        
        ctx.globalAlpha = 1

        ctx.fillStyle = "#333";
        ctx.fillRect(0, 0, 2*100+2, 22)
        ctx.fillStyle = "#0F0";
        ctx.fillRect(0, 0, 2*life, 20)

        game_data.messages && game_data.messages.forEach((message)=>{
            let message_index = game_data.messages.indexOf(message)
            ctx.fillStyle = "#111"
            ctx.strokeStyle = "black"
            ctx.lineWidth = 1
            ctx.font = "25px sans-serif"
            ctx.textAlign = 'center'
            ctx.fillText(message, CanvasWidht/2, (message_index+1)*CanvasHeight/4)
        })

        ctx.fill()
    }
    
    useEffect(() => {    
        const canvas = canvas_ref.current
        canvas.addEventListener('contextmenu', null, false);
        const context = canvas.getContext('2d')
        Render(context)
    },[game_data])

    return(
        <>
            <canvas ref={canvas_ref} width={CanvasWidht} height={CanvasHeight}></canvas>
        </>
    )
}

export default Khaotic