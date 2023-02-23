const {signup, signin, findData, findWithId, updateData, deleteData} = require("../controllers/user-controller");
const { signupMw, signinMw } = require("../middlewares/user-middleware");

module.exports = (app) => {

    app.post("/mdb/api/test/users/signup",[signupMw],signup);
    app.post("/mdb/api/test/users/signin",[signinMw],signin);
    app.get("/mdb/api/test/users",findData);
    app.get("/mdb/api/test/users/:userId",findWithId);
    app.put("/mdb/api/test/users/:userId",updateData);
    app.delete("/mdb/api/test/users/:userId",deleteData); 
 
}