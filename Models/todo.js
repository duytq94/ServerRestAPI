var connection = require('../connection');
  
function Todo() {
  this.get = function(groupId,res) {
    connection.acquire(function(err, con) {
      con.query('select * from archive where to_group = ?', [groupId], function(err, result) {
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
		}
        // res.send(result);
      });
    });
  };
}
module.exports = new Todo();