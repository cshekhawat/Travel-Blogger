const express = require("express");
const Book = require("../models/Book");
const Author = require("../models/Author");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");
const router = new express.Router();

// const imageMimeTypes = [
//     "images/jpeg",
//     "images/png",
//     "images/gif",
//     "images/jfif"
// ];
const staticAssets = path.join(__dirname, "../../public");
// const upload = multer({
//     dest: path.join(staticAssets, "pops"),
//     fileFilter: (req, file, callback) => {
//         callback(null, imageMimeTypes.includes(file.mimetype));
//     }
// });

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

router.get("/", async (req, res) => {
    try {
        res.render("books");
    } catch (e) {
        res.status(500).send();
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

router.post(
    "/",
    upload.single("cover"),
    async (req, res) => {
        const formatImage = await sharp(req.file.buffer)
            .png()
            .resize({ width: 398, height: 589 })
            .toBuffer();
        const book = new Book({
            title: req.body.title,
            author: req.body.author,
            publishedDate: new Date(req.body.publishedDate),
            pageCount: req.body.pageCount,
            description: req.body.description,
            coverImage: formatImage
        });
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
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

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
