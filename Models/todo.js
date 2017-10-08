var connection = require('../connection');
  
function Todo() {
  this.getHistory = function(groupId, page, pageSize, res) {
    connection.acquire(function(err, conn) {

    	page = parseInt(page) - 1;
    	pageSize = parseInt(pageSize);

        conn.query('SELECT * FROM (SELECT * FROM archive WHERE to_group = ? ORDER BY id DESC LIMIT ?, ?) sub ORDER BY id ASC', [groupId, page * pageSize, pageSize], function(err, result) {
            conn.release();
         
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
                            'errorMessage': 'Something error'
                        }]
                    }
                );
                console.log(err);
    		}
      });
    });
  }

  this.getStatus = function(groupId, res) {
    connection.acquire(function(err, conn) {
        conn.query('SELECT * FROM users WHERE to_group = ? ', [groupId], function(err, result) {
            conn.release();
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
                            'errorMessage': 'Something error'
                        }]
                    }
                );
                console.log(err);
            }
        });
    });
  }

  this.getLastLocation = function(groupId, res) {
    connection.acquire(function(err, conn) {
        conn.query('SELECT * FROM last_location WHERE to_group = ?', [groupId], function(err, result) {
            conn.release();
            if (!err) {
                res.json({
                    'data': result,
                    'error': false,
                    'errors': null
                });
            } else {
                res.json(
                    {
                        'data': null,
                        'error': true,
                        'errors': [{
                            'errorCode': 9011,
                            'errorMessage': 'Something error'
                        }]
                    }
                );
                console.log(err);
            }
        });
    });
  }

}
module.exports = new Todo();