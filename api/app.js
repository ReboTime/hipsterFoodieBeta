let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let cors = require('cors')
let articleRouter = require('./routes/article');
let loginRouter = require('./routes/login');

let app = express();
app.use(cors())
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));

app.use('/article', articleRouter);
app.use('/login', loginRouter);
app.use('/post/*', express.static('ui/build/'));
app.use('/cms', express.static('ui/build/'));
app.use('/', express.static('ui/build/'));
let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Current path : " + process.cwd());
    console.log("Port : " + port);
});
