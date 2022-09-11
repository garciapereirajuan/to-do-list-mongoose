const mongoose = require('mongoose')
const app = require('./app')
const { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER } = require('./config')

mongoose.connect(
    `mongodb://${IP_SERVER}:${PORT_DB}/to-do-list-mongoose`,
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('La conexión a la base de datos es correcta.')

            app.listen(PORT_SERVER, () => {
                console.log('#########################')
                console.log('######## API REST #######')
                console.log('#########################')
                console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`)
            })
        }
    }    
)