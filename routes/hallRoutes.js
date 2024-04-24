const Router = require('express')
const  router = new Router()
const  HallController = require('../controller/hallController')

router.get('/update/:id', HallController.getUpdate, )
router.post('/', HallController.createHall)
router.get('/user-:id', HallController.getUserHall )
router.get('/:id', HallController.getHall)
router.put('/:id', HallController.update)
router.delete('/', HallController.deleteHall,)

module.exports = router