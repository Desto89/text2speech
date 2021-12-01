import './Main.css'
import arrow from './arrow.png'
import React from 'react'
import ReactLoading from 'react-loading'
import Wave from "@foobar404/wave"
import axios from 'axios'
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
const request = require('request-promise');
require('dotenv').config()

//request is needed for correct pull from API, another methods doesn't work.



export default function Main() {

    const [loading, setLoading] = React.useState(false)
    const [input, setInput] = React.useState('')
    const [data, setData] = React.useState('')
    let [wave] = React.useState(new Wave());
    const [speed, setSpeed] = React.useState(3)
    const [volume, setVolume] = React.useState(5)
    
    function playSound() {
        document.getElementById('audio').src = `data:audio/ogg;base64,${data}`
        document.getElementById('audio').volume = volume / 10
        document.getElementById('audio').playbackRate = speed / 2
        const options = {type:"dualbars blocks", colors:['#0808a3', '#0808a3'], stroke: 1};
        wave.fromElement('audio', "waveBg", options);
        document.getElementById('audio').play()
    }
    

    function handleChange(e) {
        setInput(e.target.value)
    }

    function downloadFile() {

        axios.post(
            "http://localhost:5000/download",
            {
              data: data
            },
            {
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              }
            }
          )
        
       setTimeout(() => {window.location.href = "http://localhost:5000/download"}, 3000)
        }

    async function convert() {
        setData('')
        setLoading(true)
        const options = {
            method: 'POST',
            url: 'https://text-to-speech14.p.rapidapi.com/api/tts',
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'x-rapidapi-host': 'text-to-speech14.p.rapidapi.com',
              'x-rapidapi-key': process.env.RAPID_API_KEY,
              useQueryString: true
            },
            form: {tech: 'deep', text: input, language: 'en'}
          };

          if (input !== null && input !== '') {
            const results = await request(options, function (error, response, body) {
                var data = JSON.parse(body)
                setData(data.data.soundBase64) 
            });
          } else {
              setData('')
          }
          setLoading(false)
    }

    return (
        <div>
            <div className='main'>
                <div className='input'>
                    <textarea onChange={handleChange} placeholder='Type some text...' type='text' rows='10' cols='26' value={input} /><br />
                    <button id='convertBtn' onClick={convert}>Convert</button>
                </div>
                <div className='middle'>
                    {loading === true &&
                        <ReactLoading type='spinningBubbles' color='mediumblue' height={120} width={120} />
                    }
                    {loading === false && 
                        <img id='arrow' src={arrow} alt='arrow' />
                    }
                </div>
                <div className='output'>
                    <canvas id="waveBg"></canvas><br />
                    {data !== '' &&
                        <button id='convertBtn' onClick={playSound}>➤</button>
                    }
                    {data === '' &&
                        <button id='convertBtnDisabled' onClick={function(){}} disabled>➤</button>
                    }
                    <audio id='audio'></audio>
                </div>
                <div className='options'>
                    <div className='optionDiv'>
                        <VolumeUpIcon style={{fill: "mediumblue"}}/>
                        <input onChange={(e)=>{setVolume(e.target.value)}} type='range' id='volume' min='0' max='10' value={volume} />
                    </div>
                    <div className='optionDiv'>
                        <FlashOnIcon  style={{fill: "mediumblue"}}/>
                        <input onChange={(e)=>{setSpeed(e.target.value)}} type='range' id='speed' min='1' max='10' value={speed}/>
                    </div>
                    {data !== '' &&
                        <button onClick={downloadFile} id='downloadBtn'>Download</button>
                    }
                    {data === '' &&
                        <button id='downloadBtnDisabled' disabled>Download</button>
                    }
                </div>
            </div>
            <div className='footer'>
                <h3>Check my other projects on <a href='https://github.com/Desto89?tab=repositories'>GitHub</a></h3>
            </div>
        </div>
    )
}
