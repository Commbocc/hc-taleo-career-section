const express = require('express')
const app = express()
const ejs = require('ejs')
const port = 3030
const is_dev = process.env.NODE_ENV != 'production'

ejs.delimiter = '!---'

var content = null

ejs.renderFile('./src/index.html', { inc }, {}, (err, html) => {
    content = html
})

if (is_dev) {
    
    app.get('/', (req, res) => {
        res.send(content)
    })

    app.use(express.static('src'))
    app.use(express.static('live'))

    app.listen(port)
    console.log(`listening on ${port}`)
} else {
    require('./util/builder')(content).then(() => {
        require('./util/archiver')
    })
}

function inc(file) {
    var content = null

    if (is_dev) {
        // <!---- include('./includes/file') !--->
        ejs.renderFile(`./src/includes/${file}.ejs`, {}, {}, (err, html) => {
            content = html
        })
    } else {
        content = `<!-- ${file} -->`
    }


    return content
}
