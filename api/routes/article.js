let express = require('express');
let fs = require('fs');
let router = express.Router();
let articlesFile = '../ui/public/articles.json';


function writeArticles(json) {
    fs.unlink(articlesFile, function (err) {
        console.log(err);
    });
    fs.appendFile(articlesFile, JSON.stringify(json), function(err) {
        if (err) return console.log(err);
        console.log("File was updated!");
    });
}

router.post('/', function(req, res) {
    let session = req.cookies.hfbSession;
    if (session !== global.sessionCookie) {
        res.send({error: 'Unauthorized'});
        return;
    }
    let article = req.body;
    let json;
    fs.readFile(articlesFile, 'utf8', function (err,data) {
        if (err) {
            json = { articles: [] };
            article.id = 1;
            json.articles.push(article);
            writeArticles(json);
            return;
        }
        json = JSON.parse(data);
        if (article.id === null) {
            article.id = json.articles.length + 1;
            json.articles.push(article);
        } else {
            json.articles = json.articles.map(a => a.id === article.id ? article : a);
        }
        writeArticles(json);
        console.log(json);
    });
    res.send(article);
});

module.exports = router;
