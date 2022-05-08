import { useContext, useEffect, useState } from "react"
import Router, { useRouter } from "next/router"
import { SocketContext } from "../../contexts/socketcontex"
import styles from "../../styles/HomePage.module.css"
import CharacterSelector from "../../components/character_selector"

function Room(){
    const { socket, Events, inRoom, roomPlayers } = useContext(SocketContext)
    const [inroomPlayers, setInRoomPlayers] = useState([])
    const [ready, setReady] = useState(false)
    const [readyPlayers, setReadyPlayers] = useState()
    const route = useRouter()
    const [queueCount, setQueueCount] = useState(0)
    const [queue, setQueue] = useState(false)
    const [character, setCharacter] = useState("Sky")

    socket.on('playersUpdateds',(players_list_data)=>{
        setInRoomPlayers(players_list_data.players_list)
        Events.updateRoomPlayers(players_list_data.players_list)
    })
    
    socket.on('readyPlayersUpdateds',(ready_players_data)=>{
        setReadyPlayers(ready_players_data)
    })

    socket.on('queueStart',(seconds)=>{
        setQueueCount(seconds)
        setQueue(true)
    })

    socket.on('cancelQueue',()=>{
        setQueue(false)
        setQueueCount(0)
    })

    socket.on('gameStart',(port)=>{
        Router.push(`/game/${port}`)
    })

    socket.on('gameAlreadyStarted',()=>{
        setQueue(false)
        setQueueCount(0)
        setReady(false)
        console.log("Jogo já iniciado, aguarde")
    })

    function setPlayerCharacter(character){
        setCharacter(character)
    }

    function callLeaveRoom(){
        Events.leaveRoom()
        route.push("/")
    }

    function callPlayerPreparation(){
        if(!character){alert("selecione um personagem");return}
        setReady(ready ? false : true)
        Events.setCharacter(character)
        Events.handlePlayerPreparation()
    }

    useEffect(()=>{
        if(!queue) return
        let count = queueCount
        let counter = setInterval(()=>{
            if(count > 0){
                count--
                setQueueCount(count)
            }else{
                clearInterval(counter)
            }
        },1000)
    },[queue])

    useEffect(()=>{
        (!inRoom) ? route.push("/") : null
    },[])

    useEffect(()=>{
        setInRoomPlayers(roomPlayers)
    },[roomPlayers])

    return(
        <div className={styles.background}>
            {queue ? <div className={styles.queue_counter}>A partida começará em {queueCount} segundo{queueCount == 1? null : "s"}</div> : null}
            
            <div className={styles.player_options}>
                <div className={styles.select_options}>
                    <div className={styles.ready_players}>
                        {readyPlayers && `Prontos: ${readyPlayers.ready_players}/${readyPlayers.total_players}`}
                    </div>
                    <div className={styles.options}>
                        { route.query.room ? `na sala (${route.query.room}) :` : null}
                        {inroomPlayers.map((e,key)=>{
                        return(<div key={key}>{e}<br/></div>)
                        })}
                        <br/>
                        <div className={styles.leave_ready}>
                            <button onClick={()=>{callLeaveRoom()}}>Leave Room</button>
                            <button onClick={()=>{callPlayerPreparation()}}>{ready ? "Cancelar" : "Pronto" }</button>
                        </div>
                    </div>
                </div>
                {/*<CharacterSelector setCharacter={setPlayerCharacter} character={character}/>*/}
            </div>
        </div>
    )
}

export default Room