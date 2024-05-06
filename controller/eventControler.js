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
    EntranceOption, Controller, User, Ticket, HallOption
} = require('../models/models')
const {Op, fn, col, Sequelize} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')
const moment = require('moment');

class EventController {

    async create(req, res, next) {
        try {
            let {title, description, dateTime, typeId, ageRatingId, userId, option, type} = req.body;
            const {img} = req.files;

            option = JSON.parse(option);

            let fileName = uuid.v4() + ".jpeg";
            await img.mv(path.resolve(__dirname, '..', 'static', fileName));
            console.log(fileName);

            let entranceOption, hallOption;

            if (type === 'Entrance') {
                entranceOption = await EntranceOption.findOne({
                    where: {id: option[0].id},
                    include: [{model: Entrance, as: 'entrance'}]
                });
            } else if (type === 'Hall') {
                hallOption = await HallOption.findOne({
                    where: {id: option[0].id},
                    include: [{model: Hall, as: 'hall'}]
                });
            }

            const event = await Event.create({
                title,
                description,
                dateTime,
                typeId,
                ageRatingId,
                userId,
                entranceId: entranceOption ? entranceOption.entrance.id : null,
                hallId: hallOption ? hallOption.hall.id : null,
                img: fileName
            });

            if (type === 'Entrance') {
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
                        return null;
                    }
                }));
            } else if (type === 'Hall') {
                const HOP = await Promise.all(option.map(async (opt) => {
                    const hallOption = await HallOption.findOne({
                        where: {id: opt.id}
                    });

                    return HallOptionPrice.create({
                        price: opt.price,
                        hallOptionId: hallOption.id,
                        eventId: event.id
                    });
                }));
            }

            return res.json(event);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


    async update(req, res, next) {
        try {
            const {id} = req.params;
            let {img, title, description, dateTime, typeId, ageRatingId, userId, option, type} = req.body;
            if (typeof img !== "string") {
                img = req.files.img;
            }

            option = JSON.parse(option);

            let fileName;

            if (typeof img !== "string") {
                fileName = uuid.v4() + ".jpeg";
                await img.mv(path.resolve(__dirname, '..', 'static', fileName));
                console.log(fileName);
            } else {
                const pathname = new URL(img).pathname;
                fileName = pathname.split('/').pop()

            }

            let entranceOption, hallOption;

            if (type === 'Entrance') {
                entranceOption = await EntranceOption.findOne({
                    where: {id: option[0].id},
                    include: [{model: Entrance, as: 'entrance'}]
                });
            } else if (type === 'Hall') {
                hallOption = await HallOption.findOne({
                    where: {id: option[0].id},
                    include: [{model: Hall, as: 'hall'}]
                });
            }

            const eventData = {
                title,
                description,
                dateTime,
                typeId,
                ageRatingId,
                userId,
                entranceId: entranceOption ? entranceOption.entrance.id : null,
                hallId: hallOption ? hallOption.hall.id : null,
            };

            if (img) {
                eventData.img = fileName;
            }

            const event = await Event.update(eventData, {
                where: {id: id}
            });

            if (type === 'Entrance') {
                await Promise.all(option.map(async (entrance) => {
                    const entranceOption = await EntranceOption.findOne({
                        where: {id: entrance.id}
                    });
                    if (entrance.switchState) {
                        // Получить текущее значение seatsLeft
                        const currentEntranceOption = await EntranceOptionPrice.findOne({
                            where: {
                                entranceOptionId: entrance.id,
                                eventId: id
                            }
                        });
                        // Оставить seatsLeft неизменным
                        const seatsLeft = currentEntranceOption ? currentEntranceOption.seatsLeft : entranceOption.totalSeats;
                        await EntranceOptionPrice.update({
                            price: entrance.price,
                            seatsLeft: seatsLeft, // Использовать текущее значение seatsLeft
                        }, {
                            where: {
                                entranceOptionId: entrance.id,
                                eventId: id
                            }
                        });
                    }
                }));
            } else if (type === 'Hall') {
                await Promise.all(option.map(async (opt) => {
                    const hallOption = await HallOption.findOne({
                        where: {id: opt.id}
                    });

                    await HallOptionPrice.update({
                        price: opt.price,
                    }, {
                        where: {
                            hallOptionId: hallOption.id,
                            eventId: id
                        }
                    });
                }));
            }

            return res.json(event);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


    async getAll(req, res, next) {
        try {
            let {typeId, page, priceMin, priceMax, dateMin, dateMax, serchTitle, city} = req.query;
            const limit = 12;
            page = page || 1;
            let offset = page * limit - limit;

            const where = {};

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
                where.dateTime = {
                    [Op.between]: [new Date(), new Date(dateMax)]
                };
            } else {
                where.dateTime = {[Op.gte]: new Date()};
            }
            if (serchTitle) {
                where.title = {
                    [Op.iLike]: `%${serchTitle}%`
                };
            }
            if (city) {
                where[Op.or] = [
                    {'$hall.cityId$': city},
                    {'$entrance.cityId$': city}
                ];
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

                if (!minPrice){
                    minPrice = await HallOptionPrice.findOne({
                        where: {eventId: event.id},
                        order: [['price', 'ASC']],
                    });
                }
                event.dataValues.minPrice = minPrice ? minPrice.price : 0


                if (priceMin > event.dataValues.minPrice || priceMax < event.dataValues.minPrice) {

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

    async getEventForUpdate(req, res, next) {
        try {
            const {id} = req.params
            const {userId} = req.query
            const event = await Event.findOne({
                where: {id, userId},
                include: [
                    {model: Hall, as: 'hall'},
                    {model: Entrance, as: 'entrance'},
                    {model: EntranceOptionPrice,},
                    {model: HallOptionPrice,},
                ],
            });


            const type = event.hall ? "Hall" : (event.entrance ? "Entrance" : null)
            const option = event.hall ? event.hallOptionPrices : (event.entrance ? event.entranceOptionPrices : null)
            const hallId = event.hall ? event.hallId : (event.entrance ? event.entranceId : null)

            console.log()
            const newEvent = {
                ...event.toJSON(), // Копируем свойства события
                type: type,
                option: option,
                hallId: hallId
            };
            delete newEvent[event.hall ? "hallOptionPrices" : (event.entrance ? "entranceOptionPrices" : null)];


            return res.json(newEvent)
        } catch (e) {
            next(e)
        }
    }

    async getCreator(req, res, next) {
        try {
            let {userId, archive} = req.query;

            const dateComparisonOperator = archive == "true" ? Op.lt : Op.gt;

            const events = await Event.findAll({
                where: {
                    userId,
                    dateTime: {
                        [dateComparisonOperator]: new Date() // выбор оператора сравнения в зависимости от значения переменной archive
                    }
                },
                include: [
                    {model: Hall, as: 'hall'},
                    {model: Entrance, as: 'entrance'}
                ]
            });


            // Преобразование данных
            const formattedEvents = await Promise.all(events.map(async event => {

                const EOPs = await EntranceOptionPrice.findAll({
                    where: {eventId: event.id},
                });
                const EOs = await EntranceOption.findAll({
                    where: {entranceId: event.entranceId},
                });
                let seatsLeftSum, seatsTotalSum, mests;

                if (EOPs.length > 0 && EOs.length > 0) {
                    seatsLeftSum = EOPs.reduce((total, eop) => total + eop.seatsLeft, 0);
                    seatsTotalSum = EOs.reduce((total, eo) => total + eo.totalSeats, 0);
                    mests = seatsLeftSum + "/" + seatsTotalSum
                } else {
                    const ticketCount = await Ticket.count({
                        where: {eventId: event.id},
                    });
                    const hall = await Hall.findOne({
                        where: {id: event.hallId},
                    });
                    if (!!hall) {
                        seatsTotalSum = hall.numberRows * hall.numberSeatsInRow;
                        seatsLeftSum = seatsTotalSum - ticketCount;
                        mests = seatsLeftSum + "/" + seatsTotalSum
                    }
                }


                const formattedEvent = {
                    id: event.id,
                    title: event.title,
                    dateTime: moment(event.dateTime).locale('ru').format('DD MMMM HH:mm ddd'),
                    mests: mests ? mests : '',

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