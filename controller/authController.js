let user = require("../model/authModel")

async function register(request,response){
    let data = await user.register(request.body).catch((err)=>{
        return {error : err}
    })
    console.log("7",data);
    if(!data || (data && data.error)){
        let error = (data && data.error)? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return response.status(status).send({error})
    }
    return response.send({data:data})
}

async function login(request,response){
    let data = await user.login(request.body).catch((err)=>{
        return {error : err}
    })
    if(!data || (data && data.error)){
        let error = (data && data.error)? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return response.status(status).send({error})
    }
    return response.header("token",data.token).send({message:"Login Successfully"})
}

module.exports = {
    register,
    login
}