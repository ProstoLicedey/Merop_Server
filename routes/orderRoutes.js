const Router = require('express')
const  router = new Router()
const  orderController = require('../controller/orderController')

/**
 * Создать новый заказ.
 * @swagger
 * /api/order:
 *   post:
 *     summary: Создать новый заказ
 *     tags: [Заказы]
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Параметры для создания нового заказа.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *               description: Идентификатор пользователя, оформляющего заказ.
 *             tickets:
 *               type: string
 *               description: JSON-строка с информацией о билетах в заказе.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о созданном заказе.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Получить информацию о билетах для указанного заказа.
 * @swagger
 * /api/order/getTicket/{id}:
 *   get:
 *     summary: Получить информацию о билетах для указанного заказа
 *     tags: [Заказы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор заказа.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о билетах для указанного заказа.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ticketId:
 *                     type: integer
 *                     description: Идентификатор билета.
 *                   number:
 *                     type: integer
 *                     description: Номер билета.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Дата и время создания билета.
 *                   title:
 *                     type: string
 *                     description: Заголовок мероприятия.
 *                   dateTime:
 *                     type: string
 *                     format: date-time
 *                     description: Дата и время мероприятия.
 *                   venueName:
 *                     type: string
 *                     description: Название места проведения мероприятия.
 *                   venueAddress:
 *                     type: string
 *                     description: Адрес места проведения мероприятия.
 *                   optionName:
 *                     type: string
 *                     description: Название опции билета.
 *                   optionPrice:
 *                     type: number
 *                     description: Цена опции билета.
 *                   row:
 *                     type: integer
 *                     description: Номер ряда для билета.
 *                   seat:
 *                     type: integer
 *                     description: Номер места для билета.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Получить заказы для указанного пользователя.
 * @swagger
 * /api/order/user/{id}:
 *   get:
 *     summary: Получить заказы для указанного пользователя
 *     tags: [Заказы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о заказах для указанного пользователя.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Идентификатор заказа.
 *               ticketsCount:
 *                 type: integer
 *                 description: Количество билетов в заказе.
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 description: Дата и время первого билета в заказе.
 *               address:
 *                 type: string
 *                 description: Адрес места проведения мероприятия первого билета в заказе.
 *               addressName:
 *                 type: string
 *                 description: Название места проведения мероприятия первого билета в заказе.
 *               title:
 *                 type: string
 *                 description: Заголовок мероприятия первого билета в заказе.
 *               status:
 *                 type: string
 *                 description: Статус мероприятия первого билета в заказе.
 *               img:
 *                 type: string
 *                 description: URL изображения мероприятия первого билета в заказе.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Получить мероприятия, созданные указанным пользователем.
 * @swagger
 * /api/order/buyer/{id}:
 *   get:
 *     summary: Получить мероприятия, созданные указанным пользователем
 *     tags: [Заказы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о мероприятиях, созданных указанным пользователем.
 *
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */


router.post('/', orderController.create)
router.get('/getTicket/:id',  orderController.getTicket)
router.get('/user/:id', orderController.getOrders )
router.get('/buyer/:id', orderController.getByuers )
router.get('/toCreator/:id', orderController.toCreator )

module.exports = router