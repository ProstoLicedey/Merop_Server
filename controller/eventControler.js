const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Event, DeviceInfo, Entrance, Hall, AgeRating, Type, EntranceOptionPrice, HallOptionPrice} = require('../models/models')
const {Op, fn, col} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')
const moment = require('moment');

class EventController {

    async create(req, res, next) {
        try {

            let {title, description, dateTime, typeId, ageRatingId, userId} = req.body
            const {img} = req.files

            let fileName = uuid.v4() + ".jpeg"
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))

            const event = await Event.create({title, description, dateTime, typeId, ageRatingId, userId, img: fileName})


            return res.json(event)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }


    async getAll(req, res, next) {
        try {
            let {typeId, page, priceMin, priceMax, dateMin, dateMax, serchTitle} = req.query;
            const limit = 16;
            page = page || 1;
            let offset = page * limit - limit;

            const where = {};

            // if (priceMin && priceMax) {
            //     where.price = {[Op.between]: [priceMin, priceMax]};
            // } else if (priceMin) {
            //     where.price = {[Op.gte]: priceMin};
            // } else if (priceMax) {
            //     where.price = {[Op.lte]: priceMax};
            // }

            if (typeId) {
                where.typeId = typeId;
            }

            if (dateMin && dateMax) {
                where.dateTime = {
                    [Op.between]: [new Date(dateMin), new Date(dateMax)]
                };
            } else if (dateMin) {
                where.dateTime = {[Op.gte]: new Date(dateMin)};
            } else if (dateMax) {
                where.dateTime = {[Op.lte]: new Date(dateMax)};
            }
            if (serchTitle) {
                where.title = {
                    [Op.iLike]: `%${serchTitle}%`
                };
            }

            const events = await Event.findAndCountAll({
                where,
                limit,
                offset,
                include: [{model: Hall, as: 'hall'}, {model: Entrance, as: 'entrance'},{model: AgeRating, as: 'ageRating'}]
            });
            for (let i = events.rows.length - 1; i >= 0; i--) {
                let event = events.rows[i];
                let minPrice = await EntranceOptionPrice.findOne({
                    where: { eventId: event.id },
                    order: [['price', 'ASC']],
                });
                event.dataValues.minPrice = minPrice ? minPrice.price : 0
                if(minPrice){
                    continue
                }
                if(priceMin > minPrice || priceMax < minPrice ){

                    events.rows.splice(i, 1);

                }
                            }

            return res.json(events);
        } catch (e) {
            next(e)
        }
    }


    async getOne(req, res, next) {
        try {
        const {id} = req.params
        const event = await Event.findOne({
            where: {id},
            include: [
                {model: Hall, as: 'hall'},
                {model: Entrance, as: 'entrance'},
                {model: AgeRating, as: 'ageRating'},
                {model: Type, as: 'type'}
            ]
        })
        if(event.entrance) {
            const minPrice = await EntranceOptionPrice.findOne({
                where: {eventId: id},
                order: [['price', 'ASC']],
                attributes: ['price']
            });
            const maxPrice = await EntranceOptionPrice.findOne({
                where: {eventId: id},
                order: [['price', 'DESC']],
                attributes: ['price']
            });
            event.dataValues.maxPrice = maxPrice.price;
            event.dataValues.minPrice = minPrice.price;
        }
        if(event.hall) {
            const minPrice = await HallOptionPrice.findOne({
                where: {eventId: id},
                order: [['price', 'ASC']],
                attributes: ['price']
            });
            const maxPrice = await HallOptionPrice.findOne({
                where: {eventId: id},
                order: [['price', 'DESC']],
                attributes: ['price']
            });
            event.dataValues.maxPrice = maxPrice.price;
            event.dataValues.minPrice = minPrice.price;
        }
        return res.json(event)
    } catch (e) {
        next(e)
    }
    }

    async getCreator(req, res, next) {
        try {
            let {userId} = req.query;
            const events = await Event.findAll({
                where: {userId},
                include: [
                    {model: Hall, as: 'hall'},
                    {model: Entrance, as: 'entrance'}
                ]
            })


            // Преобразование данных
            const formattedEvents = events.map(event => {
                const formattedEvent = {
                    id: event.id,
                    title: event.title,
                    dateTime: moment(event.dateTime).locale('ru').format('DD MMMM HH:mm ddd'),
                };

                // Добавление адреса из Entrance, если entranceId не равно null
                if (event.entranceId !== null ) {
                    formattedEvent.address = event.entrance.address;
                }
                // Или добавление адреса из Hall, если entranceId равно null
                else if (event.hall !== null) {
                    formattedEvent.address = event.hall.address;
                }

                return formattedEvent;
            });

            return res.json(formattedEvents);
        }
        catch (e) {
            next(e)
        }
    }

}

module.exports = new EventController()