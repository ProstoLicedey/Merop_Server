const Router = require('express')
const router = new Router()
const  marketingController = require('../controller/marketingController')

router.post('/', marketingController.create)
router.get('/',  marketingController.getAll)
router.get('/creator/:id', marketingController.getCreator )
router.get('/admin', marketingController.getAdmin )
router.get('/getEvent/:id', marketingController.getEvent )
router.put('/:id', marketingController.statusUpdate)
router.delete('/', marketingController.delete)

module.exports = router