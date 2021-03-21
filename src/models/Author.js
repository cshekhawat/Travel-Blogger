const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Email is invalid')
        //     }
        // }
    },
    age: {
        type: Number,
        default: 0
        // validate(value) {
        //     if (value < 0) {
        //         throw new Error('Age must be a postive number')
        //     }
        // }
    }
});

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
