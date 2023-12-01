let {Sequelize,Model,DataTypes,QueryTypes,Op} = require("sequelize")
// let config = require("config")
// let mysqlConfig = config.get("mysql")
let sequelizeCon = new Sequelize("Mysql://root:Abhishek2002@localhost/todolist")
// sequelizeCon.sync({alter:true})
sequelizeCon.authenticate().then(()=>{
    console.log("Database connected Successfully");
}).catch((err)=>{
    console.log("Database Not Connected",err);
})

module.exports = {
    sequelizeCon,
    Model,
    DataTypes,
    QueryTypes,
    Op
}
