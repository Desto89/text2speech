const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded());

app.post('/download', (req, res) => {
    fs.writeFileSync(`Sound.ogg`, Buffer.from(req.body.data.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64'));
})

app.get('/download', (req, res) => {
    res.download('./Sound.ogg')
    setTimeout(() => {
        fs.unlink('./Sound.ogg', (err) => {
            if (err) {
                console.log(err)
            }
        })
    }, 3000)
})

app.listen(5000)
