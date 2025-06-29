const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config/serverConfig')
const app = express();
const { createChannel } = require('./utils/messageQueues');
const apiRoutes = require('./routes/index')
const db = require('./models/index')
const setupAndStartServer = async() => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));
    app.use('/api',apiRoutes);
    await createChannel();
    app.listen(PORT, () => {
      // if(process.env.DB_SYNC) {
        //     db.sequelize.sync({alter : true})
        // }
        console.log(`Server is started at Port ${PORT}`);
    })
}

setupAndStartServer();