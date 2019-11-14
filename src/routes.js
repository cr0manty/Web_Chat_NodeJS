module.exports = function (app) {
    app.get('/', function (req, res) {
        user = req.user;
        res.render('index', {
            user: req.user,
            is_auth: isAuthenticated()
        });
    });

    app.get('/chat', function (req, res) {
        res.render('chat', {
            user: req.user,
            is_auth: isAuthenticated()
        });
    });

    app.get('/signin', function (req, res) {
        res.render('chat', {
            user: req.user,
            is_auth: isAuthenticated()
        });
    });

    app.get('/signup', function (req, res) {
        res.render('chat', {
            user: req.user,
            is_auth: isAuthenticated()
        });
    });

    app.get('/logout', function (req, res) {
        res.render('chat', {
            user: req.user,
            is_auth: isAuthenticated()
        });
    });

    function isAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next(null, true);
        }
        res.redirect('/signin')
    }
}
