let {User} = require("../schema/user")
let {Task} = require("../schema/taskSchema")
let joi = require("joi")
const { where } = require("sequelize")

async function create(params,userData){
    let valid = await createValid(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let find = await Task.findOne({where:{task_name:params.taskname}}).catch((err)=>{
        return {error:err}
    })
    if(find || (find && find.error)){
        console.log(find)
        return {error:"This task already exists"}
    }

    let task = {
        task_name : params.taskname,
        discription : params.description,
        created_by : userData.id,
        updated_by : userData.id
    }

    let data = await Task.create(task).catch((err)=>{
        return {error : err}
    })
    console.log("20",data);
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }

    return {data : data}
}

async function createValid(data){
    let schema = joi.object({
        taskname : joi.string().min(5).max(100).required(),
        description : joi.string().min(5).max(500).required(),
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        let errMsg = []
        for(let i of valid.error.details){
            errMsg.push(i.message)
        }
        return {error : errMsg}
    }
    return {data : valid}
}

async function view(id){
    let valid = await idCheck({id}).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let data = await Task.findOne({where:{id}}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Task Not Exist",status : 404}
    }
    return {data : data}
}

async function idCheck(data){
    let schema = joi.object({
        id : joi.number().required()
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        let errMsg = []
        for(let i of valid.error.details){
            errMsg.push(i.message)
        }
        return {error : errMsg}
    }
    return {data : valid}
}

async function viewAll(){
    let data = await Task.findAll().catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }
    return {data : data}
}

async function update(id,params,userData){
    params.id = id
    let valid = await updateValid(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let data = await Task.findOne({where:{id},raw:true}).catch((err)=>{
        return {error : err}
    })
    console.log("103",data);
    if(!data || (data && data.error)){
        return {error : "Task not exist",status : 404}
    }

    data.task_name = params.taskname
    data.discription = params.description
    data.updated_by = userData.id
    // data.assign_task_to = params.task_assingn_to 


    let updateTask = await Task.update(data,{where:{id}}).catch((err)=>{
        return {error : err}
    })
    if(!updateTask || (updateTask && updateTask.error)){
        return {error  : "Internal Server Error",status : 500}
    }

    return {data : data}

}

async function updateValid(data){
    let schema = joi.object({
        id : joi.number().required(),
        taskname : joi.string().min(5).max(100),
        description : joi.string().min(10).max(500),
       
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        let errMsg = []
        for(let i of valid.error.details){
            errMsg.push(i.message)
        }
        return {error : errMsg}
    }
    return {data : valid}
}

async function tdelete(id,decision){
    let valid = await idCheck({id}).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let findTask = await Task.findOne({where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(findTask.is_deleted == decision){
        return {error:"This task is already "+decision+" by you"}
    }

    let data = await Task.update({is_deleted:decision},{where:{id}}).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }
    if(data <= 0){
        return {error : 'No such record found'}
    }
    return {data:findTask}
}


async function taskAssign(taskid,params,userData){
    params.id = taskid
    let valid = await assignvalid(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let findTask = await Task.findOne({where:{id:taskid}}).catch((err)=>{
        return {error : err}
    })
    if(!findTask || (findTask && findTask.error)){
        return {error : "task Not exist",status:404}
    }
    if(findTask.created_by!=userData.id){
        return {error : "task is not created by this user",status : 400}
    }

    let findUser = await User.findOne({where:{id:params.assign_to}}).catch((err)=>{
        return {error : err}
    })
    if(!findUser || (findUser && findUser.error)){
        return {error : "user not exist",status : 404}
    }

    let updateTask = await Task.update({assign_task_to:params.assign_to},{where:{id:taskid}}).catch((err)=>{
        return {error : err}
    })
    console.log("194",updateTask);
    if(!updateTask || (updateTask && updateTask.error)){
        return {error : "Internal Server Error",status : 500}
    }

    return {data : updateTask}
}

async function assignvalid(data){
    let schema = joi.object({
        id : joi.number().required(),
        assign_to : joi.number().required()
    })
    let valid = await schema.validateAsync(data).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        let errMsg = []
        for(let i of valid.error.details){
            errMsg.push(i.message)
        }
        return {error : errMsg}
    }
    return {data : valid}
}

async function checkStatus(data) {
    let schema = joi.object({
        id: joi.number().required(),
        status: joi.string().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function status(id, params, userData) {
    params.id = id;
    let valid = await checkStatus(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findTask = await Task.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!findTask || (findTask && findTask.error)) {
        return { error: 'Task not found' }
    }
    console.log(findTask.assign_task_to,userData.id)
    if (findTask.assign_task_to != userData.id) {
        return { error: 'You are not assigned to this task' }
    }
    let findUser = await User.findOne({ where: { id: userData.id } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: 'User not found' }
    }
    let update = await Task.update({ status: params.status }, { where: { id: findTask.id } }).catch((error) => { return { error } })
    if (!update || (update && update.error)) {
        return { error: 'Error in updating task' }
    }
    return { data: "Status Changed" }
}

async function revokeTask(id,userData){
    let valid = await idCheck({id}).catch((err)=>{
        return {error:err}
    })
    if(!valid||(valid&&valid.error)){
        return{error:valid.error}
    }

    let findTask = await Task.findOne({where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!findTask||(findTask&&findTask.error)){
        return{error:'Task Not Found'}
    }

    if(findTask.created_by != userData.id){
        return{error:"You don't have permission"}
    }

    let update = await Task.update({assign_task_to:null},{where:{id}}).catch((err)=>{
        return {error:err}
    })
    if(!update||(update&&update.error)){
        return{error:'Error In Updating'}
    }
    return{data:update}
}

module.exports = {
    create,
    view,
    viewAll,
    update,
    tdelete,
    taskAssign,
    status,
    revokeTask
}