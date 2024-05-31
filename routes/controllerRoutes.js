const Router = require('express')
const  router = new Router()
const  ControllerController = require('../controller/controllerController')

/**
 * @swagger
 * /:
 *   get:
 *     summary: Получить всех контроллеров
 *     description: Возвращает список всех контроллеров, связанных с указанным создателем.
 *     tags: [Контроллеры]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID создателя контроллеров
 *     responses:
 *       200:
 *         description: Список контроллеров успешно получен
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID контроллера
 *                     example: 1
 *                   controllerId:
 *                     type: integer
 *                     description: ID пользователя контроллера
 *                     example: 123
 *                   email:
 *                     type: string
 *                     description: Email пользователя контроллера
 *                     example: example@example.com
 *                   name:
 *                     type: string
 *                     description: ФИО пользователя контроллера
 *                     example: Иванов Иван
 *       400:
 *         description: Ошибка в запросе
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Описание ошибки
 *                   example: Bad Request
 */

router.get('/', ControllerController.getAll )
router.get('/:id', ControllerController.getController, )
router.put('/',)
router.delete('/', ControllerController.delete)

module.exports = router