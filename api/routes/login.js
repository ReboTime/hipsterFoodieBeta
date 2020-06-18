let express = require('express');
let crypto = require('crypto');
let bcrypt = require('bcrypt');
let router = express.Router();
global.sessionCookie = 'initCookie';
global.password = 'init';
bcrypt.hash("myCMSPassw0rd", 10, function(err, hash) {
    password = hash;
});
router.get('/', function(req, res) {
    let json = req.body;
    if (json.user === "admin" && json.password !== null) {
        bcrypt.compare(json.password, password, function(err, result) {
            if (result === true) {
                global.sessionCookie = crypto.randomBytes(256).toString('hex');
                res.send({ session: sessionCookie });
            } else {
                res.send({ error: "Unauthorized" });
            }
        });
    } else {
        res.send({ error: "Unauthorized" });
    }
});

module.exports = router;
