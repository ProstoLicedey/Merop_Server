const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Event, HallOptionPrice, Entrance, Hall, HallOption, Ticket, } = require('../models/models')
const {Op} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')

class HallController {

    async create(req, res, next) {
        try {

            let {title, description, dateTime, typeId, ageRatingId} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpeg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const event = await Event.create({title, description, dateTime, typeId, ageRatingId, img: fileName})


            return res.json(event)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }


    async getAll(req, res, next) {

    }


    async getHall(req, res, next) {
        try {
            const { id } = req.params;

            const event = await Event.findOne({
                attributes: ['id', 'title','dateTime','Status', ],
                where: { id: id },
                include: [
                    {

                        model: Hall,
                        as: 'hall'
                    }
                ]
            });

            const hallOptionPrice = await HallOptionPrice.findAll({
                attributes: ['id', 'price'],
                where: { eventId: id },
                include: [
                    {
                        model: HallOption,
                        as: 'hallOption'
                    }
                ]
            });
            const tickets = await Ticket.findAll({
                attributes: ['row', 'seat'],
                where: { eventId: id }
            });

            return res.json({event, hallOptionPrice, tickets});
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
    async getUserHall(req, res, next) {
        try {
            const { id } = req.params;

            const hall = await Hall.findAll({
                attributes: ['id', 'address', 'name'],
                where: { userId: id },
            });

            const entrance = await Entrance.findAll({
                attributes: ['id', 'address', 'name', 'createdAt'],
                where: { userId: id },
            });



            const combinedData = hall.map(hall => ({
                ...hall.dataValues,
                type: 'Зрительный зал'
            })).concat(entrance.map(entrance => ({
                ...entrance.dataValues,
                type: 'Входной билет'
            })));

            combinedData.sort((a, b) => b.createdAt - a.createdAt);

            return res.json(combinedData);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
}

module.exports = new HallController()