const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 8000
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://sujade:xpxNKTqsJ0tcnAEd@quotes.4cdt2xk.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('fireNationAttacks')
        const quotesCollection = db.collection('quotes')

        app.set('view engine', 'ejs')

        app.use(bodyParser.urlencoded({ extended : true }))

        app.use(express.static('public'))

        app.use(bodyParser.json())

        app.get('/', (req, res) => {
            db.collection('quotes')
                .find()
                .toArray()
                .then(results => {
                    res.render('index.ejs', { quotes: results })
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            quotesCollection
                .insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.post('/zuko', (req, res) => {
            quotesCollection
                .updateMany(
                    {name: {$in: ['Aang', 'Katara', 'Sokka', 'Toph'] }},
                    {
                        $set: {
                            name: 'Zuko',
                            quote: 'Three years ago today I was banished. I lost it all... I want it back!',
                        },
                    }
                )
                .then(result => {
                    console.log(result)
                })
                .catch(error => console.error(error))
                .finally(() =>{
                    res.redirect('/')
                })
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection
                .deleteOne({ name: req.body.name })
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('Zuko is already pretty silent.')
                    }
                    res.json("Zuko's search came to a halt.")
                })
                .catch(error => console.error(error))
        })

        app.listen(process.env.PORT || PORT, () => {
            console.log(`Connected through the port ${PORT}`)
        })

    })
    .catch(error => console.error(error))

