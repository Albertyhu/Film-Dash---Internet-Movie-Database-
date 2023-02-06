var express = require("express");
var router = express.Router();
const MovieController = require("../controller/movieController");
const GenreController = require("../controller/genreController");
const DirectorController = require('../controller/directorController');
const ActorController = require("../controller/actorController");
const MovieInstanceController = require('../controller/movieInstanceController')
//Movie
router.get("/", MovieController.MovieList);

//router.get('/', (req, res, next) => {
//    res.send('Under construction')
//})

router.get("/movie/create", MovieController.MovieCreate_Get);

router.post("/movie/create", MovieController.MovieCreate_Post);

router.get("/movie/:id", MovieController.MovieDetail);

router.get("/movie/:id/delete", MovieController.Delete_Get);

router.post("/movie/:id/delete", MovieController.Delete_Post);

router.get("/movie/:id/update", MovieController.Update_Get);

router.post("/movie/:id/update", MovieController.Update_Post);

//Genre
router.get("/genre/:id", GenreController.GenreDetail);

router.get("/genres", GenreController.GenreList);

router.get("/genre/create", GenreController.GenreCreate_Get);

router.post("/genre/create", GenreController.GenreCreate_Get);

//router.get('/genre/:id/delete', GenreController.Delete_Get);

//router.post('/genre/:id/delete', GenreController.Delete_Post);

//router.get('/genre/:id/update', GenreController.Update_Get);

//router.post('/genre/:id/update', GenreController.Update_Post);

//Director


router.get('/directors', DirectorController.DirectorList)

router.get('/director/create', DirectorController.DirectorCreate_Get);

router.post('/director/create', DirectorController.DirectorCreate_Post);

router.get('/director/:id', DirectorController.DirectorDetail)

router.get('/director/:id/delete', DirectorController.Delete_Get);

router.post('/director/:id/delete', DirectorController.Delete_Post);

router.get('/director/:id/update', DirectorController.Update_Get);

router.post('/director/:id/update', DirectorController.Update_Post);

//Actor


//router.get('/actors', ActorController.ActorList)

//router.get('/actor/create', ActorController.ActorCreate_Get);

//router.post('/actor/create', ActorController.ActorCreate_Post); 

//router.get('/actor/:id', ActorController.ActorDetail)

//router.get('/actor/:id/delete', ActorController.Delete_Get);

//router.post('/actor/:id/delete', ActorController.Delete_Post);

//router.get('/actor/:id/update', ActorController.Update_Get);

//router.post('/actor/:id/update', ActorController.Update_Post);

//Movie Instances

//router.get('/movieinstances', MovieInstanceController.MovieInstanceList)

//router.get('/movieinstance/create', MovieInstanceController.MovieInstanceCreate_Get);

//router.post('/movieinstance/create', MovieInstanceController.MovieInstanceCreate_Post)

//router.get('/movieinstance/:id', MovieInstanceController.MovieInstanceDetail)

//router.get('/movieinstance/:id/delete', MovieInstanceController.Delete_Get);

//router.post('/movieinstance/:id/delete', MovieInstanceController.Delete_Post);

//router.get('/movieinstance/:id/update', MovieInstanceController.Update_Get);

//router.post('movieinstance/:id/update', MovieInstanceController.Update_Post);

module.exports = router;
