const mongoose = require('mongoose');

const schema = mongoose.Schema({
    titre :{
        type: String,
    },
    auteur : {
        type: String,
    },
    genre :{
        type: String,
        default: "roman"
    }
})

module.exports = mongoose.model('livre', schema)