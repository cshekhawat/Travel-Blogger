const express = require("express");
const Author = require("../models/Author");
const router = new express.Router();

// router.post("/authors", async (req, res) => {
//     const user = new Author(req.body);

//     try {
//         await user.save();
//         res.status(201).send({ user, token });
//     } catch (e) {
//         res.status(400).send(e);
//     }
// });

router.get("/allAuthors", async (req, res) => {
    try {
        res.render("authors");
    } catch (e) {
        res.status(500).send();
    }
});

router.post("/add", async (req, res) => {
    const author = new Author({
        name: req.body.name,
        age: 10,
        email: `${req.body.name}@outlook.com`
    });
    author.save((error, newAuthor) => {
        if (error) {
            res.render("/", {
                author: author,
                errorMessage: "Error creating author!"
            });
        } else {
            res.redirect("/");
        }
    });
    // try {
    //     res.send(req.body.name);
    // } catch (e) {
    //     res.status(500).send();
    // }
});

// router.get("/authors/:id", async (req, res) => {
//     const _id = req.params.id;

//     try {
//         const user = await User.findById(_id);

//         if (!user) {
//             return res.status(404).send();
//         }

//         res.send(user);
//     } catch (e) {
//         res.status(500).send();
//     }
// });

module.exports = router;
