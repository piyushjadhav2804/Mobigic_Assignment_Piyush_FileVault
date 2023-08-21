module.exports.home = (req, res) => {
    return res.render('home', {
        title: "Mobigic | Home Page"
    });
}