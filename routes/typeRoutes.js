const Router = require('express')
const router = new Router()
const  typeController = require('../controller/typeController')


/**
 * Создать новый тип.
 * @swagger
 * /api/type:
 *   post:
 *     summary: Создать новый тип
 *     tags: [Типы]
 *     parameters:
 *       - name: body
 *         in: body
 *         description: Параметры для создания нового типа.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Название нового типа.
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает информацию о созданном типе.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Ошибка запроса. Возвращается, если имя типа не указано.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Получить все типы.
 * @swagger
 * /api/type:
 *   get:
 *     summary: Получить все типы
 *     tags: [Типы]
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список всех типов.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Уникальный идентификатор типа.
 *                   name:
 *                     type: string
 *                     description: Название типа.
 *       500:
 *         description: Ошибка сервера.
 */

/**

 * @swagger
 * /api/type/city:
 *   get:
 *     summary: Получить все города
 *     tags: [Типы]
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список всех городов.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * @swagger
 * /api/type/rating:
 *   get:
 *     summary: Получить все возрастные ограничения
 *     tags: [Типы]
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает список всех возрастных рейтингов.
 *       500:
 *         description: Ошибка сервера.
 */

/**
 * Удалить тип по его идентификатору.
 * @swagger
 * /api/type:
 *   delete:
 *     summary: Удалить тип по его идентификатору
 *     tags: [Типы]
 *     parameters:
 *       - name: id
 *         in: query
 *         description: Идентификатор типа, который необходимо удалить.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Успешный ответ. Возвращает сообщение об успешном удалении типа.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Сообщение об успешном удалении типа.
 *       400:
 *         description: Ошибка запроса.
 *       500:
 *         description: Ошибка сервера.
 */


router.post('/', typeController.create)
router.get('/',  typeController.getAll)
router.get('/city',  typeController.getAllCity)
router.get('/rating',  typeController.getAllRating)
router.delete('/', typeController.delete)

module.exports = router