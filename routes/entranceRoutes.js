const Router = require('express')
const  router = new Router()
const  entanceController = require('../controller/entranceController')

router.post('/', entanceController.createEntrance)
router.get('/user/:id', entanceController.getEntenceHallUser )
router.get('/option/:id', entanceController.getFromEvent )
router.get('/:id', entanceController.getByID )
router.put('/',)
router.delete('/',)

module.exports = router