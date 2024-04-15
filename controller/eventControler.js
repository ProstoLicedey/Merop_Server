const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {
    Event,
    DeviceInfo,
    Entrance,
    Hall,
    AgeRating,
    Type,
    EntranceOptionPrice,
    HallOptionPrice,
    EntranceOption, Controller, User, Ticket
} = require('../models/models')
const {Op, fn, col} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')
const moment = require('moment');

class EventController {

    async create(req, res, next) {
        try {

            let {title, description, dateTime, typeId, ageRatingId, userId, option} = req.body
            const {img} = req.files

            option = JSON.parse(option);

            let fileName = uuid.v4() + ".jpeg"
            await img.mv(path.resolve(__dirname, '..', 'static', fileName))
            console.log(fileName)

            let entranceOption = await EntranceOption.findOne({
                where: {id: option[0].id},
                include: [
                    {model: Entrance, as: 'entrance'}
                ]
            });

            const event = await Event.create({
                title,
                description,
                dateTime,
                typeId,
                ageRatingId,
                userId,
                entranceId: entranceOption.entrance.id,
                img: fileName
            })


            const EOP = await Promise.all(option.map(async (entrance) => {
                const entranceOption = await EntranceOption.findOne({
                    where: {id: entrance.id}
                });
                if (entrance.switchState) {
                    return EntranceOptionPrice.create({
                        price: entrance.price,
                        seatsLeft: entranceOption.totalSeats,
                        entranceOptionId: entrance.id,
                        eventId: event.id
                    });
                } else {
                    return null
                }
            }));


            return res.json(event)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }


    async getAll(req, res, next) {
        try {
            let {typeId, page, priceMin, priceMax, dateMin, dateMax, serchTitle} = req.query;
            const limit = 12;
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
                include: [{model: Hall, as: 'hall'}, {model: Entrance, as: 'entrance'}, {
                    model: AgeRating,
                    as: 'ageRating'
                }]
            });
            for (let i = events.rows.length - 1; i >= 0; i--) {
                let event = events.rows[i];
                let minPrice = await EntranceOptionPrice.findOne({
                    where: {eventId: event.id},
                    order: [['price', 'ASC']],
                });
                event.dataValues.minPrice = minPrice ? minPrice.price : 0
                if (minPrice) {
                    continue
                }
                if (priceMin > minPrice || priceMax < minPrice) {

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
            if (event.entrance) {
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
            if (event.hall) {
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
                    {model: Entrance, as: 'entrance'},

                ]
            })


            // Преобразование данных
            const formattedEvents = await Promise.all(events.map(async event => {

                const EOPs = await EntranceOptionPrice.findAll({
                    where: {eventId: event.id},
                });
                const EOs = await EntranceOption.findAll({
                    where: {entranceId: event.entranceId},
                });
                let seatsLeftSum, seatsTotalSum, mests;

                if(EOPs.length > 0 && EOs.length > 0) {
                     seatsLeftSum = EOPs.reduce((total, eop) => total + eop.seatsLeft, 0);
                     seatsTotalSum = EOs.reduce((total, eo) => total + eo.totalSeats, 0);
                     mests = seatsLeftSum + "/" + seatsTotalSum
                }
                else{
                    const ticketCount = await Ticket.count({
                        where: {eventId: event.id},
                    });
                    const hall = await Hall.findOne({
                        where: {id: event.hallId},
                    });
                    if(!!hall) {
                        seatsTotalSum = hall.numberRows * hall.numberSeatsInRow;
                        seatsLeftSum = seatsTotalSum - ticketCount;
                        mests = seatsLeftSum + "/" + seatsTotalSum
                    }
                }


                const formattedEvent = {
                    id: event.id,
                    title: event.title,
                    dateTime: moment(event.dateTime).locale('ru').format('DD MMMM HH:mm ddd'),
                    mests: mests? mests : '',

                };

                // Добавление адреса из Entrance, если entranceId не равно null
                if (event.entranceId !== null) {
                    formattedEvent.address = event.entrance.address;
                }
                // Или добавление адреса из Hall, если entranceId равно null
                else if (event.hall !== null) {
                    formattedEvent.address = event.hall.address;
                }

                return formattedEvent;
            }));

            return res.json(formattedEvents);
        } catch (e) {
            next(e)
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query
            const deletedController = await Event.destroy({
                where: {
                    id: id,
                },
            });


            if (!deletedController) {
                return next(ApiError.BadRequest(`Мероприятие не найдено`));
            }

            return res.json({message: `Controller with id ${id} has been deleted successfully`});
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

}

module.exports = new EventController()