import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import Khaotic from "../../components/game"
import { GameContext } from "../../contexts/gamecontext"
import { SocketContext } from "../../contexts/socketcontex"
import styles from "../../styles/Game.module.css"

export default function Game(){
    const { inRoom } = useContext(SocketContext)
    const { game_socket, Events } = useContext(GameContext)
    const route = useRouter()
    const canvas_ref = useRef(null)
    
    game_socket.on('endgame',(colocation)=>{
        console.log(colocation)
        Events.disconnect()
        removeEventListenersFunction()
        route.push("/colocation")
    })

    useEffect(()=>{
        route.events.on('routeChangeStart', removeEventListenersFunction)
    },[route])

    function removeEventListenersFunction(){
        document.removeEventListener("keydown", handleKeyPressed);
        document.removeEventListener("keyup", handleKeyReleased);
        document.removeEventListener("click", handleClick);
    }

    const EventListener = {
        w(){
            Events.up(true)
        },
        a(){
            Events.left(true)
        },
        s(){
            Events.down(true)
        },
        d(){
            Events.right(true)
        },
    }

    const EventReleaser = {
        w(){
            Events.up(false)
        },
        a(){
            Events.left(false)
        },
        s(){
            Events.down(false)
        },
        d(){
            Events.right(false)
        },
    }

    const handleKeyPressed = (e) => {
        const keyFunction = EventListener[`${e.key}`]
        if(!keyFunction)return
        keyFunction()
    };

    const handleKeyReleased = (e) => {
        const keyFunction = EventReleaser[`${e.key}`]
        if(!keyFunction)return
        keyFunction()
    };

    const handleClick = (e) => {
        e.preventDefault()
        let offsetY = canvas_ref.current.offsetTop
        let offsetX = canvas_ref.current.offsetLeft
        Events.attack(e.clientX-offsetX-(900/2),e.clientY-offsetY-(600/2))
    }

    useEffect(() => {
        (!inRoom) ? route.push("/") : null
        let game_id = route.query.game
        Events.connect(game_id)
    },[])

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPressed);
        document.addEventListener("keyup", handleKeyReleased);
        document.addEventListener("click", handleClick);
    },[document])

    return(
        <div className={styles.background}>
            <div ref={canvas_ref} className={styles.game_display}>
                <Khaotic/>
            </div>
        </div>
    )
}