var todo = require('./Models/todo');
  
module.exports = {
  configure: function(app) {
    app.get('/history/', function(req, res) {
      todo.get(res);
    });
  }
};