const userService = require('../service/userService')
const linkService = require('../service/linkService')
const {validationResult} = require('express-validator')
const ApiError = require("../exeptions/apiError");
const {
    Event,
    Hall,
    Entrance,
    AgeRating,
    Type,
    EntranceОptionPrice,
    HallОptionPrice,
    User, Ticket, Order, EntranceOptionPrice, EntranceOption
} = require("../models/models");
const {isFloat} = require("validator");
const moment = require("moment");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            const {email, password, name, surname, birthday, role, creatorId} = req.body;
            const userData = await userService.registration(email, password, name, surname, birthday, role, creatorId)

            if (userData !== "Пользователь добавлен") {
                res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            }
            return res.json(userData)

        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})

            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(!!token ? true : false);
        } catch (e) {
            next(e)
        }
    }


    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await linkService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            console.log('df' + refreshToken);
            const {email, password, name, surname, birthday} = req.body;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async delete(req, res, next) {
        try {

        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            const {email, password, name, surname, birthday} = req.body;

            // Check if the user with the given id exists
            const user = await User.findOne({where: {id}});

            if (!user) {
                throw ApiError.NotFound('User not found');
            }

            // Update user information
            user.email = email || user.email;
            user.password = password || user.password;
            user.name = name || user.name;
            user.surname = surname || user.surname;
            user.birthday = birthday || user.birthday;

            // Save the updated user
            await user.save();

            return res.json(user);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async block(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw ApiError.NotFound('Пользователь не найден');
            }

            // Проверяем, начинается ли роль пользователя с "BLOCKED"
            if (user.role.startsWith('BLOCKED')) {
                // Если да, удаляем "BLOCKED" из начала роли
                user.role = user.role.replace('BLOCKED', '').trim();
            } else {
                // Если нет, добавляем "BLOCKED" в начало роли
                user.role = `BLOCKED ${user.role}`;
            }

            await user.save();

            return res.json(user);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }


    }

    async receiveCode(req, res, next) {
        try {
            const {email} = req.body;
            const userData = await userService.receiveCode(email);
            return res.json(userData)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async inputCode(req, res, next) {
        try {
            const {email, code} = req.body;
            const userData = await userService.updatePassGet(email, code);
            return res.json(userData)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async updatePass(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.updatePass(email, password);
            return res.json(userData)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const user = await User.findOne({
                where: {id},

            })

            return res.json(user)
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async getForAdmin(req, res, next) {
        try {

            let {email} = req.query;

            let user = await User.findOne({
                where: {email},
                include: [
                    {
                        model: Event,

                    },
                    {
                        model: Order,
                        include: [
                            {
                                model: Ticket,
                                include: [
                                    {
                                        model: Event,
                                    },
                                ]
                            },
                        ]
                    }
                ],
            });
            if (!user) {
                return res.status(403).json({error: 'Пользователь не найден'});
            }

            const isController = user.role == 'CREATOR'
            const data = [
                {
                    key: '1',
                    field: 'Почта',
                    value: user.email,
                },
                {
                    key: '2',
                    field: 'Роль',
                    value: user.role,
                },
                {
                    key: '3',
                    field: isController ? 'Организация' : 'Имя',
                    value: user.name,
                },
                {
                    key: '4',
                    field: isController ? 'Описание' : 'Фамилия',
                    value: user.surname,
                },
                {
                    key: '5',
                    field: 'Дата регистрации',
                    value: moment(user.createdAt).locale('ru').format('DD MMMM HH:mm'),
                },

            ];

            if (!!user.events) {
                const eventsData = user.events.map(event => {
                    return {
                        key: event.id,
                        field: event.id,
                        value: event.title
                    };
                });
                if (eventsData != 0) {
                    data.push({
                        key: '6',
                        field: 'Мероприятий',
                        value: eventsData.length,
                        children: eventsData
                    });
                }
            }

            if (user.orders) {

                // Инициализация переменных для подсчета билетов
                let totalTickets = 0;
                let activeTickets = 0;
                let inactiveTickets = 0;
                let usedTickets = 0;
                var currentTime = new Date();
                // Обход всех заказов пользователя
                user.orders.forEach(order => {
                    // Обход всех билетов в заказе
                    order.tickets.forEach(ticket => {
                        // Увеличение общего количества билетов
                        totalTickets++;

                        // Проверка статуса билета
                        if (ticket.status) {
                            activeTickets++; // Увеличение количества активных билетов
                        } else if (ticket.status && ticket.event.dateTime < currentTime) {
                            inactiveTickets++; // Увеличение количества неактивных билетов
                        } else if (!ticket.status) {
                            usedTickets++; // Увеличение количества неактивных билетов
                        }
                    });
                });

                if (totalTickets != 0) {
                    data.push({
                        key: '7',
                        field: 'Всего забронированно билетов    ',
                        value: totalTickets,
                        children: [
                            {key: '9', field: 'Забронировано на предстоящие мероприятия', value: activeTickets},
                            {key: '11', field: 'Использовано', value: usedTickets},
                            {key: '10', field: 'Не использовано на прошедших мероприятиях', value: inactiveTickets},
                        ]
                    });
                }
            }


            return res.json(data);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
}

module.exports = new UserController()