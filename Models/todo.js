var connection = require('../connection');
  
function Todo() {
  this.get = function(groupId, page, pageSize, res) {
    connection.acquire(function(err, con) {

    	page = parseInt(page) - 1;
    	pageSize = parseInt(pageSize);

      con.query('SELECT * FROM (SELECT * FROM archive WHERE to_group = ? ORDER BY id DESC LIMIT ?, ?) sub ORDER BY id ASC', [groupId, page * pageSize, pageSize], function(err, result) {
        con.release();
     
        if (!err) {
        	 res.json(
                {
                    'data': result,
                    'error': false,
                    'errors': null
                }
            );
   
        } else {
        	res.json(
                {
                    'data': null,
                    'error': true,
                    'errors': [{
                        'errorCode': 9011,
                        'errorMessage': 'Please make sure your request has an Authorization header'
                    }]
                }
            );
            throw err;
		}
        // res.send(result);
      });
    });
  };
}
module.exports = new Todo();