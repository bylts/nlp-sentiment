const fs = require('fs')
const path = require('path')
const winkNLP = require('wink-nlp')
const sentiment = require('wink-sentiment')
const model = require('wink-eng-lite-model')
const utils = require('wink-nlp-utils')
const nlp = winkNLP(model)


const inputPath = path.join(__dirname, 'input')
const outputPath = path.join(__dirname, 'output')

console.log('Running...')

fs.readdir(inputPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err)
    } 
    files.forEach(function (file) {
        fs.readFile(path.join(inputPath, file), 'utf8', (err, data) => {
            if(err) {
                console.log(err)
                return
            }
            console.log(`READING ${file}`)
            parseData(file, data)
        })
    })
})

function parseData(file, data) {
    console.log(`PARSING ${file}`)
    const doc = nlp.readDoc(data);
    let content = doc.out()
    let sentences = doc.sentences().out()

    let line = 1
    let csv = `"sentence number","sentiment","text"`
    sentences.forEach(sentence => {
        let score = sentiment(sentence).score
        let words = `${sentence}`
        let csvline = `\n"${line}","${score}","${utils.string.removePunctuations(words)}"`
        csv += csvline
        line++
    })

    let csvPath = path.join(outputPath, `${file}.csv`)
    fs.writeFileSync(csvPath, csv, {
        encoding: 'utf8',
        flag: 'w'
    })
}



