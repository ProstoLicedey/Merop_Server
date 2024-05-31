const Router = require('express')
const router = new Router()
const  marketingController = require('../controller/marketingController')

/**
 * @swagger
 * /:
 *   delete:
 *     summary: Удалить заявку на рекламу
 *     description: Удаляет заявку на рекламу по указанному ID.
 *     tags: [Реклама]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID заявки на рекламу
 *     responses:
 *       200:
 *         description: Заявка успешно удалена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешном удалении
 *                   example: Заявка с id 1 успешно удалена
 *       400:
 *         description: Ошибка в запросе или заявка не найдена
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Описание ошибки
 *                   example: Заявка не найдено
 */

router.post('/', marketingController.create)
router.get('/',  marketingController.getAll)
router.get('/creator/:id', marketingController.getCreator )
router.get('/admin', marketingController.getAdmin )
router.get('/getEvent/:id', marketingController.getEvent )
router.put('/:id', marketingController.statusUpdate)
router.delete('/', marketingController.delete)

module.exports = router