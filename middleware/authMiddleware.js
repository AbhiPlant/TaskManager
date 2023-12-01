let {sequelizeCon,QueryTypes} = require("../init/dbConfig")
let security = require("../helper/security")

function auth(permission){
    return async (request,response,next)=>{
        let token = request.headers.token
        if(typeof(token) != "string"){
            return response.status(401).send({error : "Not Authorized"})
        }

        let decrypt = await security.decrypt(token,"@123@").catch((err)=>{
            return {error : err}
        })
        console.log("14",decrypt);
        if(!decrypt || (decrypt && decrypt.error)){
            return response.status(401).send({error : "Not Authorized 1"})
        }
        
        let query = `select user.id,user.name,p.name as permission
        from user 
        left join userpermission as up on user.id = up.user_id 
        left join permission as p on up.permission_id = p.id 
        where user.id ='${decrypt.id}' and
        token = '${token}'`;

        let user = await sequelizeCon.query(query,{type:QueryTypes.SELECT}).catch((err)=>{
            return {error : err}
        })
        if(!user || (user && user.error)){
            return response.status(404).send({error : "User Not Found"})
        }

        let permissions = {}
        for(let i of user){
            if(i.permission){
                permissions[i.permission] = true
            }          
        }
        if(permissions.length <= 0 || !permissions[permission]){
            return response.status(403).send({error : "Not authorized"})
        }

        request.userData = {
            name : user[0].name,
            id : user[0].id,
            permissions
        }
        next()
    }
}
module.exports = {auth}

