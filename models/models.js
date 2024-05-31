const sequelize  = require('./db')
const  {DataTypes} = require('sequelize')
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true,},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.TEXT},
    birthday: {type: DataTypes.DATEONLY},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const defaultUser = {
    email: 'admin@gmail.com',
    password: 'Qwerty123',
    name: 'Admin',
    surname: 'Adminovich',
    role: 'ADMIN', // Или любая другая роль, если требуется
};

User.afterSync(async () => {
    const user = await User.findOne({ where: { email: defaultUser.email } });
    if (!user) {
        // Хеширование пароля перед сохранением в базу данных
        const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
        await User.create({ ...defaultUser, password: hashedPassword });
    }
});
const Controller = sequelize.define('controller', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Это должно быть имя таблицы модели User
            key: 'id',
        },
    },
    controllerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Это должно быть имя таблицы модели User
            key: 'id',
        },
    },

})
const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    refreshToken: {type: DataTypes.STRING, required: true},
})
const UpdatePassword = sequelize.define('updatePassword', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.INTEGER,  required: true},
})
const Link = sequelize.define('link', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type:  DataTypes.STRING},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Ticket = sequelize.define('ticket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.INTEGER},
    row: {type: DataTypes.INTEGER},
    seat: {type: DataTypes.INTEGER},
    status: {type: DataTypes.BOOLEAN, defaultValue:true},
})

const Event = sequelize.define('event', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    description: {type: DataTypes.TEXT},
    dateTime: {type: DataTypes.DATE},
    img: {type: DataTypes.STRING, allowNull: false},
    Status: {type: DataTypes.STRING, defaultValue: "ACTIVE"},
})

const AgeRating = sequelize.define('ageRating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    age: {type: DataTypes.INTEGER},
})

AgeRating.afterSync(async () => {
    // Заполнение таблицы данными по умолчанию
    const defaultRatings = [0, 6, 12, 14, 16, 18];
    await Promise.all(defaultRatings.map(async (age) => {
        await AgeRating.findOrCreate({ where: { age } });
    }));
});


const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING}
})

Type.afterSync(async () => {
    // Заполнение таблицы данными по умолчанию
    const defaultTypes = [
        "Концерты",
        "Спектакль",
        "Спорт",
        "Кино",
        "Фестивали",
        "Stand-up",
        "Выставки",
        "Лекции"
    ];
    await Promise.all(defaultTypes.map(async (name) => {
        await Type.findOrCreate({ where: { name } });
    }));
});

const Marketing = sequelize.define('marketing', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, defaultValue: "NEW"},
    numberDays: {type: DataTypes.INTEGER},
    dateStart: {type: DataTypes.DATE}
})

const City = sequelize.define('city', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    ideficator: {type: DataTypes.STRING},
})

const Entrance = sequelize.define('entrance', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    totalSeats: {type: DataTypes.INTEGER},

})
const EntranceOption = sequelize.define('entranceOption', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    totalSeats: {type: DataTypes.INTEGER},
})
const EntranceOptionPrice = sequelize.define('entranceOptionPrice', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.INTEGER, defaultValue: 0},
    seatsLeft: {type: DataTypes.INTEGER},
})
const Hall = sequelize.define('hall', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    address: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    numberRows: {type: DataTypes.INTEGER},
    numberSeatsInRow: {type: DataTypes.INTEGER},

})
const HallPassage = sequelize.define('hallPassage', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    afterRow: {type: DataTypes.INTEGER},
    afterSeat: {type: DataTypes.INTEGER},

})
const HallOption = sequelize.define('hallOption', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING},
    rowStart: {type: DataTypes.INTEGER},
    rowFinish: {type: DataTypes.INTEGER},
    seatStart: {type: DataTypes.INTEGER},
    seatFinish: {type: DataTypes.INTEGER},

})
const HallOptionPrice = sequelize.define('hallOptionPrice', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.INTEGER,  defaultValue: 0},

})



User.hasMany(Order)
Order.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

User.hasOne(UpdatePassword)
UpdatePassword.belongsTo(User)

User.hasOne(Link)
Link.belongsTo(User)

/////////////////////////////

Order.hasMany(Ticket)
Ticket.belongsTo(Order)

EntranceOptionPrice.hasMany(Ticket)
Ticket.belongsTo(EntranceOptionPrice)


User.hasMany(Event)
Event.belongsTo(User)

User.hasMany(Entrance)
Entrance.belongsTo(User)

User.hasMany(Hall)
Hall.belongsTo(User)
//////////
Event.hasMany(Ticket)
Ticket.belongsTo(Event)

AgeRating.hasMany(Event)
Event.belongsTo(AgeRating)

Type.hasMany(Event)
Event.belongsTo(Type)

Event.hasMany(Marketing)
Marketing.belongsTo(Event)

Entrance.hasMany(Event)
Event.belongsTo(Entrance)

Hall.hasMany(Event)
Event.belongsTo(Hall)

Event.hasMany(EntranceOptionPrice)
EntranceOptionPrice.belongsTo(Event)

Event.hasMany(HallOptionPrice)
HallOptionPrice.belongsTo(Event)

/////////

Hall.hasMany(HallOption)
HallOption.belongsTo(Hall)

HallOption.hasMany(HallOptionPrice)
HallOptionPrice.belongsTo(HallOption)


Hall.hasMany(HallPassage)
HallPassage.belongsTo(Hall)

City.hasMany(Hall)
Hall.belongsTo(City)

///////////

Entrance.hasMany(EntranceOption)
EntranceOption.belongsTo(Entrance)

EntranceOption.hasMany(EntranceOptionPrice)
EntranceOptionPrice.belongsTo(EntranceOption)

EntranceOption.hasMany(EntranceOptionPrice)
EntranceOptionPrice.belongsTo(EntranceOption)

City.hasMany(Entrance)
Entrance.belongsTo(City)

////////

User.hasMany(Controller, { foreignKey: 'creatorId', as: 'createdControllers' });
User.hasMany(Controller, { foreignKey: 'controllerId', as: 'controlledControllers' });
Controller.belongsTo(User, { foreignKey: 'creatorId', as: 'user' });
Controller.belongsTo(User, { foreignKey: 'controllerId', as: 'controllerUser' });

module.exports = {
    User,
    Token,
    UpdatePassword,
    Link,
    Order,
    Ticket,
    Event,
    AgeRating,
    Type,
    Entrance,
    EntranceOption,
    EntranceOptionPrice,
    Hall,
    HallPassage,
    HallOption,
    HallOptionPrice,
    Controller,
    City,
    Marketing
}