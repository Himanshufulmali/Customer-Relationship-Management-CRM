const { createNotification, getNotifications } = require("../controllers/notification-controller")



module.exports = (app) => {
    app.post("/crm/api/test/notification/create",createNotification);
    app.get("/crm/api/test/notification",getNotifications);
}