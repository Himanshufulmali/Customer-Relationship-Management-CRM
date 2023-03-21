const { createNotification, getNotifications } = require("../controllers/notification-controller");
const { notificationCreateMw } = require("../middlewares/notification-middleware");



module.exports = (app) => {
    app.post("/crm/api/test/notification/create",[notificationCreateMw],createNotification);
    app.get("/crm/api/test/notification",getNotifications);
}