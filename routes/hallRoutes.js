const Router = require('express')
const  router = new Router()
const  HallController = require('../controller/hallController')

/**
 * @swagger
 * /api/hall/update/{id}:
 *   get:
 *     summary: Получить информацию для обновления зала или входа
 *     tags: [Залы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор зала или входа.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         description: Тип объекта (зал или вход).
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Зрительный зал, Входной билет]
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о зале или входе.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Идентификатор зала или входа.
 *                 address:
 *                   type: string
 *                   description: Адрес зала или входа.
 *                 name:
 *                   type: string
 *                   description: Название зала или входа.
 *                 city:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       description: Значение города.
 *                     label:
 *                       type: string
 *                       description: Название города.
 *                 eventCount:
 *                   type: integer
 *                   description: Количество мероприятий в зале или входе.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */
/**
 * @swagger
 * /api/hall:
 *   post:
 *     summary: Создать новый зал или вход
 *     tags: [Залы]
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Параметры для создания нового зала или входа.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: Адрес зала или входа.
 *             name:
 *               type: string
 *               description: Название зала или входа.
 *             option:
 *               type: array
 *               description: Массив объектов опций зала или входа.
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Название опции зала или входа.
 *                   totalSeats:
 *                     type: integer
 *                     description: Общее количество мест для этой опции зала или входа.
 *                   row:
 *                     type: integer
 *                     description: Начальный и конечный ряды для опции зала или входа.
 *                   seat:
 *                     type: integer
 *                     description: Начальные и конечные места в ряде для опции зала или входа.
 *             row:
 *               type: integer
 *               description: Количество рядов в зале или входе.
 *             seat:
 *               type: integer
 *               description: Количество мест в ряде в зале или входе.
 *             userId:
 *               type: integer
 *               description: Идентификатор пользователя, создающего зал или вход.
 *             city:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                   description: Значение города.
 *                 label:
 *                   type: string
 *                   description: Название города.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о созданном зале или входе.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Идентификатор зала или входа.
 *                 address:
 *                   type: string
 *                   description: Адрес зала или входа.
 *                 name:
 *                   type: string
 *                   description: Название зала или входа.
 *                 city:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                       description: Значение города.
 *                     label:
 *                       type: string
 *                       description: Название города.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */


/**
 * Получить залы и входы пользователя.
 * @swagger
 * /api/hall/user-{id}:
 *   get:
 *     summary: Получить залы и входы пользователя
 *     tags: [Залы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о залах и входах пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор зала или входа.
 *                   address:
 *                     type: string
 *                     description: Адрес зала или входа.
 *                   name:
 *                     type: string
 *                     description: Название зала или входа.
 *                   type:
 *                     type: string
 *                     description: Тип объекта (зал или вход).
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Получить информацию о мероприятии, зале, ценах на опции и проданных билетах.
 * @swagger
 * /api/hall/{id}:
 *   get:
 *     summary: Получить информацию о мероприятии, зале, ценах на опции и проданных билетах
 *     tags: [Залы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор мероприятия.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о мероприятии, зале, ценах на опции и проданных билетах.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: object
 *                   description: Информация о мероприятии.
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Идентификатор мероприятия.
 *                     title:
 *                       type: string
 *                       description: Название мероприятия.
 *                     dateTime:
 *                       type: string
 *                       format: date-time
 *                       description: Дата и время мероприятия.
 *                     Status:
 *                       type: string
 *                       description: Статус мероприятия.
 *                 hallOptionPrice:
 *                   type: array
 *                   description: Информация о ценах на опции зала.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Идентификатор цены на опцию зала.
 *                       price:
 *                         type: number
 *                         description: Цена на опцию зала.
 *                 tickets:
 *                   type: array
 *                   description: Информация о проданных билетах.
 *                   items:
 *                     type: object
 *                     properties:
 *                       row:
 *                         type: integer
 *                         description: Номер ряда проданного билета.
 *                       seat:
 *                         type: integer
 *                         description: Номер места проданного билета.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Обновить информацию о зале или входе.
 * @swagger
 * /api/hall/{id}:
 *   put:
 *     summary: Обновить информацию о зале или входе
 *     tags: [Залы]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор зала или входа.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         description: Параметры для обновления информации о зале или входе.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: Адрес зала или входа.
 *             name:
 *               type: string
 *               description: Название зала или входа.
 *             option:
 *               type: array
 *               description: Массив объектов опций зала или входа.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор опции зала или входа.
 *                   name:
 *                     type: string
 *                     description: Название опции зала или входа.
 *                   totalSeats:
 *                     type: integer
 *                     description: Общее количество мест для этой опции зала или входа.
 *                   row:
 *                     type: integer
 *                     description: Начальный и конечный ряды для опции зала или входа.
 *                   seat:
 *                     type: integer
 *                     description: Начальные и конечные места в ряде для опции зала или входа.
 *             row:
 *               type: integer
 *               description: Количество рядов в зале или входе.
 *             seat:
 *               type: integer
 *               description: Количество мест в ряде в зале или входе.
 *             userId:
 *               type: integer
 *               description: Идентификатор пользователя, создающего зал или вход.
 *             type:
 *               type: string
 *               description: Тип объекта (зал или вход).
 *             eventCount:
 *               type: integer
 *               description: Количество мероприятий.
 *             city:
 *               type: object
 *               properties:
 *                 value:
 *                   type: string
 *                   description: Значение города.
 *                 label:
 *                   type: string
 *                   description: Название города.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает обновленную информацию о зале или входе.
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
 * Удалить зал или вход.
 * @swagger
 * /api/hall:
 *   delete:
 *     summary: Удалить зал или вход
 *     tags: [Залы]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: Идентификатор зала или входа.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         description: Тип объекта (зал или вход).
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Зрительный зал, Входной билет]
 *     responses:
 *       200:
 *         description: Успешный ответ. Зал или вход успешно удалены.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешном удалении.
 *       400:
 *         description: Ошибка запроса или мероприятие не найдено.
 *       500:
 *         description: Ошибка сервера.
 */



router.get('/update/:id', HallController.getUpdate, )
router.post('/', HallController.createHall)
router.get('/user-:id', HallController.getUserHall )
router.get('/:id', HallController.getHall)
router.put('/:id', HallController.update)
router.delete('/', HallController.deleteHall,)

module.exports = router