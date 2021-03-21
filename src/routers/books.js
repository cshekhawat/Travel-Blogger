const express = require("express");
const Book = require("../models/Book");
const Author = require("../models/Author");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const router = new express.Router();
const imageMimeTypes = [
    "images/jpeg",
    "images/png",
    "images/gif",
    "images/jfif"
];
/* ----- Use of Multer for file uploads

const staticAssets = path.join(__dirname, "../../public");
const upload = multer({
    //dest: path.join(staticAssets, "pops"),
    limits: {
        fileSize: 8000000
    },
    fileFilter(req, file, c) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif|gif)$/)) {
            return c(new Error("Pl upload image file only!!"));
        }
        c(undefined, true);
    }
});
*/

router.get("/", async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title != "") {
        query = query.regex("title", new RegExp(req.query.title, "i"));
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query = query.lte("publishDate", req.query.publishedBefore);
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query = query.gte("publishDate", req.query.publishedAfter);
    }
    try {
        const books = await query.exec();
        console.log(`BROOKS --- ${books}`);
        res.render("books", {
            books: books,
            searchOptions: req.query
        });
    } catch {
        res.redirect("/");
    }
});

router.get("/:id/cover", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book || !book.coverImage) {
            throw new Error();
        }
        res.set("Content-Type", "image/png");
        res.send(book.coverImage);
    } catch (e) {
        res.status(500).send();
    }
});

router.get("/new", async (req, res) => {
    renderNewPage(res, new Book());
});

// upload.single("cover"),
router.post(
    "/",
    async (req, res) => {
        // const formatImage = await sharp(req.file.buffer)
        //     .png()
        //     .resize({ width: 398, height: 589 })
        //     .toBuffer();
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            publishedDate: new Date(req.body.publishedDate),
            pageCount: req.body.pageCount,
            description: req.body.description
            // coverImage: formatImage
        });
        saveCover(book, req.body.cover);
        book.save((error, newBook) => {
            if (error) {
                renderNewPage(res, book, true);
            } else {
                res.redirect("books");
            }
        });
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

const saveCover = async (book, coverEncoded) => {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    console.log(cover);
    if (cover != null) {
        book.coverImage = new Buffer.from(cover.data, "base64");
        book.coverImageType = cover.type;
    }
};

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

module.exports = router;
