let express = require('express');
let crypto = require('crypto');
let bcrypt = require('bcrypt');
let router = express.Router();
global.sessionCookie = [];
global.password = 'init';

bcrypt.hash(process.env.CMS_PASS, 10, function(err, hash) {
    global.password = hash;
});
router.post('/', function(req, res) {
    let json = req.body;
    if (json.user === "admin" && json.password !== null) {
        bcrypt.compare(json.password, password, function(err, result) {
            if (result === true) {
                let newCookie = crypto.randomBytes(256).toString('hex');
                global.sessionCookie.push(newCookie);
                res.send({ session: newCookie });
            } else {
                res.send({ error: "Unauthorized" });
            }
        });
    } else {
        res.send({ error: "Unauthorized" });
    }
})

router.post('/cookie', function (req, res) {
    setTimeout(() => {
        if (req.body !== undefined && global.sessionCookie.includes(req.body.cookie)) {
            res.send({valid: true});
        } else {
            res.send({valid: false});
        }
    }, 1000);
})

module.exports = router;
