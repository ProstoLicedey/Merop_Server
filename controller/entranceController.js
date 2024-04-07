const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Event, EntranceOptionPrice, EntranceOption, Entrance} = require('../models/models')
const {Op} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')

class EventController {

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


    async getFromEvent(req, res, next) {
        try {
            const { id } = req.params;
            let {eventId} = req.query
            const event = await EntranceOption.findAll({
                where: { entranceId: id },
            });

            const updatedEvent = await Promise.all(event.map(async (item) => {
                const entranceOptionPrice = await EntranceOptionPrice.findOne({
                    where: { eventId: eventId, entranceOptionId: item.id },
                });

                return { ...item.toJSON(), entranceOptionPrice };
            }));

            return res.json(updatedEvent);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
    async getByID(req, res, next) {
        try {
            const { id } = req.params;
            const entrance = await Entrance.findOne({
                where: { id: id },
                include: EntranceOption,
            });



            return res.json(entrance);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
    async getEntenceUser(req, res, next) {
        try {
            const { id } = req.params;
            const entrance = await Entrance.findAll({
                where: { userId: id },
            });
            const transformedEntrance = entrance.map(entry => ({
                value: entry.id,
                label: entry.name,
            }));


            return res.json(transformedEntrance);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
    async createEntrance(req, res, next) {
        try {
            let {address, name, option, totalSeats, userId} = req.body
            // Добавление информации о входе
            const entrance = await Entrance.create({
                address: address,
                name: name,
                totalSeats: totalSeats,
                userId: userId
            });

            // Добавление информации о входных опциях
            for (const i of option) {
                await EntranceOption.create({
                    name: i.name,
                    totalSeats:i.totalSeats,
                    entranceId: entrance.id,  // Связывание опции с входом
                });
            }

            return res.json(entrance);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
}

module.exports = new EventController()