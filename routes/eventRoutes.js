const Router = require('express')
const  router = new Router()
const  eventController = require('../controller/eventControler')

router.get('/creator', eventController.getCreator)
router.post('/', eventController.create)
router.get('/', eventController.getAll )
router.get('/:id', eventController.getOne )
router.delete('/', eventController.delete )

router.delete('/',)

module.exports = router