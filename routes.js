var todo = require('./Models/todo');
  
module.exports = {
  configure: function(app) {

    // Get history of chat
    app.get('/history/:planId', function(req, res) {
        todo.getHistory(req.params.planId, req.query.page, req.query.pageSize, res);
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

    // Update a plan
    app.post('/plan/update/:planId', function(req, res) {
        todo.updatePlan(req.body, res);
    });

    // Cancel a plan (for member)
    app.delete('/plan/cancel', function(req, res) {
        todo.cancelPlan(req.query.userId, req.query.planId, res);
    });

    // Remove a plan (for owner)
    app.delete('/plan/remove', function(req, res) {
        todo.removePlan(req.query.planId, res);
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