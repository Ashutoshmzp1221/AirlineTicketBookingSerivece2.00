const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config/configServer')
const app = express();
const apiRoutes = require('./routes/index')

const setupAndStartServer = () => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));
    app.use('/api',apiRoutes);
    app.listen(PORT, () => {
        console.log(`Server is started at Port ${PORT}`);
    })
}

setupAndStartServer();