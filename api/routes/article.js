let express = require('express');
let fs = require('fs');
let router = express.Router();
let articlesFile = '../ui/public/articles.json';
let imageDir = '../ui/public/images/';
let rimraf = require('rimraf');

function writeArticles(json) {
    fs.unlink(articlesFile, function (err) {
        if (err) return console.log(err);
        fs.appendFile(articlesFile, JSON.stringify(json), function(err) {
            if (err) return console.log(err);
            console.log("File was updated!");
        });
    });

}

router.post('/', function(req, res) {
    let session = req.get('session');
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
            res.send(article);
            return;
        }
        json = JSON.parse(data);
        if (article.id === null || article.id === 0) {
            article.id = json.articles.length + 1;
            json.articles.push(article);
        } else {
            json.articles = json.articles.map(a => a.id === article.id ? article : a);
        }
        writeArticles(json);
        res.send(json);
    });
});

router.post('/addImage', function(req, res) {
    let session = req.get('session');
    if (session !== global.sessionCookie) {
        res.send({error: 'Unauthorized'});
        return;
    }
    let imageData = req.body;
    let fileName = req.get('fileName');
    let articleId = req.get('articleId');
    if (!fs.existsSync(imageDir + articleId)) {
        fs.mkdirSync(imageDir + articleId);
    }
    saveImage(imageDir + articleId + '/' + fileName, imageData.data);
    res.send({ result: "OK"});
});

function saveImage(file, data) {
    fs.writeFile(file,  Buffer.from(data.replace(/.*base64,/,""), "base64"), 'utf8', () => {});
}

router.post('/clearImages', function (req, res) {
    let session = req.get('session');
    if (session !== global.sessionCookie) {
        res.send({error: 'Unauthorized'});
        return;
    }
    let articleId = req.get('articleId');
    rimraf(imageDir + articleId, () => {
        res.send({ result: "OK"});
    });
});

module.exports = router;
