const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Event, EntranceOptionPrice, EntranceOption, Entrance, Hall, HallOption, City} = require('../models/models')
const {Op} = require("sequelize"); //модель
const {sequelize} = require('sequelize')
const ApiError = require('../exeptions/apiError')

class EventController {

    async createEntrance(req, res, next) {
        try {
            let {address, name, option, totalSeats, userId, city} = req.body

            let cityDB = await City.findOne({ where: { ideficator: city.value } });

            if(!cityDB){
                cityDB = await City.create({
                    name: city.label,
                    ideficator: city.value,
                });
            }

            // Добавление информации о входе
            const entrance = await Entrance.create({
                address: address,
                name: name,
                totalSeats: totalSeats,
                userId: userId,
                cityId: cityDB.id,
            });

            // Добавление информации о входных опциях
            for (const i of option) {
                await EntranceOption.create({
                    name: i.name,
                    totalSeats: i.totalSeats,
                    entranceId: entrance.id,  // Связывание опции с входом
                });
            }

            return res.json(entrance);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async update(req, res, next) {
        try {
            const {id} = req.params;
            let {address, name, option, userId, totalSeats, eventCount, city} = req.body

            let cityDB = await City.findOne({ where: { ideficator: city.value } });

            if(!cityDB){
                cityDB = await City.create({
                    name: city.label,
                    ideficator: city.value,
                });
            }

            const entranceData = {
                name,
                address,
                userId,
                totalSeats,
                cityId: cityDB.id
            };

            const entrance = await Entrance.update(entranceData, {
                where: {id: id}
            });


            if (eventCount > 0) {
                for (const i of option) {
                    await EntranceOption.update(
                        {
                            name: i.name,
                            totalSeats: i.totalSeats,
                            entranceId: id,  // Связывание опции с входом
                        },
                        {
                            where: { id: i.id } // Условие для обновления определенной записи EntranceOption
                        }
                    );
                }
            } else {
                await EntranceOption.destroy({
                    where: {entranceId: id}
                });

                for (const i of option) {
                    await EntranceOption.create({
                        name: i.name,
                        totalSeats: i.totalSeats,
                        entranceId: id,  // Связывание опции с входом
                    });
                }
            }


            return res.json(entrance);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }


    async getAll(req, res, next) {

    }


    async getFromEvent(req, res, next) {
        try {
            const {id} = req.params;
            let {eventId} = req.query;
            const event = await EntranceOption.findAll({
                where: {entranceId: id},
            });

            const updatedEvent = await Promise.all(event.map(async (item) => {
                const entranceOptionPrice = await EntranceOptionPrice.findOne({
                    where: {eventId: eventId, entranceOptionId: item.id},
                });

                // Добавляем объект только если entranceOptionPrice не равен null
                if (entranceOptionPrice !== null) {
                    return {...item.toJSON(), entranceOptionPrice};
                }
                return null; // Возвращаем null для исключения объекта из результирующего массива
            }));

            // Фильтруем элементы, исключая null
            const filteredEvent = updatedEvent.filter(item => item !== null);

            return res.json(filteredEvent);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async getByID(req, res, next) {
        try {
            const {id} = req.params;
            let {type} = req.query;
            console.log(id, type)
            let answer;
            let includeOptionsKey, optionsModelKey;

            if (type === "Entrance") {
                includeOptionsKey = "entranceOptions";
                optionsModelKey = "EntranceOption";
                answer = await Entrance.findOne({
                    where: {id: id},
                    include: EntranceOption,
                });
            } else if (type === "Hall") {
                includeOptionsKey = "hallOptions";
                optionsModelKey = "HallOption";
                answer = await Hall.findOne({
                    where: {id: id},
                    include: HallOption,
                });
            }

            // Проверка на наличие ответа
            if (!answer) {
                return res.status(404).json({message: "Not Found"});
            }

            const options = answer[includeOptionsKey].map(option => ({
                id: option.id,
                name: option.name,
                totalSeats: option.totalSeats ? option.totalSeats : (option.rowFinish - option.rowStart + 1) * (option.seatFinish - option.seatStart + 1),

                createdAt: option.createdAt,
                updatedAt: option.updatedAt,
                hallId: option.hallId || option.entranceId, // общий ключ для hallOptions и entranceOptions
            }));
            delete answer[includeOptionsKey];

            const newAnswer = {
                ...answer.toJSON(),
                options: options,
                type: type
            };
            delete newAnswer[includeOptionsKey];

            return res.json(newAnswer);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

    async getEntenceHallUser(req, res, next) {
        try {
            const {id} = req.params;
            const entrance = await Entrance.findAll({
                where: {userId: id},
            });
            const hall = await Hall.findAll({
                where: {userId: id},
            });
            const transformed = entrance.map(entry => ({
                value: entry.id,
                label: entry.name,
                type: 'Entrance', // Указать тип объекта как Entrance
            })).concat(hall.map(h => ({
                value: h.id,
                label: h.name,
                type: 'Hall', // Указать тип объекта как Hall
            })));


            return res.json(transformed);
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }

}

module.exports = new EventController()