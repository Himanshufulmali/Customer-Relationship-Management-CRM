const {signup, signin, findData, findWithId, updateData, deleteData} = require("../controllers/user-controller");
const { signupMw, signinMw, verifyJwtToken, checkingIfAdmin, checkingIfUserIsOwnerOrAdmin, userIdIsPresent } = require("../middlewares/user-middleware");

module.exports = (app) => {

    app.post("/mdb/api/test/users/signup",[signupMw],signup);
    app.post("/mdb/api/test/users/signin",[signinMw],signin);
    app.get("/mdb/api/test/users",[verifyJwtToken,checkingIfAdmin],findData);
    app.get("/mdb/api/test/users/:userId",[verifyJwtToken,userIdIsPresent,checkingIfUserIsOwnerOrAdmin],findWithId);
    app.put("/mdb/api/test/users/:userId",[verifyJwtToken,userIdIsPresent,checkingIfUserIsOwnerOrAdmin],updateData);
    app.delete("/mdb/api/test/users/:userId",[verifyJwtToken,userIdIsPresent,checkingIfUserIsOwnerOrAdmin],deleteData); 
 
}