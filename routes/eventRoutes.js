const Router = require('express')
const router = new Router()
const eventController = require('../controller/eventControler')




/**
 * @swagger
 * /api/event/creator:
 *   get:
 *     summary: Получить мероприятия создателя
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID пользователя
 *         required: true
 *       - in: query
 *         name: archive
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Флаг архивации (по умолчанию false)
 *         required: true
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список мероприятий создателя.
 *       400:
 *         description: Ошибка в запросе.
 *       500:
 *         description: Ошибка сервера.
 */


/**
 * @swagger
 * /api/event/update/{id}:
 *   get:
 *     summary: Получить мероприятие для обновления
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия для обновления
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: ID пользователя
 *         required: true
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает мероприятие для обновления.
 *       400:
 *         description: Мероприятие не найдено.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/event/searchAdmin:
 *   get:
 *     summary: Получить мероприятие для обновления
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: query
 *         name: input
 *         schema:
 *           type: string
 *         description: поисковая строка
 *         required: true
 *     responses:
 *       200:
 *         description: Успешный ответ. Мероприятие.
 *       400:
 *         description: Ошибка в запросе.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/event/getForAdmin/{id}:
 *   get:
 *     summary: Получить информацию о мероприятии для администратора по его ID
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID мероприятия для получения информации
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает данные о мероприятии для администратора.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   key:
 *                     type: string
 *                   field:
 *                     type: string
 *                   value:
 *                     type: string
 *       403:
 *         description: Мероприятие не найдено.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/event/block/{id}:
 *   put:
 *     summary: Блокировать или разблокировать мероприятие по его ID
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID мероприятия для блокировки или разблокировки
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает обновленную информацию о мероприятии.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Мероприятие не найдено.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/event/{id}:
 *   put:
 *     summary: Обновить информацию о мероприятии по его ID
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID мероприятия для обновления
 *       - in: body
 *         name: eventData
 *         description: Данные для обновления мероприятия
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             img:
 *               type: string
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             dateTime:
 *               type: string
 *               format: date-time
 *             typeId:
 *               type: integer
 *             ageRatingId:
 *               type: integer
 *             userId:
 *               type: integer
 *             option:
 *               type: array
 *               items:
 *                 type: object
 *             type:
 *               type: string
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает обновленную информацию о мероприятии.
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
 * /api/event:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Мероприятия]
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Параметры для создания нового мероприятия.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 *               description: Название мероприятия.
 *             description:
 *               type: string
 *               description: Описание мероприятия.
 *             dateTime:
 *               type: string
 *               format: date-time
 *               description: Дата и время мероприятия.
 *             typeId:
 *               type: integer
 *               description: Идентификатор типа мероприятия.
 *             ageRatingId:
 *               type: integer
 *               description: Идентификатор возрастного рейтинга мероприятия.
 *             userId:
 *               type: integer
 *               description: Идентификатор пользователя, создающего мероприятие.
 *             option:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Идентификатор опции (входа или зала) мероприятия.
 *                   switchState:
 *                     type: boolean
 *                     description: Состояние переключателя опции.
 *                   price:
 *                     type: number
 *                     description: Цена опции.
 *             type:
 *               type: string
 *               enum: [Entrance, Hall]
 *               description: Тип мероприятия (Entrance - Вход, Hall - Зал).
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *               typeId:
 *                 type: integer
 *               ageRatingId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               option:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     switchState:
 *                       type: boolean
 *                     price:
 *                       type: number
 *               type:
 *                 type: string
 *               img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о созданном мероприятии.
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
 * /api/event:
 *   get:
 *     summary: Получить список мероприятий с возможностью фильтрации и пагинации
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: query
 *         name: typeId
 *         schema:
 *           type: integer
 *         description: ID типа мероприятия для фильтрации
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы для пагинации
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: integer
 *         description: Минимальная цена мероприятия
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: integer
 *         description: Максимальная цена мероприятия
 *       - in: query
 *         name: dateMin
 *         schema:
 *           type: string
 *           format: date
 *         description: Минимальная дата мероприятия
 *       - in: query
 *         name: dateMax
 *         schema:
 *           type: string
 *           format: date
 *         description: Максимальная дата мероприятия
 *       - in: query
 *         name: serchTitle
 *         schema:
 *           type: string
 *         description: Поиск по названию или описанию мероприятия
 *       - in: query
 *         name: city
 *         schema:
 *           type: integer
 *         description: ID города для фильтрации мероприятий по городу
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список мероприятий с учетом фильтров и пагинации.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Общее количество мероприятий.
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Информация о мероприятии.
 *       400:
 *         description: Ошибка запроса. Некорректные данные в запросе.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/event/{id}:
 *   get:
 *     summary: Получить информацию о конкретном мероприятии по его ID
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID мероприятия для получения информации. Например, "123abc".
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о запрошенном мероприятии.
 *       400:
 *         description: Ошибка запроса. Некорректные данные в запросе.
 *       403:
 *         description: Запрещено. Мероприятие заблокировано.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/event:
 *   delete:
 *     summary: Удалить мероприятие
 *     description: Удаляет мероприятие по его ID
 *     tags: [Мероприятия]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID мероприятия, которое нужно удалить
 *     responses:
 *       200:
 *         description: Успешно удалено
 *
 *       400:
 *         description: Ошибка запроса
 *       500:
 *         description: Ошибка сервера.
 */

router.get('/creator', eventController.getCreator)
router.get('/update/:id', eventController.getEventForUpdate)
router.get('/searchAdmin', eventController.searchAdmin)
router.get('/getForAdmin/:id', eventController.getForAdmin)
router.put('/block/:id', eventController.block)
router.put('/:id', eventController.update)
router.post('/', eventController.create)
router.get('/', eventController.getAll)
router.get('/:id', eventController.getOne)
router.delete('/', eventController.delete)


module.exports = router
