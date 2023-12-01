let {sequelizeCon,Model,DataTypes} = require("../init/dbConfig")
class Task extends Model{}
//  sequelizeCon.sync({alter : true})
Task.init({
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey :true
    },
    task_name : {
        type : DataTypes.STRING(100),
        allowNull : false
    },
    discription :{
        type : DataTypes.STRING(500),
        allowNull : false
    },
    assign_task_to : {
        type  : DataTypes.INTEGER,
        allowNull : true
    },
    status : {
        type : DataTypes.STRING(100),
        allowNull : true
    },
    created_by : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    updated_by : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
        allowNull:true
    },
    is_deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        allowNull:true
    }

},{
    tableName : "task",
    modelName : "Task",
    sequelize : sequelizeCon
})

module.exports = {Task}