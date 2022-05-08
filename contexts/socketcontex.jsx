import { createContext, useState } from "react";
import { io } from "socket.io-client";
import parser from "socket.io-msgpack-parser"

const socket = io.connect("http://localhost:8000",{transports: ['websocket'], parser});
const roomPlayers = [] 

export const SocketContext = createContext()

export function SocketProvider({children}) {
    const [inRoom, SetInRoom] = useState(false)

    const Events = {
        createRoom(nick){
            socket.emit('createRoom',{nick_name: nick})
        },
        enterRoom(nick,room_id){
            socket.emit('enterRoom',{nick_name: nick, room_id: room_id})
        },
        setCharacter(character){
            socket.emit('setCharacter',character)
        },
        leaveRoom(){
            socket.emit('leaveRoom')
        },
        handlePlayerPreparation(){
            socket.emit('handleReady')
        },
        setInRoomState(state){
            SetInRoom(state)
        },
        updateRoomPlayers(new_players){
            roomPlayers = new_players
        },
    }

    return(
        <SocketContext.Provider value={{socket, Events, inRoom, roomPlayers}}>
            {children}
        </SocketContext.Provider>
    )
}