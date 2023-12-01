let {User} = require("../schema/user")
let joi = require("joi")
let security = require("../helper/security")
let {UP} = require("../schema/userPermission")

async function register(params){
    let valid = await userValidation(params).catch((err)=>{
        return {error : err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }
  
    let findUser = await User.findOne({where :{email_id : params.email}}).catch((err)=>{
        return {error : err}
    })
    console.log("17",findUser);
    if(findUser){
        return {error : "User Already Exist",status : 404}
    }

    let hashPassword = await security.hash(params.password).catch((err)=>{
        return {error : err}
    })
    if(!hashPassword || (hashPassword && hashPassword.error)){
        return {error : "Internal Server Error 1",status : 500}
    }

    let userData = {
        name : params.username,
        email_id : params.email,
        password : hashPassword.data,
        contact : params.phone
    }

    let data = await User.create(userData).catch((err)=>{
        return {error : err}
    })
    console.log("39",data);
    if(!data || (data && data.error)){
        return {error : "Internal Server Error",status : 500}
    }

    let userPermisison = {
        user_id : data.id,
        permission_id : 1
    }

    let Updata = await UP.create(userPermisison).catch((err)=>{
        return {error : err}
    })
    if(!Updata || (Updata && Updata.error)){
        return {error : "Internal Server Error",status : 500}
    }

    return {data}

}

async function userValidation(data){
    let schema = joi.object({
        username : joi.string().required(),
        email : joi.string().email().required(),
        password : joi.string().min(1).max(14).required(),
        phone : joi.string().required()
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


async function login(params){
    let valid = await loginValidation(params).catch((err)=>{
        return {error :err}
    })
    if(!valid || (valid && valid.error)){
        return {error : valid.error}
    }

    let findUser = await User.findOne({where:{email_id:params.email}}).catch((err)=>{
        return {error : err}
    })
    if(!findUser || (findUser && findUser.error)){
        return {error : "User Not Exist",status : 404}
    }

    let compare = await security.compare(params.password,findUser.password).catch((err)=>{
        return {error : err}
    })
    if(!compare || (compare && compare.error)){
        return {error : "Incorrect Password",status : 400}
    }

    let token = await security.encrypt({id : findUser.id},"@123@").catch((err)=>{
        return {error : err}
    })
    if(!token || (token && token.error)){
        return {error : "Internal Server Error",status : 500}
    }

    let updataToken = await User.update({token : token},{where:{id:findUser.id}}).catch((err)=>{
        return {error : err}
    })
    if(!updataToken || (updataToken && updataToken.error)){
        return {error : "Internal Server Error",status : 500}
    }

    return {token : token}
    
}

async function loginValidation(data){
    let schema = joi.object({
        email : joi.string().email().required(),
        password : joi.string().min(1).max(20).required()
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

module.exports = {
    register,
    login
}
