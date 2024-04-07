const Router = require('express')
const  router = new Router()
const  HallController = require('../controller/hallController')

router.post('/',)
router.get('/user-:id', HallController.getUserHall )
router.get('/:id', HallController.getHall, )
router.put('/',)
router.delete('/',)

module.exports = router