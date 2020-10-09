const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const axios = require('axios')
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({
  extended: true
}))

var cardsData = {};


mongoose.connect('mongodb://192.168.99.100:27017/my-db', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    auth: {
        "authSource": "admin"
    },
    user: "username",
    pass: "password"
});

const cards_db = mongoose.connection;

const CardSchema = new mongoose.Schema({
    id: Number,
    type: String,
    value: mongoose.Schema.Types.Mixed 
})

const Card = mongoose.model('PokemonCard', CardSchema);

cards_db.on('error', console.error.bind(console, 'connection error:'));

cards_db.once('open', function() {
    app.listen(3000);
});

app.get('/:pokemon', function (req, res) {
    if (req.params.pokemon in cardsData){
        res.send(cardsData[req.params.pokemon]);
    }else{
        let pokeApi_link = "https://pokeapi.co/api/v2/pokemon/" + req.params.pokemon;
        axios.get(pokeApi_link).then(response => {
            cardsData[req.params.pokemon] = response.data;
            res.send(response.data);
        })
        .catch(() => {
            res.send({"error": "Pokemon not found"});     
        })
    }
})

app.post('/', function (req, res) {
    let newCard = new Card({id: req.query.ID, type: req.query.card_type, value: req.query.card_value})
    newCard.save(function (err, newCard) {
        if (err) return console.error(err);
      })
        res.send("Card stored");    
    })

app.get('/', function (req, res) {
    if (req.query.ID == "all"){
        Card.find({}, {'_id': 0, 'id': 1, 'type': 1, 'value': 1}, function (err, cards) {
            if (err) return console.error(err);
            res.send(cards);
        })
    }else {
        Card.find({'id': req.query.ID}, {'_id': 0, 'id': 1, 'type': 1, 'value': 1}, function (err, card) {
            if (err) return console.error(err);
            if (card[0] != undefined){
                res.send({'type': card[0].type, 'value': card[0].value});}
            else{
                res.send({});
            }
        })
    }
})

app.put('/:ID', function (req, res) {
    Card.update({id: req.params.ID}, {value: req.body.value}, function (err, card) {
        if (err) {
            res.send("Not in cards");
        } else{
            res.send("Updated");
        }
    });    
})

app.delete('/', function (req, res) {
    Card.deleteOne({id: req.query.ID}, function (err) {
        if(err) {res.send("Not in cards");} else{
            res.send({});
        }
    });    
})

