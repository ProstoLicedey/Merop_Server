const Router = require('express')
const router = new Router()
const  typeController = require('../controller/typeController')

router.post('/')
router.get('/',  typeController.getAll)
router.get('/city',  typeController.getAllCity)
router.get('/rating',  typeController.getAllRating)
router.put('/')
router.delete('/')

module.exports = router