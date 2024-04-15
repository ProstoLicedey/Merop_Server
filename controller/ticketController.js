
const {Type, Order, Ticket,  UpdatePassword, Event, EntranceОptionPrice, Entrance, User, HallОptionPrice,
    EntranceOptionPrice, EntranceOption, Controller
} = require('../models/models')
const {Op} = require("sequelize"); //модель
const ApiError = require('../exeptions/apiError')
const fse = require('fs-extra');
const {join} = require("path");
const { Sequelize, DataTypes } = require('sequelize');
const moment = require("moment/moment");
class ticketController {



        // async getTicket(req, res, next) {
        //     try {
        //         const {id} = req.params
        //         const ticket = await Ticket.findOne({
        //             where: {number: id},
        //             attributes: ['number', 'row', 'seat', 'status'],
        //             include: [
        //                 {
        //                     model: Event,
        //                     as: 'event',
        //                     attributes: ['title', 'dateTime', 'userId', 'img'],
        //                 },
        //                 {
        //                     model: EntranceOptionPrice,
        //                     as: 'entranceOptionPrice',
        //                     attributes: [],
        //                     include: [
        //                         {
        //                             model: EntranceOption,
        //                             as: 'entranceOption',
        //                             attributes: ['name'],
        //                         },
        //                     ]
        //                 },
        //
        //             ]
        //
        //         })
        //
        //         return res.json(ticket)
        //     } catch (e) {
        //         next(ApiError.BadRequest(e));
        //     }
        // }
            async getTicket(req, res, next) {
            try {
                const {number } = req.params
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
                    return res.status(403).json({ error: 'Ticket not found' });
                }

                if (ticket.event.userId !== Number(idUser)) {
                    let controller = await Controller.findOne({
                        where: {creatorId: ticket.event.userId, controllerId: Number(idUser)}
                    })
                    console.log('ticket#' + controller)
                    if(!controller) {
                        return res.status(403).json({ error: 'Unauthorized' });
                    }

                }

                const modifiedTicket = {
                    ...ticket.toJSON(),  // Копирование свойств ticket
                    updatedAt: moment(ticket.updatedAt).locale('ru').format('DD MMMM HH:mm'),
                   event : {
                       ...ticket.event.toJSON(),
                       dateTime : moment(ticket.event.dateTime).locale('ru').format('DD MMMM HH:mm'),
                   }
                };

                return res.json(modifiedTicket);
            } catch (e) {
                next(ApiError.BadRequest(e));
            }
        }
        async Checked(req, res, next) {
            try {
                const {number } = req.params
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

                if ( ticket.event.userId !== Number(idUser)) {
                    let controller = await Controller.findOne({
                        where: {creatorId: ticket.event.userId, controllerId: Number(idUser)}
                    })
                    if(!controller) {
                        return res.json(403);
                    }
                }

                // Проверка и обновление значения ticket.status
                if (ticket.status) {
                    // Обновление значения status в базе данных на false
                    await Ticket.update({ status: false }, { where: { number: number } });

                }

                const modifiedTicket = {
                    ...ticket.toJSON(),  // Копирование свойств ticket
                    updatedAt: moment(ticket.updatedAt).locale('ru').format('DD MMMM HH:mm'),
                   event : {
                       ...ticket.event.toJSON(),
                       dateTime : moment(ticket.event.dateTime).locale('ru').format('DD MMMM HH:mm'),
                   }
                };

                return res.json(modifiedTicket);
            } catch (e) {
                next(ApiError.BadRequest(e));
            }
        }

    }

module.exports = new ticketController()