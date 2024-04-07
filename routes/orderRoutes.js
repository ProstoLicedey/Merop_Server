const Router = require('express')
const  router = new Router()
const  orderController = require('../controller/orderController')

router.post('/', orderController.create)
router.get('/', )
router.get('/getTicket/:id',  orderController.getTicket)
router.get('/user/:id', orderController.getOrders )
router.get('/buyer/:id', orderController.getByuers )
router.delete('/',)

module.exports = router