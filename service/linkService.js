const {User, Link} = require("../models/models");
const uuid = require("uuid");
const mailService = require("./mailService");
const ApiError = require("../exeptions/apiError");

class LinkService{
    async activate(activationLink){
        const  link = await  Link.findOne({ where: {activationLink} })
        if(!link){
            throw  ApiError.BadRequest('Некорректная ссылка активации')
        }
        link.isActivated = true;
        await  link.save();

    }
    async saveLink(userId, email){
        const  activationLink = uuid.v4()
        //отключение писем
       // await  mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`)
        const  link = await Link.create({activationLink: activationLink, userId: userId})
        return link
    }
}
module.exports = new LinkService()