const uuid = require('uuid') // пакт для генерации id для картинок
const path = require('path') // сохрание пути для картинки
const {Controller, User} = require('../models/models')
const {Op} = require("sequelize"); //модель
const ApiError = require('../exeptions/apiError')


class ControllerController {

    async getAll(req, res, next) {
        try {
            const {id} =  req.query
            const controllers = await Controller.findAll(
                {
                    where: {creatorId: id},
                    include: [
                        {
                            model: User,
                            as: 'controllerUser', // Use the correct association alias
                        },
                    ],
                })


            const formattedController = controllers.map((controller) => {
                return {
                    id: controller.id,
                    controllerId: controller.controllerUser.id,
                    email:controller.controllerUser.email ,
                    name: controller.controllerUser.surname + " " + controller.controllerUser.name ,

                };
            });

            return res.json(formattedController);
        } catch (e) {
            next(ApiError.BadRequest(e))
        }
    }

    async getController(req, res) {
        const types = await Type.findAll()
        const formattedTypes = types.map(type => {
            return {label: type.name, value: type.id};
        });
        return res.json(formattedTypes);
    }


    async getOne(req, res) {


    }
    async delete(req, res, next) {
        try {
            const {id} = req.query
            const deletedController = await Controller.destroy({
                where: {
                    controllerId: id,
                },
            });
            const deletedUser = await User.destroy({
                where: {
                    id: id,
                },
            });

            if (!deletedController && !deletedUser) {
                return next(ApiError.BadRequest(`Controller with id ${id} not found`));
            }

            return res.json({ message: `Controller with id ${id} has been deleted successfully` });
        } catch (e) {
            next(ApiError.BadRequest(e));
        }
    }
}

module.exports = new ControllerController()