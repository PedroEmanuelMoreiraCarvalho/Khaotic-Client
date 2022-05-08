import { useRouter } from "next/router"
import { useContext } from "react"
import { GameContext } from "../contexts/gamecontext"
import styles from "../styles/Colocation.module.css"

function Colocation(){

    const {colocation} = useContext(GameContext)
    const route = useRouter()
    
    return(
        <div className={styles.background}>
            <div className={styles.colocation}>
                {colocation.map((player, key)=>{
                    return(
                    <div key={key} className={styles.player_colocation}>
                        {colocation.length - key} - {player.player_nick}
                    </div>)
                })}
            </div>
            <div className={styles.options}>
                <button onClick={()=>{route.push("/")}}>Voltar</button>
            </div>
        </div>
    )
}

export default Colocation