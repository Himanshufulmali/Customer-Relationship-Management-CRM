const { createTicket, getAllTickets, updateTicket } = require("../controllers/ticket-controller");
const { ticketUpdateValidation } = require("../middlewares/ticket-middleware");
const { verifyJwtToken } = require("../middlewares/user-middleware");




module.exports = (app) => {

    app.post("/crm/api/test/users/tickets",[verifyJwtToken],createTicket);
    app.get("/crm/api/test/users/tickets",[verifyJwtToken],getAllTickets);
    app.put("/crm/api/test/users/tickets/:id",[verifyJwtToken,ticketUpdateValidation],updateTicket);

} 