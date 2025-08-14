// routes/quizRoutes.js
const express = require("express");
const router = express.Router();
const questions = require("../data/questions");

// GET quiz questions
router.get("/", (req, res) => {
    res.json(questions);
});

module.exports = router;
