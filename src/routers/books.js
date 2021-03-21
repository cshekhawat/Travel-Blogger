const express = require("express");
const Book = require("../models/Book");
const Author = require("../models/Author");
const path = require("path");
const multer = require("multer");
const router = new express.Router();

const imageMimeTypes = [
    "images/jpeg",
    "images/png",
    "images/gif",
    "images/jfif"
];
//const staticAssets = path.join(__dirname, "../public");
const upload = multer({
    dest: path.join("public", Book.coverImageBasePath),
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

router.get("/", async (req, res) => {
    try {
        res.render("books");
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/new", async (req, res) => {
    renderNewPage(res, new Book());
});

router.post("/", async (req, res) => {
    //const filename = req.file != null ? req.file.filename : null;
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishedDate: new Date(req.body.publishedDate),
        pageCount: req.body.pageCount,
        description: req.body.description
        // coverImageName: filename
    });
    // console.log(req.body.cover);
    // saveCover(book, req.body.cover);
    book.save((error, newBook) => {
        if (error) {
            renderNewPage(res, book, true);
        } else {
            res.redirect("books");
        }
    });

    // try {
    //     console.log(`byee -${book}`);
    //     const newbook = await book.save();
    //     console.log(`brass`);
    //     res.redirect("books");
    // } catch {
    //     renderNewPage(res, book, true);
    // }
});

renderNewPage = async (res, book, hasError = false) => {
    try {
        const authors = await Author.find({});
        const params = { authors, book };
        if (hasError) {
            params.errorMessage = "Error regitering book!";
        }
        res.render("books/new", params);
    } catch (error) {
        res.redirect("/books");
    }
};

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    console.log(coverEncoded);
    //const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, "base64");
        book.coverImageType = cover.type;
    }
}

module.exports = router;
