let express = require('express');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let indexRouter = require('./routes/index');
let articleRouter = require('./routes/article');
let loginRouter = require('./routes/login');

let app = express();
app.use(cookieParser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/article', articleRouter);
app.use('/login', loginRouter);

app.listen(3000);
