
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const {User, Link, UpdatePassword, Controller} = require('../models/models');
const  mailService = require('./mailService')
const  tokenService = require('./tokenService')
const  UserDto = require('../dto/userDto')
const LinkService = require('./linkService')
const  ApiError = require('../exeptions/apiError')

class UserService{
    async registration(email, password, name, surname, birthday, role, creatorId){
        const candidate = await User.findOne({ where: { email: email } })
        if(candidate){
            throw ApiError.BadRequest( 'Пользователь с таким email уже зарегестрирован')
        }
        const hashPassword = await  bcrypt.hash(password,3 )
        const user = await  User.create({email: email.toLowerCase(), password: hashPassword, name:name, surname: surname, birthday: birthday, role:role})

       if(!!creatorId){
           const controller = await  Controller.create({creatorId: creatorId, controllerId: user.id, })
           return("Пользователь добавлен")
       }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        console.log(3)
        await  LinkService.saveLink(userDto.id, email  )
        console.log(4)
        await  tokenService.saveToken(userDto.id, tokens.refreshToken)
        console.log(5)

        return{...tokens, user: userDto}
    }

    async login(email, password){
        const  user = await  User.findOne({ where:{email: email.toLowerCase()}})
        if(!user){
            throw  ApiError.BadRequest(' Пользователь с таким email не найден')
        }
        const  isPassEquals = await  bcrypt.compare(password, user.password)
        if (!isPassEquals){
            throw  ApiError.BadRequest('Неверный пароль')
        }
        if(user.role.startsWith('BLOCKED')){
            throw  ApiError.BlockedRequest()
        }
        const userDto = new UserDto(user);
        const  tokens = tokenService.generateTokens({...userDto})
        await  tokenService.saveToken(user.id, tokens.refreshToken)

        return{...tokens, user: userDto}
    }
    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw  ApiError.UnauthorizedError()
        }
        const  userData = tokenService.validateRefreshToken(refreshToken)
        const  tokenFromDb = await  tokenService.findToken(refreshToken)
        if(!userData ){
            throw ApiError.BadRequest('12')
        }
        if( !tokenFromDb){
            throw ApiError.BadRequest('1234')
        }

       const  user = await User.findOne({where: {id: userData.id}})
        if(!user){
            throw ApiError.BadRequest({tokenFromDb})
        }
        const userDto = new UserDto(user);
        const  tokens = tokenService.generateTokens({...userDto})
        await  tokenService.saveToken(user.id, tokens.refreshToken)

        return{...tokens, user: userDto}

    }
    async receiveCode(email){
        const  user = await  User.findOne({ where:{email}})
        if(!user){
            throw  ApiError.BadRequest(' Пользователь не найден')
        }
        let  updatePassword = await  UpdatePassword.findOne({ where:{userId: user.id}})
        const randomNumber = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        if(updatePassword){
            updatePassword.code = randomNumber;
            return updatePassword.save();
        }
        updatePassword = await UpdatePassword.create({code:randomNumber, userId: user.id })
        await  mailService.sendUpdatePassword(email, randomNumber )
        return true;
    }
    async updatePassGet(email, code){
        console.log(email)
        const  user = await  User.findOne({ where:{email:email}})
        console.log(user.email)
        if(!user){
            throw  ApiError.BadRequest(' Пользователь не найден')
        }
        const  updatePassword = await  UpdatePassword.findOne({ where:{code, userId:user.id}})
        if(!updatePassword){
            throw  ApiError.BadRequest(' Код не верен')
        }
        return true;
    }
    async updatePass(email, password){
        const  user = await  User.findOne({ where:{email}})
        if(!user){
            throw  ApiError.BadRequest(' Пользователь не найден')
        }
        const hashPassword = await  bcrypt.hash(password,3 )

        user.password = hashPassword;
        user.save();
        return true;
    }


}
module.exports = new UserService();

