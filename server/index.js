const mongoose = require('mongoose')
const app = require('./app')
const { API_VERSION, IP_SERVER, PORT_DB, PORT_SERVER, PASSWORD } = require('./config')

mongoose.connect(
    `mongodb+srv://jgp95todolist:${PASSWORD}@todolist.bu7dmgr.mongodb.net/?retryWrites=true&w=majority`,
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('La conexión a la base de datos es correcta.')

            app.listen(PORT_SERVER, () => {
                console.log('##################################')
                console.log('####### SERVER - TO DO LIST ######')
                console.log('##################################')
                console.log(`http://${IP_SERVER}:${PORT_SERVER}/api/${API_VERSION}`)
            })
        }
    }    
)