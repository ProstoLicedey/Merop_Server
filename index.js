require('dotenv').config()
const express = require('express')
const sequelize = require('./models/db')
const models = require('./models/models')
const cors = require('cors')
const router = require('./routes/index')
const cookieParser = require('cookie-parser')
const PORT = process.env.PORT || 5000
const errorMiddleware = require('./middlewares/errorMiddleware')
const path = require("path");
const fileUpload = require('express-fileupload')

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.js');



const app = express()
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, 'http://31.129.57.26:3000', 'http://merop.ru', "http://merop.ru:3000"]
}))
app.use(express.json())
app.use('/api', router)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.status(200).json({message: 'good'})
})

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()

