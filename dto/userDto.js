module.exports = class  UserDto{
    email;
    id;
    role;
    name;



constructor(model){
    this.email = model.email;
    this.id = model.id;
    this.role = model.role;
    this.name = model.name;
}
}