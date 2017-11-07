var todo = require('./Models/todo');
  
module.exports = {
  configure: function(app) {

    // Get history of chat
    app.get('/history/:groupId', function(req, res) {
        todo.getHistory(req.params.groupId, req.query.page, req.query.pageSize, res);
    });

    // Get list status users online or offline
    app.get('/status/:groupId', function(req, res) {
        todo.getStatus(req.params.groupId, res);
    });

    // Get list last location at map
    app.get('/last_location/:groupId', function(req, res) {
        todo.getLastLocation(req.params.groupId, res);
    });

    // Get list of deal
    app.get('/deal', function(req, res) {
        todo.getDeal(req.query.where, req.query.priceMin, req.query.priceMax, req.query.dayMin, req.query.dayMax, req.query.page, req.query.pageSize, res);
    });

    // Get list of trend
    app.get('/trend', function(req, res) {
        todo.getTrend(req.query.where, req.query.page, req.query.pageSize, res);
    });

    // Update count view of trend
    app.put('/trend/updateCount', function(req, res) {
        todo.updateTrendCount(req.body, res);
    });

    // Create a new plan
    app.post('/plan', function(req, res) {
        todo.createPlan(req.body, res);
    });

    // Get list plan
    app.get('/plan/:userId', function(req, res) {
        todo.getPlan(req.params.userId, req.query.page, req.query.pageSize, res);
    });

    // Get list plan_schedule from plan id
    app.get('/planSchedule/:planId', function(req, res) {
        todo.getPlanSchedule(req.params.planId, res);
    });

    // Get list user in plan
    app.get('/planUser/:planId', function(req, res) {
        todo.getPlanUser(req.params.planId, res);
    });
  }
};