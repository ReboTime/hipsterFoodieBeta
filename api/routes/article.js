let express = require('express');
let router = express.Router();
let imageDir = 'images/';
const path = require('path');
let AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
let s3 = new AWS.S3({apiVersion: '2006-03-01'});
let bucket = 'hipster-foodie-beta';

router.post('/', function(req, res) {
    let session = req.get('session');
    if (!global.sessionCookie.includes(session)) {
        res.send({error: 'Unauthorized'});
        return;
    }
    let article = req.body;
    let json;
    let jsonParams = {
        Bucket: bucket,
        Key: 'articles.json',
    }
    s3.getObject(jsonParams, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            json = {articles: []};
        } else {
            json = JSON.parse(data.Body.toString());
        }
        if (article.id === null || article.id === 0) {
            article.id = json.articles.length + 1;
            json.articles.push(article);
        } else {
            json.articles = json.articles.map(a => a.id === article.id ? article : a);
        }

        jsonParams.ContentType = 'application/json; charset=utf-8';
        jsonParams.ACL = 'public-read';
        jsonParams.Body = JSON.stringify(json);
        s3.upload(jsonParams, function (err) {
            if (err) console.log(err);
            res.send(json);
        })
    });
});

router.post('/addImage', function(req, res) {
    let session = req.get('session');
    if (!global.sessionCookie.includes(session)) {
        res.send({error: 'Unauthorized'});
        return;
    }
    let imageData = req.body;
    let fileName = req.get('fileName');
    let articleId = req.get('articleId');
    saveImage(imageDir + articleId + '/' + fileName, imageData.data).then(() => res.send({ result: "OK"}));
});

router.post('/deleteImage', function (req, res) {
    let session = req.get('session');
    if (!global.sessionCookie.includes(session)) {
        res.send({error: 'Unauthorized'});
        return;
    }
    let fileName = req.get('fileName');
    let articleId = req.get('articleId');
    deleteImage(imageDir + articleId + '/' + path.basename(fileName));
});

async function saveImage(file, data) {
    let uploadParams = {
        Bucket: bucket,
        Key: file,
        ContentType: 'image/jpeg',
        ACL: "public-read",
        Body: Buffer.from(data.replace(/.*base64,/,""), "base64")
    };

    await s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}

function deleteImage(file) {
    let deleteParams = {
        Bucket: bucket,
        Key: file,
    };

    s3.deleteObject(deleteParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Delete Success", data.Location);
        }
    });
}


module.exports = router;
