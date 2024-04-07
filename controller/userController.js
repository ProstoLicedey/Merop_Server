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
    User
} = require("../models/models");
const {isFloat} = require("validator");

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);

            const {email, password, name, surname, birthday, role, creatorId} = req.body;
            const userData = await userService.registration(email, password, name, surname, birthday, role, creatorId)

           if(userData !== "Пользователь добавлен"){
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

}

module.exports = new UserController()