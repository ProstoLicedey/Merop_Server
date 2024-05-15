const Router = require('express')
const  router = new Router()
const  ticketController = require('../controller/ticketController')

/**
 * Получить билет по его номеру.
 * @swagger
 * /api/ticket/{number}:
 *   get:
 *     summary: Получить билет по его номеру
 *     tags: [Билеты]
 *     parameters:
 *       - name: number
 *         in: path
 *         description: Номер билета.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idUser
 *         in: query
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о запрашиваемом билете.
 *         schema:
 *           $ref: '#/components/schemas/Ticket'
 *       403:
 *         description: Недопустимый запрос или доступ запрещен.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Пометить билет как проверенный.
 * @swagger
 * /api/ticket/checked/{number}:
 *   get:
 *     summary: Пометить билет как проверенный
 *     tags: [Билеты]
 *     parameters:
 *       - name: number
 *         in: path
 *         description: Номер билета.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idUser
 *         in: query
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает обновленную информацию о билете.
 *         schema:
 *           $ref: '#/components/schemas/Ticket'
 *       403:
 *         description: Доступ запрещен.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Запрос на возврат билета.
 * @swagger
 * /api/ticket/refunds/{number}:
 *   get:
 *     summary: Запрос билета для возврата
 *     tags: [Билеты]
 *     parameters:
 *       - name: number
 *         in: path
 *         description: Номер билета.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о возврате билета.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение о возврате билета.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Удалить билет.
 * @swagger
 * /api/ticket:
 *   delete:
 *     summary: Удалить билет
 *     tags: [Билеты]
 *     parameters:
 *       - name: number
 *         in: query
 *         description: Номер билета.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о удаленном билете.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

router.get('/:number', ticketController.getTicket )
router.get('/checked/:number', ticketController.Checked )
router.get('/refunds/:number', ticketController.Refunds )
router.get('/:id', ticketController.getTicket )
router.delete('/', ticketController.delete)

module.exports = router