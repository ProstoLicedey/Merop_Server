const Router = require('express')
const  router = new Router()
const  entanceController = require('../controller/entranceController')

/**
 * @swagger
 * tags:
 *   name: Залы со входными билетами
 */

/**
 * @swagger
 * /api/entrance:
 *   post:
 *     summary: Создать новый зал со входным билетом
 *     tags: [Залы со входными билетами]
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Параметры для создания нового зала со входными билетами.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: Адрес зала.
 *             name:
 *               type: string
 *               description: Название зала.
 *             option:
 *               type: array
 *               description: Массив категорий .
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор опции .
 *                   price:
 *                     type: number
 *                     description: Цена опции .
 *             totalSeats:
 *               type: integer
 *               description: Общее количество мест.
 *             userId:
 *               type: integer
 *               description: Идентификатор пользователя, создающего зал.
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
 *         description: Успешный ответ. Возвращает информацию о созданном входе.
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
 * @swagger
 * /api/entrance/user/{id}:
 *   get:
 *     summary: Получить список входов и залов пользователя
 *     tags: [Залы со входными билетами]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор пользователя.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список входов и залов пользователя.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   value:
 *                     type: integer
 *                     description: Идентификатор входа или зала.
 *                   label:
 *                     type: string
 *                     description: Название входа или зала.
 *                   type:
 *                     type: string
 *                     description: Тип объекта (Entrance - Вход, Hall - Зал).
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/entrance/option/{id}:
 *   get:
 *     summary: Получить опции входа для мероприятия
 *     tags: [Залы со входными билетами]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор входа.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: eventId
 *         in: query
 *         description: Идентификатор мероприятия.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает опции входа для указанного мероприятия.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор опции входа.
 *                   name:
 *                     type: string
 *                     description: Название опции входа.
 *                   totalSeats:
 *                     type: integer
 *                     description: Общее количество мест для этой опции входа.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Дата создания опции входа.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Дата обновления опции входа.
 *                   hallId:
 *                     type: integer
 *                     description: Идентификатор зала или входа.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 * */

/**
 * @swagger
 * /api/entrance/{id}:
 *   get:
 *     summary: Получить информацию о входе или зале
 *     tags: [Залы со входными билетами]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор входа или зала.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: type
 *         in: query
 *         description: Тип объекта (Entrance - Вход, Hall - Зал).
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Entrance, Hall]
 *     responses:
 *       200:
 *         description: Успешный запрос.
 *       400:
 *         description: Ошибка запроса.
 *       404:
 *         description: Объект не найден.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/entrance/{id}:
 *   put:
 *     summary: Обновить информацию о входе
 *     tags: [Залы со входными билетами]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Идентификатор входа.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         description: Параметры для обновления информации о входе.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *               description: Адрес входа.
 *             name:
 *               type: string
 *               description: Название входа.
 *             option:
 *               type: array
 *               description: Массив объектов опций входа.
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор опции входа.
 *                   name:
 *                     type: string
 *                     description: Название опции входа.
 *                   totalSeats:
 *                     type: integer
 *                     description: Общее количество мест для этой опции входа.
 *             userId:
 *               type: integer
 *               description: Идентификатор пользователя.
 *             totalSeats:
 *               type: integer
 *               description: Общее количество мест.
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
 *         description: Успешный ответ. Возвращает обновленную информацию о входе.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */





router.post('/', entanceController.createEntrance)
router.get('/user/:id', entanceController.getEntenceHallUser )
router.get('/option/:id', entanceController.getFromEvent )
router.get('/:id', entanceController.getByID )
router.put('/:id',entanceController.update)


module.exports = router