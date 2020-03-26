const fs = require('fs-extra')

module.exports = async function (indexHTML) {

    // empty
    try {
        await fs.emptyDir('./dist')
        console.log('empty success!')
    } catch (err) {
        console.error('emptyDir', err)
    }

    // theme
    try {
        await fs.copy('./src/theme', './dist/theme')
        console.log('dir copy success!')
    } catch (err) {
        console.error('copy', err)
    }

    // index
    try {
        await fs.writeFile('./dist/index.html', indexHTML, 'utf8');
        console.log('write success!')
    } catch (err) {
        console.error('write', err)
    }

}
