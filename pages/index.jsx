import React, { useRef, useState, useContext } from 'react' 
import { SocketContext } from '../contexts/socketcontex';
import { useRouter } from "next/router"
import styles from "../styles/HomePage.module.css"

export default function Home() {
  const { socket, Events} = useContext(SocketContext)
  const route = useRouter()
  const nickref = useRef()
  const roomref = useRef()
  
  function callCreateRoom(){
    let nick = nickref.current.value

    if(nick.trim()==""){
      alert("digite um nick")
      nickref.current.focus()
      return
    }

    Events.createRoom(nick)
  }
  
  function callEnterRoom(){
    let nick = nickref.current.value
    let room_id = roomref.current.value

    if(nick.trim()==""){
      alert("digite um nick")
      nickref.current.focus()
      return
    }

    Events.enterRoom(nick,room_id)
  }

  socket.on('connected',(room_id)=>{
    Events.setInRoomState(true)
    route.push(`/rooms/${room_id}`)
  })

  socket.on('playersUpdateds',(players_list_data)=>{
    Events.updateRoomPlayers(players_list_data.players_list)
  })

  return (
    <div className={styles.background}>
      <div className={styles.title}>
        <h1>Khaotic</h1>
        <h2>a game by Ierokirykas</h2>
      </div>
      <div className={styles.options}>
        <div className={styles.nick}>
          Seu Nick: <input ref={nickref} placeholder="nick"/>
        </div>
        <div className={styles.room_options}>
          <div className={styles.create_room}>
            <button onClick={()=>{callCreateRoom()}}>Create Room</button>
          </div>
          ou
          <div className={styles.enter_room}>
            <input ref={roomref} placeholder="id da sala"/>
            <button onClick={()=>{callEnterRoom()}}>Enter Room</button>
          </div>
        </div>
      </div>
      
    </div>
  )
}