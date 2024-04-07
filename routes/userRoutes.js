const Router = require('express')
const  router = new Router()
const  userController = require('../controller/userController')


router.post('/registration', userController.registration )
router.post('/login', userController.login )
router.post('/logout', userController.logout )
//router.get('/auth', userController.)
router.delete('/delete', userController.delete)
router.put('/update/:id', userController.update)
router.get('/activate/:link', userController.activate )
router.get('/refresh',  userController.refresh)
router.post('/receiveCode',  userController.receiveCode)
router.post('/inputCode',  userController.inputCode)
router.post('/updatePass',  userController.updatePass)
router.get('/:id', userController.getOne )

module.exports = router