let express = require('express');
let router = express.Router();

router.get('/', function(req, res) {
  res.send({ title: 'Express' });
});

module.exports = router;
