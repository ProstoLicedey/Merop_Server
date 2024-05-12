const Router = require('express')
const  router = new Router()
const  ticketController = require('../controller/ticketController')


router.post('/',)
router.get('/:number', ticketController.getTicket )
router.get('/checked/:number', ticketController.Checked )
router.get('/refunds/:number', ticketController.Refunds )
router.get('/:id', ticketController.getTicket )
router.put('/',)
router.delete('/', ticketController.delete)

module.exports = router