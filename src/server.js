if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const path = require("path");
require("./db/mongoose");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const indexRouter = require("./routers/index");
const authorRouter = require("./routers/authors");
const bookRouter = require("./routers/books");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 3000;
const staticAssets = path.join(__dirname, "../public");

// const imageMimeTypes = [
//     "images/jpeg",
//     "images/png",
//     "images/gif",
//     "images/jfif"
// ];
//const staticAssets = path.join(__dirname, "../public");
// const upload = multer({
//     //dest: path.join(staticAssets, "pops"),
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, c) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
//             return c(new Error("Pl upload image file only!!"));
//         }
//         c(undefined, true);
//     }
// });

// app.post(
//     "/uploads",
//     upload.single("zed"),
//     async (req, res) => {
//         console.log(req.file.buffer);
//         res.send();
//     },
//     (error, req, res, next) => {
//         res.status(400).send({ error: error.message });
//     }
// );
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static(staticAssets));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());
app.use(indexRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
