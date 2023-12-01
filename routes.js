let express = require("express")
let routes = express.Router()
let authCon = require("./controller/authController")
let task = require("./controller/taskController")
let {auth} = require("./middleware/authMiddleware")

routes.post("/register",authCon.register)
routes.post("/login",authCon.login)


routes.post("/taskcreate",auth("task_create"),task.create)
routes.get("/viewone/:id",auth("task_view"),task.view)
routes.get("/viewall",auth("task_view"),task.viewAll)
routes.put("/update/:id",auth("task_update"),task.update)
routes.delete("/delete/:id",auth("task_delete"),task.tdelete)
routes.put("/restore/:id",auth("task_restore"),task.trestore)
routes.put("/taskassign/:id",auth("task_update"),task.taskAssign)
routes.put('/status/:id',auth('task_status'),task.status)
routes.put('/revoke/:id',auth("task_revoke"),task.revoke)

module.exports = {routes}