const express = require('express')
const app = express()
const ejs = require('ejs')
const port = 3030

ejs.delimiter = '!---'

app.get('/', function (req, res) {
    ejs.renderFile('./dist/index.html', {}, {}, (err, html) => {
        res.send(html)
    })
})

app.use(express.static('dist'))
app.use(express.static('live'))

app.listen(port)
console.log(`listening on ${port}`)
