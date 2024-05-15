const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {
    Type,
    AgeRating,
    City,
    Order,
    Event,
    Hall,
    Entrance,
    EntranceOptionPrice,
    EntranceOption,
    Ticket, Marketing, User
} = require('../models/models')
const {Op} = require("sequelize"); //модель
const ApiError = require('../exeptions/apiError')
const moment = require("moment/moment");

class MarketingController {
    async create(req, res, next) {
        try {
            let {eventId, numberDays} = req.body;

            const marketing = await Marketing.create({ numberDays, eventId});
            return res.json(marketing);
        } catch (e) {
            next( ApiError.BadRequest(e))
        }
    }

    async getAll(req, res, next) {

    }

    async getAdmin(req, res, next) {
        try {
            const marketing = await Marketing.findAll({
                include: [{
                    model: Event,
                    as: 'event' ,
                    include: [
                        { model: User, as: 'user' }]
                }]
            });

            const transformedData = marketing.map(item => {
                const startDate = item.dateStart ? moment(item.dateStart).locale('ru').format('DD.MM.YYYY') : null;
                const endDate = item.dateStart ? moment(item.dateStart).add(item.numberDays, 'days').locale('ru').format('DD.MM.YYYY') : null;
                const date = startDate && endDate ? startDate + " / " + endDate : 'подача заявки: ' + moment(item.createdAt).locale('ru').format('DD.MM.YYYY hh:mm');

                return {
                    id: item.id,
                    title: "№" + item.event.id + " " + item.event.title,
                    email: item.event.user.email,
                    status: item.status,
                    numberDays: item.numberDays,
                    date: date
                };
            });

            // Сортировка по статусу
            transformedData.sort((a, b) => {
                const statusOrder = {
                    NEW: 0,
                    ACCEPTED: 1,
                    ACTIVE: 2,
                    CANCELLED: 3,
                    STOP: 4,
                    COMPLETED: 5,

                };

                return statusOrder[a.status] - statusOrder[b.status];
            });

            return res.json(transformedData);
        } catch (e) {
            next(e);
        }
    }


    async getCreator(req, res, next) {
        try {
            const { id } = req.params;

            const events = await Event.findAll({
                where: {
                    userId: id
                },
                include: [
                    {
                        model: Marketing,
                        as: 'marketings',
                    }
                ]
            });

            // Обновление статуса маркетинговых мероприятий на COMPLETED, если условие выполнено
            const now = moment();
            for (const event of events) {
                for (const marketing of event.marketings) {
                    if (marketing.status === 'ACTIVE' && moment(marketing.dateStart).add(marketing.numberDays, 'days').isBefore(now)) {
                        marketing.status = 'COMPLETED';
                        await marketing.save(); // Сохранение изменений в базе данных
                    }
                }
            }

            // Формирование массива объектов в требуемом формате
            const marketingData = events.reduce((acc, event) => {
                event.marketings.forEach(marketing => {
                    acc.push({
                        id: marketing.id,
                        title: "№" + event.id + " " + event.title,
                        status: marketing.status,
                        numberDays: marketing.numberDays,
                        date: marketing.dateStart ? moment(marketing.dateStart).locale('ru').format('DD.MM.YYYY') + " / " + moment(marketing.dateStart).add(marketing.numberDays, 'days').locale('ru').format('DD.MM.YYYY') : 'реклама еще не стартовала'
                    });
                });
                return acc;
            }, []);

            marketingData.sort((a, b) => {
                const statusOrder = {
                    NEW: 0,
                    ACCEPTED: 1,
                    ACTIVE: 2,
                    CANCELLED: 3,
                    STOP: 4,
                    COMPLETED: 5,

                };

                return statusOrder[a.status] - statusOrder[b.status];
            });

            return res.json(marketingData);
        } catch (e) {
            next(e);
        }
    }

    async getEvent(req, res, next) {
        try {
            const { id } = req.params;

            const events = await Event.findAll({
                where: {
                    userId: id,
                    dateTime: {
                        [Op.gt]: new Date() // выбираем только те события, у которых dateTime больше текущего времени
                    }
                },

            });

            // Преобразуем полученные события в нужный формат
            const formattedEvents = events.map(event => {
                const daysLeft = Math.ceil((new Date(event.dateTime) - new Date()) / (1000 * 60 * 60 * 24));
                return {
                    value: event.id,
                    label: `№${event.id} | ${event.title} | ${moment(event.dateTime).locale('ru').format('DD MMMM HH:mm')}`,
                    daysLeft: daysLeft
                };
            });

            return res.json(formattedEvents);
        } catch (e) {
            next(e);
        }
    }
    async statusUpdate(req, res, next) {
        try {
            try {
                const {id} = req.params;
                let {status} = req.body;

                if(status === undefined || status === null){
                    next( ApiError.BadRequest("status не указан"))
                }

                const marketing = await Marketing.findOne({ where: { id } });

                if (!marketing) {
                    throw ApiError.NotFound('Мероприятие не найдено');
                }

                marketing.status = status

                if(status === 'ACTIVE'){
                    marketing.dateStart = new Date();
                }
                await marketing.save();

                return res.json(marketing);
            } catch (e) {
                next(ApiError.BadRequest(e));
            }
            return res.json();
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.query
            const deletedMarceting = await Marketing.destroy({
                where: {
                    id: id,
                },
            });


            if (!deletedMarceting) {
                return next(ApiError.BadRequest(`Заявка не найдено`));
            }

            return res.json({message: `Заявка с  id ${id} успешно удалена`});
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }



}

module.exports = new MarketingController()