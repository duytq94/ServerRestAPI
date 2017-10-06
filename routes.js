var todo = require('./Models/todo');
  
module.exports = {
  configure: function(app) {

    app.get('/history/:groupId', function(req, res) {
        todo.getHistory(req.params.groupId, req.query.page, req.query.pageSize, res);
    });

    app.get('/status/:groupId', function(req, res) {
    	todo.getStatus(req.params.groupId, res);
    })

  }
};	