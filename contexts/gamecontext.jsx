import { useRouter } from "next/router";
import { createContext, useContext, useState } from "react";
import { io } from "socket.io-client";
import parser from "socket.io-msgpack-parser"
import { SocketContext } from "./socketcontex";

var game_socket = io.connect("http://localhost:8000",{transports: ['websocket'], parser})

export const GameContext = createContext()

export function GameProvider({children}) {
    const { socket } = useContext(SocketContext)
    const [colocation, setColocation] = useState([])

    game_socket.on('endgame',(colocation)=>{
        let inverse_colocation = colocation.reverse()
        setColocation(inverse_colocation)
        console.log(inverse_colocation)
    })

    game_socket.on('getSocketId',()=>{
        game_socket.emit('assimilateSocketId',socket.id)
    })

    const Events = {
        connect(port){
            if(!port)return
            game_socket.disconnect()
            game_socket = io.connect(`http://localhost:${port}?pattern=${socket.id}`,{transports: ['websocket'], parser})
        },

        up(state){
            game_socket.emit('up',state)
        },

        left(state){
            game_socket.emit('left',state)
        },

        down(state){
            game_socket.emit('down',state)
        },

        right(state){
            game_socket.emit('right',state)
        },

        attack(mousex,mousey){
            game_socket.emit('attack',{x:mousex,y:mousey})
        },

        assimilateID(socket_id){
            game_socket.emit('assimilateSocketId',socket.id)
        },

        disconnect(){
            game_socket.disconnect()
        }
    }

    return(
        <GameContext.Provider value={{game_socket, Events, colocation}}>
            {children}
        </GameContext.Provider>
    )
}