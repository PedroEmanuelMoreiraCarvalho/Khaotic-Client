import { useState } from "react"
import game_characters from "../public/game_characters"
import styles from "../styles/CharacterSelection.module.css"

function CharacterSelector(props){
    const data = game_characters.characters_data

    const [index,setIndex] = useState(0)
    const [character, setCharacter] = useState(data.characters[0])
    
    function next(e){
        e.preventDefault()
        if(index == data.characters.length-1)return
        let new_index = index + 1
        setCharacter(data.characters[new_index])
        setIndex(new_index)
    }

    function previous(e){
        e.preventDefault()
        if(index == 0)return
        let new_index = index - 1
        setCharacter(data.characters[new_index])
        setIndex(new_index)
    }

    function setPlayerCharacter(e){
        e.preventDefault()
        props.setCharacter(character.name)
    }

    return(
        <div className={styles.CharacterSelector}>
            <div className={styles.container}>
                <button onClick={(e)=>{previous(e)}}>previous</button>
                <div>
                    <div className={styles.character_info}>
                        <div className={styles.name}>
                            {character.name}
                        </div>
                        <div className={styles.character_data}>
                            <div className={styles.character_pic}>
                                <img src={character.image}/>
                            </div>
                            <div className={styles.info}>
                                <img src={character.icon}/>
                                <div>{character.description}</div>
                                <div>Habilidade: {character.hability}</div>
                                <div>Ultimate: {character.ultimate}</div>
                                <button onClick={(e)=>{setPlayerCharacter(e)}}>{
                                    props.character == data.characters[index].name ? "Selecionado" : "Selecionar"
                                }</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={(e)=>{next(e)}}>right</button>
            </div>
            <div className={styles.items_preview}>
                {data.characters.map((char,key)=>{
                    return( data.characters[index] == char ?
                        <div key={key} className={styles.selected}></div>
                        : 
                        <div key={key} className={styles.deselected}></div>
                    )
                })}
            </div>
        </div>
    )
}

export default CharacterSelector