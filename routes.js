var todo = require('./Models/todo');
  
module.exports = {
  configure: function(app) {

    app.get('/history/:groupId', function(req, res) {
        todo.getHistory(req.params.groupId, req.query.page, req.query.pageSize, res);
    });

    app.get('/status/:groupId', function(req, res) {
        todo.getStatus(req.params.groupId, res);
    });

    app.get('/last_location/:groupId', function(req, res) {
        todo.getLastLocation(req.params.groupId, res);
    });

    app.get('/deal/:where', function(req, res) {
        todo.getDeal(req.params.where, req.query.page, req.query.pageSize, res);
    });

    app.get('/trend', function(req, res) {
        todo.getTrend(req.query.page, req.query.pageSize, res);
    });
  }
};