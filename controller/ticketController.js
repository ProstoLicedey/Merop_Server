const {
    Type, Order, Ticket, UpdatePassword, Event, EntranceОptionPrice, Entrance, User, HallОptionPrice,
    EntranceOptionPrice, EntranceOption, Controller, City, Hall
} = require('../models/models')
const {Op} = require("sequelize"); //модель
const ApiError = require('../exeptions/apiError')
const fse = require('fs-extra');
const {join} = require("path");
const {Sequelize, DataTypes} = require('sequelize');
const moment = require("moment/moment");

class ticketController {

    async getTicket(req, res, next) {
        try {
            const {number} = req.params
            const {idUser} = req.query;
            let ticket = await Ticket.findOne({
                where: {number: number},
                include: [
                    {
                        model: Event,
                        as: 'event',
                        attributes: ['title', 'dateTime', 'userId', 'img'],
                    },
                    {
                        model: EntranceOptionPrice,
                        as: 'entranceOptionPrice',
                        include: [
                            {
                                model: EntranceOption,
                                as: 'entranceOption',
                                attributes: ['name'],
                            },
                        ]
                    }


                ]

            })
            if (!ticket) {
                return res.status(403).json({error: 'Ticket not found'});
            }

            if (ticket.event.userId !== Number(idUser)) {
                let controller = await Controller.findOne({
                    where: {creatorId: ticket.event.userId, controllerId: Number(idUser)}
                })
                console.log('ticket#' + controller)
                if (!controller) {
                    return res.status(403).json({error: 'Unauthorized'});
                }

            }

            const modifiedTicket = {
                ...ticket.toJSON(),  // Копирование свойств ticket
                updatedAt: moment(ticket.updatedAt).locale('ru').format('DD MMMM HH:mm'),
                event: {
                    ...ticket.event.toJSON(),
                    dateTime: moment(ticket.event.dateTime).locale('ru').format('DD MMMM HH:mm'),
                }
            };

            return res.json(modifiedTicket);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async Checked(req, res, next) {
        try {
            const {number} = req.params
            const {idUser} = req.query;
            let ticket = await Ticket.findOne({
                where: {number: number},
                include: [
                    {
                        model: Event,
                        as: 'event',
                        attributes: ['title', 'dateTime', 'userId', 'img'],
                    },
                    {
                        model: EntranceOptionPrice,
                        as: 'entranceOptionPrice',
                        include: [
                            {
                                model: EntranceOption,
                                as: 'entranceOption',
                                attributes: ['name'],
                            },
                        ]
                    }

                ]

            })

            if (ticket.event.userId !== Number(idUser)) {
                let controller = await Controller.findOne({
                    where: {creatorId: ticket.event.userId, controllerId: Number(idUser)}
                })
                if (!controller) {
                    return res.json(403);
                }
            }

            // Проверка и обновление значения ticket.status
            if (ticket.status) {
                // Обновление значения status в базе данных на false
                await Ticket.update({status: false}, {where: {number: number}});

            }

            const modifiedTicket = {
                ...ticket.toJSON(),  // Копирование свойств ticket
                updatedAt: moment(ticket.updatedAt).locale('ru').format('DD MMMM HH:mm'),
                event: {
                    ...ticket.event.toJSON(),
                    dateTime: moment(ticket.event.dateTime).locale('ru').format('DD MMMM HH:mm'),
                }
            };

            return res.json(modifiedTicket);
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }


    async Refunds(req, res, next) {
        try {
            const {number} = req.params;
            console.log(number);
            const {idUser} = req.query;
            let ticket = await Ticket.findOne({
                where: {number: number},
                include: [
                    {
                        model: Event,
                        as: 'event',
                    },
                    {
                        model: Order,
                        as: 'order',
                        include: [
                            {
                                model: User,
                                as: 'user',
                                attributes: ['email'],
                            },
                        ],
                    },
                    {
                        model: EntranceOptionPrice,
                        as: 'entranceOptionPrice',
                        include: [
                            {
                                model: EntranceOption,
                                as: 'entranceOption',
                            },
                        ],
                    },
                ],
            });
            if (!ticket) {
                return res.status(403).json({error: 'Билет не найден'});
            }
            if (ticket.status == false) {
                return res.status(404).message('Билет уже был использован.');
            }
            const data = [
                {
                    key: '1',
                    field: 'мероприятие',
                    value: ticket.event.title,
                },
                {
                    key: '2',
                    field: 'дата',
                    value: moment(ticket.event.dateTime).locale('ru').format('DD MMMM HH:mm'),
                },

            ];

            if (ticket.row) {
                data.push({
                    key: '3',
                    field: 'ряд',
                    value: ticket.row,
                });
            }

            if (ticket.seat) {
                data.push({
                    key: '4',
                    field: 'место',
                    value: ticket.seat,
                });
            }

            data.push({
                key: '6',
                field: 'почта клиента',
                value: ticket.order.user.email,
            })

            return res.json({number: ticket.number, data});
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async delete(req, res, next) {
        try {
            const {number} = req.query
            const ticket = await Ticket.findOne({
                where: {
                    number: number,
                },
            });

            if(ticket.entranceOptionPriceId !== null){
                let entranceOptionPrice = await EntranceOptionPrice.findOne({ where: { id: ticket.entranceOptionPriceId } });

                if(!entranceOptionPrice){
                    return next(ApiError.BadRequest(`Ценовая категория не найдена`));
                }

                entranceOptionPrice.seatsLeft += 1;

                try {
                    await entranceOptionPrice.save();
                } catch (error) {
                    return next(ApiError.InternalServerError(`Ошибка при обновлении ценовой категории: ${error.message}`));
                }
            }


            const deletedTicket = await Ticket.destroy({
                where: {
                    number: number,
                },
            });

            if (!deletedTicket) {
                return next(ApiError.BadRequest(`Билет не найдено`));
            }

            return res.json(deletedTicket)
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


}

module.exports = new ticketController()