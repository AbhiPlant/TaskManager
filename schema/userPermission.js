let {sequelizeCon,Model,DataTypes} = require("../init/dbConfig")
class UP extends Model{}
//sequelizeCon.sync({alter:true})
UP.init({
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    user_id : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    permission_id : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
},{
    tableName : "userpermission",
    modelName : "UP",
    sequelize : sequelizeCon
})

module.exports = {UP}