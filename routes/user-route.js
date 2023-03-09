const {signup, signin, findData, findWithId, updateData, deleteData} = require("../controllers/user-controller");
const { signupMw, signinMw, verifyJwtToken, checkingIfAdmin, checkingIfUserIsOwnerOrAdmin, userIdIsPresent } = require("../middlewares/user-middleware");

module.exports = (app) => {

    app.post("/crm/api/test/users/signup",[signupMw],signup);
    app.post("/crm/api/test/users/signin",[signinMw],signin);
    app.get("/crm/api/test/users",[verifyJwtToken,checkingIfAdmin],findData);
    app.get("/crm/api/test/users/:userId",[verifyJwtToken,userIdIsPresent,checkingIfUserIsOwnerOrAdmin],findWithId);
    app.put("/crm/api/test/users/:userId",[verifyJwtToken,userIdIsPresent,checkingIfUserIsOwnerOrAdmin],updateData);
    app.delete("/crm/api/test/users/:userId",[verifyJwtToken,userIdIsPresent,checkingIfUserIsOwnerOrAdmin],deleteData); 
 
}