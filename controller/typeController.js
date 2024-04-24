const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Type, AgeRating, City} = require('../models/models')
const {Op} = require("sequelize"); //модель
const  ApiError = require('../exeptions/apiError')
class TypeController {
    async create(req, res, next) {
        try {


        } catch (e) {
            next( ApiError.BadRequest(e))
        }
    }

    async getAll(req, res) {
        const types = await Type.findAll()
        const formattedTypes = types.map(type => {
            return { label: type.name, value: type.id };
        });
        return res.json(formattedTypes);
    }
    async getAllRating(req, res) {
        const ratings = await AgeRating.findAll()
        ratings.sort((a, b) => a.age - b.age);
        const formattedTypes = ratings.map(rating => {
            return { label: rating.age + "+", value: rating.id };
        });
        return res.json(formattedTypes);
    }
    async getAllCity(req, res) {
        const cities = await City.findAll()

        cities.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
        });

        const formattedCity = cities.map(city => {
            return { label: city.name, value: city.id };
        });
        return res.json(formattedCity);
    }


    async getOne(req, res) {


    }
}

module.exports = new TypeController()