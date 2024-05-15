const Router = require('express')
const  router = new Router()
const  userController = require('../controller/userController')


/**
 * Создать нового пользователя.
 * @swagger
 * /api/user/registration:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Пользователи]
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Параметры для создания нового пользователя.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Электронная почта нового пользователя.
 *             password:
 *               type: string
 *               description: Пароль нового пользователя.
 *             name:
 *               type: string
 *               description: Имя нового пользователя.
 *             surname:
 *               type: string
 *               description: Фамилия нового пользователя.
 *             birthday:
 *               type: string
 *               format: date
 *               description: День рождения нового пользователя (в формате YYYY-MM-DD).
 *             role:
 *               type: string
 *               description: Роль нового пользователя.
 *             creatorId:
 *               type: integer
 *               description: Идентификатор создателя нового пользователя (если применимо).
 *     responses:
 *       200:
 *         description: Успешная регистрация. Возвращает данные нового пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Идентификатор нового пользователя.
 *                 email:
 *                   type: string
 *                   description: Электронная почта нового пользователя.
 *                 name:
 *                   type: string
 *                   description: Имя нового пользователя.
 *                 surname:
 *                   type: string
 *                   description: Фамилия нового пользователя.
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   description: День рождения нового пользователя.
 *                 role:
 *                   type: string
 *                   description: Роль нового пользователя.
 *       400:
 *         description: Ошибка запроса. Возвращается в случае невалидных данных.
 *       500:
 *         description: Ошибка сервера.
 */


router.post('/registration', userController.registration )
router.post('/login', userController.login )
router.post('/logout', userController.logout )
router.delete('/delete', userController.delete)
router.put('/update/:id', userController.update)
router.put('/block', userController.block )
router.get('/activate/:link', userController.activate )
router.get('/refresh',  userController.refresh)
router.post('/receiveCode',  userController.receiveCode)
router.post('/inputCode',  userController.inputCode)
router.post('/updatePass',  userController.updatePass)
router.get('/admin', userController.getForAdmin )
router.get('/:id', userController.getOne )


module.exports = router