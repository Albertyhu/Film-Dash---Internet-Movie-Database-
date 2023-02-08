
const Genres = require('../model/Genres')

exports.ContactForm_Get = (req, res, next) => {
    Genres.find({})
        .exec((err, result) => {
            if (err) {
                return next(err)
            }
            res.render('contact', {
                title: "What's on your mind? Express yourself through email.",
                genre_list: result,
                logo: "../images/FilmDashLogo.png",
                burgerMenu: "../../icon/hamburger_menu_white.png",
                error: [],
            })
        })

}
exports.ContactForm_Post = [];  