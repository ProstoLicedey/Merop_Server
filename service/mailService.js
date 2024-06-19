const nodemailer = require('nodemailer')
class MailService{

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD

            }
        })
    }
    async sendActivationMail(to, link){
        await  this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на Merop',
            text: '',
            html:
            `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href="${link}">${link}</a>
                <h1></h1>
                <h4>Если вы не создавали аккаунт, просто не нажимайте на ссылку</h4>
            </div>
            `
        })
    }
    async sendUpdatePassword(to, code){
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Восстановление пароля',
                text: '',
                html:
                    `
            <div>
                <h3>Код востановления пароля для аккаунта</h3>
                <h1>${code}</h1>
                <h4>Не передавайте третим лицам</h4>
            </div>
            `
            })
        }
        catch (e){
            console.log(e)
        }
    }


}
module.exports = new MailService();