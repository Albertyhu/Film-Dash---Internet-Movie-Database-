var express = require('express');
var router = express.Router();
const MovieController = require('../controller/movieController')
const GenreController = require('../controller/genreController')

router.get('/', MovieController.MovieList);


router.get('/movie/create', MovieController.MovieCreate_Get);
//router.post('/movie/create', MovieController.MovieCreate_Post); 

router.get('/movie/:id', MovieController.MovieDetail);

router.get('/movie/:id/delete', (req, res) => {
    res.send('Not implemented yet.')
});

router.get('/movie/:id/update', (req, res) => {
    res.send('Not implemented yet.')
});

router.get('/genre/:id', GenreController.GenreDetail)

router.get('/genres', GenreController.GenreList)

module.exports = router;