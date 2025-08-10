import { useState, useEffect, useRef } from "react"
import html2canvas from "html2canvas"
import downloadIcon from "../src/assets/download.png"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "https://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])
    const memeRef = useRef(null);
    
    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const newMemeUrl = allMemes[randomNumber].url

        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }))
    }
    
    function handleChange(event) {
        const {value, name} = event.currentTarget

        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    async function downloadMeme() {
        if (!memeRef.current) {
            return;
        };

        const canvas = await html2canvas(memeRef.current, {
          useCORS: true,
          backgroundColor: null,
          scale: 2,
        });

        const link = document.createElement("a");

        link.download = "meme.png";
        link.href = canvas.toDataURL("image/png");

        link.click();
      }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>
            <div className="meme" ref={memeRef}>
                <img src={meme.imageUrl} />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
            <button className="download-button" onClick={downloadMeme}>
                <span>Download Your Meme</span>
                <img className="download-icon" src={downloadIcon} alt="download" />
            </button>
        </main>
    )
}