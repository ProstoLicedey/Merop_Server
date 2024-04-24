const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Event, HallOptionPrice, Entrance, Hall, HallOption, Ticket, EntranceOption, City,} = require('../models/models')
const {Op} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')

class HallController {

    async createHall(req, res, next) {
        try {
            let {address, name, option, row, seat, userId, city} = req.body

            let cityDB = await City.findOne({ where: { ideficator: city.value } });

            if(!cityDB){
                cityDB = await City.create({
                    name: city.label,
                    ideficator: city.value,
                });
            }
            // Добавление информации о входе
            const hall = await Hall.create({
                address,
                name,
                userId,
                numberRows: row,
                numberSeatsInRow: seat,
                cityId: cityDB.id,
            });

            // Добавление информации о входных опциях
            for (const i of option) {
                const rowFor = i.row ? i.row : [1, row];
                const seatFor = i.seat ? i.seat : [1, seat];
                await HallOption.create({
                    name: i.name,
                    totalSeats: i.totalSeats,
                    rowStart: rowFor[0],
                    rowFinish: rowFor[1],
                    seatStart: seatFor[0],
                    seatFinish: seatFor[1],
                    hallId: hall.id,  // Связывание опции с входом
                });
            }

            return res.json(hall);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            let {address, name, option, row, seat, userId, type, eventCount, city} = req.body

            let cityDB = await City.findOne({ where: { ideficator: city.value } });

            if(!cityDB){
                cityDB = await City.create({
                    name: city.label,
                    ideficator: city.value,
                });
            }

            const hallData = {
                name,
                address,
                numberRows: row,
                numberSeatsInRow: seat,
                userId,
                cityId: cityDB.id

            };

            const hall = await Hall.update(hallData, {
                where: {id: id}
            });


            if (eventCount > 0) {
                for (const i of option) {
                    const rowFor = i.row ? i.row : [1, row];
                    const seatFor = i.seat ? i.seat : [1, seat];
                    await HallOption.update(
                        {
                            name: i.name,
                            totalSeats: i.totalSeats,
                            rowStart: rowFor[0],
                            rowFinish: rowFor[1],
                            seatStart: seatFor[0],
                            seatFinish: seatFor[1],
                            hallId: id,
                        },
                        {
                            where: {id: i.id}
                        }
                    );
                }
            } else {
                HallOption.destroy({
                    where: {hallId: id}
                });

                for (const i of option) {
                    const rowFor = i.row ? i.row : [1, row];
                    const seatFor = i.seat ? i.seat : [1, seat];
                    await HallOption.create( {
                        name: i.name,
                        totalSeats: i.totalSeats,
                        rowStart: rowFor[0],
                        rowFinish: rowFor[1],
                        seatStart: seatFor[0],
                        seatFinish: seatFor[2],
                        hallId: id,
                    },);
                }
            }


            return res.json(hall);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async getUpdate(req, res, next) {
        try {
            const {id} = req.params;
            const {type} = req.query;

            let hall, event;
            if (type == 'Зрительный зал') {
                hall = await Hall.findOne({
                    where: {id: id},
                    include: [
                        {
                            model: HallOption,
                            as: 'hallOptions'
                        },
                        {
                            model: City,
                            as: 'city'
                        }
                    ]
                });

                event = await Event.findAll({
                    where: {
                        hallId: hall.id,
                        dateTime: {
                            [Op.gt]: new Date()
                        }
                    }
                });
            } else if (type == 'Входной билет') {
                hall = await Entrance.findOne({
                    where: {id: id},
                    include: [
                        {
                            model: EntranceOption,
                            as: 'entranceOptions'
                        },
                        {
                            model: City,
                            as: 'city'
                        }
                    ]
                });
                console.log(hall.id)
                event = await Event.findAll({
                    where: {
                        entranceId: hall.id,
                        dateTime: {
                            [Op.gt]: new Date()
                        }
                    }
                });

            }

            console.log(event)
            // Use toJSON() to handle circular references
            const newHall = {...hall.toJSON(), eventCount: event.length};
            return res.status(200).json(newHall);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


    async getAll(req, res, next) {

    }


    async getHall(req, res, next) {
        try {
            const {id} = req.params;

            const event = await Event.findOne({
                attributes: ['id', 'title', 'dateTime', 'Status',],
                where: {id: id},
                include: [
                    {

                        model: Hall,
                        as: 'hall'
                    }
                ]
            });

            const hallOptionPrice = await HallOptionPrice.findAll({
                attributes: ['id', 'price'],
                where: {eventId: id},
                include: [
                    {
                        model: HallOption,
                        as: 'hallOption'
                    }
                ]
            });
            const tickets = await Ticket.findAll({
                attributes: ['row', 'seat'],
                where: {eventId: id}
            });

            return res.json({event, hallOptionPrice, tickets});
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async getUserHall(req, res, next) {
        try {
            const {id} = req.params;

            const hall = await Hall.findAll({
                attributes: ['id', 'address', 'name'],
                where: {userId: id},
            });

            const entrance = await Entrance.findAll({
                attributes: ['id', 'address', 'name', 'createdAt'],
                where: {userId: id},
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

    async deleteHall(req, res, next) {
        try {
            const {id, type} = req.query
            let deleted;
            if (type == "Зрительный зал") {
                deleted = await Hall.destroy({
                    where: {
                        id: id,
                    },
                });
            } else if (type == "Входной билет") {
                deleted = await Entrance.destroy({
                    where: {
                        id: id,
                    },
                });
            } else {
                return next(ApiError.BadRequest(`Мероприятие не найдено`));
            }

            if (!deleted) {
                return next(ApiError.BadRequest(`Мероприятие не найдено`));
            }

            return res.json({message: `Controller with id ${id} has been deleted successfully`});
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
}

module.exports = new HallController()