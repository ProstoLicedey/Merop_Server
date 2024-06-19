const {

    Order,
    Ticket,
    datePassword,
    Event,
    Entrance,

    EntranceOptionPrice,
    EntranceOption, HallOption, HallOptionPrice, Hall, City, User
} = require('../models/models')
const {Op} = require("sequelize"); //модель
const ApiError = require('../exeptions/apiError')
const fse = require('fs-extra');
const {join} = require("path");
const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require("sequelize");
const moment = require("moment/moment");

class OrderController {
    async create(req, res, next) {
        try {
            let {userId, tickets} = req.body;
            const order = await Order.create({userId});

            if (tickets) {
                tickets = JSON.parse(tickets);
                for (const i of tickets) {
                    let number = `${String(i.eventId || i.hall.event.id).substr(0, 1)}${String(userId).substr(0, 1)}${String(order.id).substr(0, 1)}${Math.floor(Math.random() * 9000) + 1000}`;

                    let commonTicketParams = {
                        orderId: order.id,
                        eventId: i.eventId || i.hall.event.id,
                        number: Number(number),
                    };

                    if (!!i.entranceOptionPriceId) {
                        let entranceOptionPrice = await EntranceOptionPrice.findOne({where: {id: i.entranceOptionPriceId}});
                        entranceOptionPrice.seatsLeft -= 1;
                        await entranceOptionPrice.save();

                        await Ticket.create({
                            ...commonTicketParams,
                            entranceOptionPriceId: i.entranceOptionPriceId,
                        });
                    } else {
                        await Ticket.create({
                            ...commonTicketParams,
                            row: i.row,
                            seat: i.seat,
                        });
                    }
                }
            }

            return res.json(order);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


    async getAll(req, res) {

    }


    async getTicket(req, res, next) {
        try {
            const {id} = req.params;
            const orders = await Ticket.findAll({
                where: {orderId: id},
                include: [
                    {
                        model: Event,
                        as: 'event',
                        include: [
                            {model: Hall, as: 'hall', include: [{model: City, as: 'city'}]},
                            {model: Entrance, as: 'entrance', include: [{model: City, as: 'city'}]},
                            {
                                model: EntranceOptionPrice,
                                as: 'entranceOptionPrices',
                                include: [{model: EntranceOption, as: 'entranceOption'}]
                            },
                            {
                                model: HallOptionPrice,
                                as: 'hallOptionPrices',
                                include: [{model: HallOption, as: 'hallOption'}]
                            }
                        ]
                    }
                ]
            });

            const formattedOrders = orders.map(order => {
                const {
                    id: ticketId,
                    entrance,
                    title,
                    dateTime,
                    hall,
                    entranceOptionPrices,
                    hallOptionPrices
                } = order.event;

                const venue = hall ? hall : entrance;
                const venueName = venue ? venue.name : '';
                const venueAddress = venue ? "г. "+ venue.city.name + " "+ venue.address : '';
                const options = hall ? hallOptionPrices : entranceOptionPrices.filter(option => option.id === order.entranceOptionPriceId);

                const validOption = options.find(option => {
                    if (option.hallOption) {
                        return option.hallOption.seatStart <= order.seat &&
                            option.hallOption.seatFinish >= order.seat &&
                            option.hallOption.rowStart <= order.row &&
                            option.hallOption.rowFinish >= order.row;
                    } else if (option.entranceOption && option.id === order.entranceOptionPriceId) {
                        return true;
                    }
                    return false;
                });

                let optionName = validOption ? (validOption.hallOption ? validOption.hallOption.name : validOption.entranceOption ? validOption.entranceOption.name : 'Unknown Option') : 'Unknown Option';
                let optionPrice = validOption ? validOption.price : 0;

                return {
                    ticketId,
                    number: order.number,
                    createdAt: order.createdAt,
                    title,
                    dateTime,
                    venueName,
                    venueAddress,
                    optionName,
                    optionPrice,
                    row: order.row,
                    seat: order.seat
                };
            });

            return res.json(formattedOrders);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


    async getOrders(req, res, next) {
        try {
            const {id} = req.params;

            const orders = await Order.findAll({
                where: {userId: id},
                include: [
                    {
                        model: Ticket,
                        include: [
                            {
                                model: Event,
                                include: [
                                    {model: Entrance, include: [{model: City, as: 'city'}]},
                                    {model: Hall, include: [{model: City, as: 'city'}]}, ],
                            },
                        ],
                    },
                ],
            });

            const formattedOrders = orders.map((order) => {
                const ticketsCount = order.tickets.length;
                const firstTicket = ticketsCount > 0 ? order.tickets[0] : null;

                let address = null;
                let addressName = null;

                if (firstTicket && firstTicket.event) {
                    const event = firstTicket.event;

                    if (event.entrance) {
                        addressName = event.entrance.name;
                        address = event.entrance.city.name + " " + event.entrance.address;
                    } else if (event.hall) {
                        addressName = event.hall.name;
                        address = event.hall.city.name + " " + event.hall.address;
                    }
                }
                let status = false;
                let usedNotAll = false
                order.tickets.forEach((ticket) => {
                    console.log('order' + order.id + "ticket" + ticket.number + ticket.status)
                    if (ticket.status) {
                        status = true
                    }
                    else {
                        usedNotAll = true
                    }
                });

                return {
                    id: order.id,
                    ticketsCount,
                    dateTime: firstTicket && firstTicket.event ? firstTicket.event.dateTime : null,
                    address,
                    addressName,
                    title: firstTicket && firstTicket.event ? firstTicket.event.title : null,
                    status: usedNotAll && status ? 'notAll' : status,
                    img: firstTicket && firstTicket.event ? firstTicket.event.img : null,
                };
            });

            formattedOrders.sort((a, b) => {
                return new Date(b.dateTime) - new Date(a.dateTime);
            });

            return res.json(formattedOrders);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }

    }

    async getByuers(req, res, next) {
        try {
            const {id} = req.params;

            const event = await Event.findAll({
                where: {userId: id},
                include: [
                    {
                        model: Ticket,
                        include: [
                            {
                                model: Event,
                                include: [{model: Entrance}],
                            },
                        ],
                    },
                ],
            });

            return res.json(event);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
    async toCreator(req, res, next) {
        try {
            const { id } = req.params;

            // Получение заказов
            const orders = await Order.findAll({
                include: [
                    {
                        model: Ticket,
                        include: [
                            {
                                model: Event,
                                where: { userId: id },
                            },
                        ],
                    },
                    {
                        model: User,
                    },
                ],
            });
            const formattedOrders = orders
                .map(order => {
                    if (order.tickets && order.tickets.length > 0) {
                        const formattedOrder = {
                            id: order.id,
                            title:  "№" + order.tickets[0]?.event?.id + " " + order.tickets[0]?.event?.title,
                            email: order.user?.email,
                            FIO: order.user?.name + " "+ order.user?.surname,
                            createdAt: moment(order.createdAt).locale('ru').format('DD MMMM HH:mm'),
                            countTicket: order.tickets.length,
                            countTicketUsed: order.tickets.filter(ticket => ticket.status === false).length
                        };

                        return formattedOrder;
                    }
                    return null;
                })
                .filter(order => order !== null);

            return res.json(formattedOrders);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }






}

module.exports = new OrderController()