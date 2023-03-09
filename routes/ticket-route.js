const { createTicket, getAllTickets } = require("../controllers/ticket-controller");
const { verifyJwtToken } = require("../middlewares/user-middleware");




module.exports = (app) => {

    app.post("/crm/api/test/users/tickets",[verifyJwtToken],createTicket);
    app.get("/crm/api/test/users/tickets",[verifyJwtToken],getAllTickets);

} 