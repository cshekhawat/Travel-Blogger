const mongoose = require("mongoose");

const bookSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String
            //trim: true
        },
        publishedDate: {
            type: Date
            //required: true
        },
        pageCount: {
            type: Number
            //required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
            //required: true
        },
        coverImage: {
            type: Buffer
            // required: true
        },
        coverImageType: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Author"
        }
    },
    {
        timestamps: true
    }
);
bookSchema.virtual("coverImagePath").get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${
            this.coverImageType
        };charset=utf-8;base64,${this.coverImage.toString("base64")}`;
    }
});
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
