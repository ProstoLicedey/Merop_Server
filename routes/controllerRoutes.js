const Router = require('express')
const  router = new Router()
const  ControllerController = require('../controller/controllerController')

router.post('/',)
router.get('/', ControllerController.getAll )
router.get('/:id', ControllerController.getController, )
router.put('/',)
router.delete('/', ControllerController.delete)

module.exports = router