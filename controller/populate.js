const Movie = require("../model/Movies");
const Actor = require("../model/Actors");
const Director = require("../model/Directors");
const Genre = require("../model/Genres");
const MovieInstance = require("../model/MovieInstance");
const async = require("async");
const { validationResult } = require("express-validator");
const MovieData = require("../data/movie.json");
const DirectorData = require("../data/director.json");
const ActorData = require("../data/actor.json");
const GenreData = require("../data/genre.json");
const mongoose = require("mongoose");
const { genKey, genNum } = require("../util/randGen");
const { DateTime } = require("luxon");

//Look at the title of each movie
//get the objectID of the following: director, actor, genre from the data base
//put them into the new Movie object
//save movie
const PopulateMovie = (MovieArray) => {
  async.parallel(
    {
      GetDirectors(callback) {
        Director.find({}).exec(callback);
      },
      GetActors(callback) {
        Actor.find({}).exec(callback);
      },
      GetGenres(callback) {
        Genre.find({}).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        console.log(
          "Error in retrieving movie information from database: ",
          err
        );
        return;
      }
      MovieArray.movies.forEach((item) => {
        //get the id of the director
        var directorObj = [];
          item.director.forEach((coDirector) => {
              var DirectorVariable = results.GetDirectors.find((val) => val.name == coDirector);
              if (DirectorVariable != null && DirectorVariable != 'undefined') {
                  directorObj.push(DirectorVariable._id)
                }
        });

        const ActorIDArray = [];
        const GenreIDArray = [];
        try {
            item.actors.forEach((actor) => {
                var ActorVariable = results.GetActors.find((val) => val.name == actor);
                if (ActorVariable != null && ActorVariable != "undefined") {
                    ActorIDArray.push(ActorVariable._id);
                }
          });
        } catch (e) {
          console.log("Error in pushing actors in to array: ", e.message);
        }

        try {
            item.genres.forEach((genre) => {
                var GenreVariable = results.GetGenres.find((val) => val.name == genre);
                if (GenreVariable != null && GenreVariable != "undefined") {
                    GenreIDArray.push(GenreVariable._id);
                }
          });
        } catch (e) {
          console.log("Error in pushing genres in to array: ", e.message);
        }

        const obj = {
          title: item.title,
          year: item.year,
          director: directorObj,
          actors: ActorIDArray,
          genres: GenreIDArray,
          tagline: item.tagline,
          imdb_rating: item.imdb_rating,
          parental_guide: item.parental_guide,
          release_date: item.release_date,
          production_company: item.production_company,
          budget: item.budget,
          runtime: item.runtime,
          poster: item.poster,
        };
        const newMovie = new Movie(obj);
        newMovie.save((err) => {
          if (err) {
            console.log("Error in uploading movie.", err);
            return;
          } else {
            console.log(`Successfully uploaded ${item.title} into database.`);
          }
        });
      });
    }
  );
};

const PopulateDirector = (DirectorArray) => {
  DirectorArray.directors.forEach((item) => {
    const newDirector = new Director(item);
    newDirector.save((err) => {
      if (err) {
        console.log("Error in uploading director: ", err);
        return;
      } else {
        console.log("Directors are successfully uploaded.");
      }
    });
  });
};

const PopulateActor = (ActorArray) => {
  ActorArray.actors.forEach((item) => {
    const newActor = new Actor(item);
    newActor.save((err) => {
      if (err) {
        console.log("Error in uploading Actor: ", err);
        return;
      }
    });
  });
};

const PopulateGenre = () => {
  GenreData.genres.forEach((item) => {
    const newGenre = new Genre(item);
    newGenre.save((err) => {
      if (err) {
        console.log("Error in uploading Genre: ", err);
        return;
      } else {
        console.log("Genres successfully uploaded");
      }
    });
  });
};

const GenerateMovieInstanceOfMany = (num) => {
  const InstanceStatus = ["Available", "Maintenance", "Loaned", "Reserved"];
  const InstanceFormat = ["DVD", "Blue-ray", "Video Tape", "Film Reel"];
  Movie.find({}, (err, result) => {
    if (err) {
      console.log(
        "Error in retrieving movies for generating movie instances: ",
        err
      );
      return;
    }
    for (var i = 0; i < num; i++) {
      const status = InstanceStatus[genNum(InstanceStatus.length)];
      var newDate = null;
      if (status == "Loaned") {
        newDate = new Date(
          new Date() + Math.floor(Math.random() * 10000000000)
        );
      }

      const obj = {
        movie: result[genNum(result.length)]._id,
        status: status,
        NumberOfDiscs: genNum(3) + 1,
        Sku: genKey(10),
        physical_format: InstanceFormat[genNum(InstanceFormat.length)],
        due_back:
          newDate != null
            ? DateTime.fromJSDate(newDate).toFormat("yyyy-MM-dd")
            : "",
      };

      const newMovieInstance = new MovieInstance(obj);
      newMovieInstance.save((err) => {
        if (err) {
          console.log("Error in uploading movie instance: ", err);
          return;
        } else {
          console.log("Movie instance successfully uploaded");
        }
      });
    }
  });
};

const GenerateMovieInstanceOfOne = (Title, num) => {
    const InstanceStatus = ["Available", "Maintenance", "Loaned", "Reserved"];
    const InstanceFormat = ["DVD", "Blue-ray", "Video Tape", "Film Reel"];
    Movie.findOne({title: Title}, (err, result) => {
        if (err) {
            console.log(
                "Error in retrieving movies for generating movie instances: ",
                err
            );
            return;
        }
        for (var i = 0; i < num; i++) {
            const status = InstanceStatus[genNum(InstanceStatus.length)];
            var newDate = null;
            if (status == "Loaned") {
                newDate = new Date(
                    new Date() + Math.floor(Math.random() * 10000000000)
                );
            }

            const obj = {
                movie: result._id,
                status: status,
                NumberOfDiscs: genNum(3) + 1,
                Sku: genKey(10),
                physical_format: InstanceFormat[genNum(InstanceFormat.length)],
                due_back:
                    newDate != null
                        ? DateTime.fromJSDate(newDate).toFormat("yyyy-MM-dd")
                        : "",
            };

            const newMovieInstance = new MovieInstance(obj);
            newMovieInstance.save((err) => {
                if (err) {
                    console.log("Error in uploading movie instance: ", err);
                    return;
                } else {
                    console.log(`Movie instances of ${Title} are successfully uploaded`);
                }
            });
        }
    });
};

const DeleteMovieInstances = (ID) => {
    try {
        MovieInstance.deleteMany({ movie: ID }).then(function () {
            console.log("Movie instances successfully deleted")
        })
    } catch (e) {
        console.log("Error in delete movie instances: ", e)
    }
}

const CreateRatatouille = () => {
    const obj = {
        title: "Ratatouille",
        year: 2007,
        director: ['63d10a9f605a01fcb0a578f1'],
        actors: ['63d10649f27cea2a803b9f98'],
        genres: ['63d1081383be1610779032a3'],
        tagline: "He is a chef",
        imdb_rating: 8.1,
        parental_guide: "G",
        production_company: "Pixar",
        release_date: "2023-02-03",
        budget: "$150 million",
        runtime: 111,
        poster: "https://lumiere-a.akamaihd.net/v1/images/p_ratatouille_19736_0814231f.jpeg",
    };
    const newMovie = new Movie(obj)
    newMovie.save((err) => {
        if (err) {
            console.log("Error in saving movie to the database: ", err);
            return next(err);
        }
        console.log("Dummy movie created")
    })
}

exports.populateDatabase = (req, res) => {
    async.parallel(
        [
            //() => PopulateMovie(MovieData),
            //()=>PopulateActor(ActorData),
            //() => PopulateDirector(DirectorData),
            //PopulateGenre,
            //()=>GenerateMovieInstanceOfMany(80)
            //() => GenerateMovieInstanceOfOne("Ratatouille", 2)
            //() => DeleteMovieInstances("63dcd2a317ad34548f793c56"),
            //() => CreateRatatouille(),
    ],
    function (err, results) {
      if (err) {
        console.log("FINAL ERR: " + err);
      } else {
        console.log("Database is successfully populated");
      }
      // All done, disconnect from database
      mongoose.connection.close();
    }
  );
};
