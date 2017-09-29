var todo = require('./Models/todo');
  
module.exports = {
  configure: function(app) {
    app.get('/history/:groupId', function(req, res) {
          todo.get(req.params.groupId, req.query.page, req.query.pageSize, res);
    });
  }
};	