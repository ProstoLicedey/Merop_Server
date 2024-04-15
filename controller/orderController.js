const {
   
    Order,
    Ticket,
    datePassword,
    Event,
    Entrance,
   
    EntranceOptionPrice,
    EntranceOption, HallOption, HallOptionPrice, Hall
} = require('../models/models')
const {Op} = require("sequelize"); //модель
const ApiError = require('../exeptions/apiError')
const fse = require('fs-extra');
const {join} = require("path");
const {Sequelize, DataTypes} = require('sequelize');

class OrderController {
    async create(req, res, next) {
        try {
            let {userId, tickets} = req.body;

            const order = await Order.create({userId});

            if (tickets) {

                tickets = JSON.parse(tickets);
                for (const i of tickets) {
                    console.log(i)
                    if (!!i.entranceOptionPriceId) {

                        let number =
                            String(i.eventId).substr(0, 1) +
                            String(userId).substr(0, 1) +
                            String(order.id).substr(0, 1) +
                            (Math.floor(Math.random() * 9000) + 1000);
                        let entranceOptionPrice = await EntranceOptionPrice.findOne({
                            where: {id: i.entranceOptionPriceId},
                        });

                        entranceOptionPrice.seatsLeft -= 1;
                        await entranceOptionPrice.save();

                        await Ticket.create({
                            orderId: order.id,
                            eventId: i.eventId,
                            number: Number(number),
                            entranceOptionPriceId: i.entranceOptionPriceId,
                        });
                    } else {

                        let number =
                            String(i.hall.event.id).substr(0, 1) +
                            String(userId).substr(0, 1) +
                            String(order.id).substr(0, 1) +
                            (Math.floor(Math.random() * 9000) + 1000);

                        await Ticket.create({
                            orderId: order.id,
                            eventId: i.hall.event.id,
                            number: Number(number),
                            row: i.row,
                            seat: i.seat,
                           // hallОptionPriceId: hallOptionPrice.id,
                        });
                    }
                }
            }

            return res.json(order)
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async getAll(req, res) {

    }


    async getTicket(req, res, next) {
        try {
            const {id} = req.params
            const order = await Ticket.findAll({
                where: {orderId: id},
                include: [
                    {
                        model: Event,
                        as: 'event'
                    },
                    {
                        model: EntranceOptionPrice,
                        as: 'entranceOptionPrice',
                        include: [
                            {
                                model: EntranceOption,
                                as: 'entranceOption',
                                include: [
                                    {
                                        model: Entrance,
                                        as: 'entrance'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })

            return res.json(order)
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
                                include: [{model: Entrance}],
                            },
                        ],
                    },
                ],
            });

            const formattedOrders = orders.map((order) => {
                const ticketsCount = order.tickets.length;
                const firstTicket = order.tickets.length > 0 ? order.tickets[0] : null;

                let address = null;
                let addressName = null;

                if (firstTicket && firstTicket.event) {
                    const event = firstTicket.event;

                    if (event.entrance) {
                        addressName = event.entrance.name;
                        address = event.entrance.address;
                    } else if (event.hall) {
                        addressName = event.hall.name;
                        address = event.hall.address;
                    }
                }
                return {
                    id: order.id,
                    ticketsCount,
                    dateTime: firstTicket && firstTicket.event ? firstTicket.event.dateTime : null,
                    address,
                    addressName,
                    title: firstTicket && firstTicket.event ? firstTicket.event.title : null,
                    status: firstTicket && firstTicket.event ? firstTicket.event.Status : null,
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

}

module.exports = new OrderController()