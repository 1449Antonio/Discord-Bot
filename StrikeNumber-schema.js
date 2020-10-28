const mongoose = require('mongoose')

const reqString = {

    type: String,
    required: true,
}

const StrikeNumberSchema = mongoose.Schema({
    _id: reqString,

    StrikeCount: {
        type: Array,
        required: true,
    }


})

module.exports = mongoose.model('Strike-Count', StrikeNumberSchema)