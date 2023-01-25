var express = require('express');
var router = express.Router();
const MovieController = require('../controller/movieController')


router.get('/', MovieController.MovieList);

router.get('/:id', (req, res) => {
    res.render("movie_detail", MovieController.MovieDetail)
});

router.get('/movie/create', (req, res) => {
    res.render('Not implemented yet.')
});

router.get('/movie/:id/delete', (req, res) => {
    res.render('Not implemented yet.')
});

router.get('/movie/:id/update', (req, res) => {
    res.render('Not implemented yet.')
});

module.exports = router;