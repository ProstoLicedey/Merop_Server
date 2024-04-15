const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Event, HallOptionPrice, Entrance, Hall, HallOption, Ticket, EntranceOption,} = require('../models/models')
const {Op} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')

class HallController {

    async createHall(req, res, next) {
        try {
            let {address, name, option, row, seat, userId} = req.body
            // Добавление информации о входе
            const hall = await Hall.create({
                address,
                name,
                userId,
                numberRows: row,
                numberSeatsInRow: seat,
            });

            // Добавление информации о входных опциях
            for (const i of option) {
                await HallOption.create({
                    name: i.name,
                    totalSeats: i.totalSeats,
                    rowStart: i.row[0],
                    rowFinish: i.row[1],
                    seatStart: i.seat[0],
                    seatFinish:  i.seat[1],
                    hallId: hall.id,  // Связывание опции с входом
                });
            }

            return res.json(hall);
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