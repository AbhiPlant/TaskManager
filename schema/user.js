let {sequelizeCon,Model,DataTypes} = require("../init/dbConfig")
class User extends Model{}
// sequelizeCon.sync({alter:true})
User.init({
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    name : {
        type : DataTypes.STRING(50),
        allowNull : false
    },
    email_id : {
        type : DataTypes.STRING(100),
        allowNull : false
    },
    password : {
        type : DataTypes.STRING(500),
        allowNull : false
    },
    contact : {
        type : DataTypes.STRING(16),
        allowNull : false
    },
    token : {
        type : DataTypes.STRING(500),
        allowNull : true
    },
    is_active : {
        type : DataTypes.INTEGER(1),
        defaultValue : true
    },
    is_deleted : {
        type : DataTypes.INTEGER(1),
        defaultValue : false
    }
},{
    tableName : "user",
    modelName : "User",
    sequelize : sequelizeCon
})

module.exports={User}



