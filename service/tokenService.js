const jwt = require('jsonwebtoken')
const {Token} = require('../models/models')
const ApiError = require("../exeptions/apiError");

class TokenService{
    generateTokens(payload){
        const  accessToken = jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {expiresIn: '50m'})
        const  refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'})
        return{
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token){
        try{
            const  userData = jwt.verify(token, process.env.ACCESS_SECRET_KEY)
            return userData
        }catch (e){
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const  userData = jwt.verify(token, process.env.REFRESH_SECRET_KEY)
            return userData
        }catch (e){
            return null
        }
    }

    async saveToken(userId, refreshToken){
        const  tokenData = await Token.findOne({where: {userId: userId}})
        if (tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const  token = await Token.create({ refreshToken: refreshToken, userId:  userId})
        return token
    }

    async removeToken(refreshToken){
        const  tokenData = await  Token.destroy({where:{refreshToken}})
        return tokenData
    }

    async findToken(refreshToken){
        console.log("токен" + refreshToken)
        const  tokenData = await  Token.findOne({where: {refreshToken:refreshToken}})

        return tokenData
    }

    async
}
module.exports = new TokenService();
