var connection = require('../connection');
  
function Todo() {

//----------------------------------------------------------------------------------------------------------------------------------------------------//

  this.getHistory = function(groupId, page, pageSize, res) {
    connection.acquire(function(err, conn) {

    	page = parseInt(page) - 1;
    	pageSize = parseInt(pageSize);

        conn.query('SELECT * FROM (SELECT * FROM archive WHERE id_plan = ? ORDER BY id DESC LIMIT ?, ?) sub ORDER BY id ASC', [groupId, page * pageSize, pageSize], function(err, result) {
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

//----------------------------------------------------------------------------------------------------------------------------------------------------//

  this.getDeal = function(where, priceMin, priceMax, dayMin, dayMax, page, pageSize, res) {
    connection.acquire(function(err, conn) {

        page = parseInt(page) - 1;
        pageSize = parseInt(pageSize);

        var strQuery = 'SELECT * FROM deal WHERE title LIKE "%' + where + '%" AND price BETWEEN ' + priceMin + ' AND ' + priceMax + ' AND during_day BETWEEN ' + dayMin + ' AND ' + dayMax + ' ORDER BY count_view DESC LIMIT ' + page * pageSize + ', ' + pageSize;

        conn.query(strQuery, function(err, result) {
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

//----------------------------------------------------------------------------------------------------------------------------------------------------//

    this.getTrend = function(where, page, pageSize, res) {
    connection.acquire(function(err, conn) {

        page = parseInt(page) - 1;
        pageSize = parseInt(pageSize);

        var strQuery;
        if (where != "") {
            strQuery = 'SELECT * FROM trend WHERE title LIKE "%' + where + '%" ORDER BY id DESC LIMIT ' + page * pageSize + ', ' + pageSize;
        } else {
            strQuery = 'SELECT * FROM trend ORDER BY count_view DESC LIMIT ' + page * pageSize + ', ' + pageSize;
        }

        conn.query(strQuery, function(err, result) {
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

//----------------------------------------------------------------------------------------------------------------------------------------------------//

  this.updateTrendCount = function(body, res) {
    connection.acquire(function(err, conn) {
        conn.query('UPDATE trend SET ? WHERE id = ?', [body, body.id], function(err, result) {
            conn.release();
             if (!err && result.affectedRows == 1) {
                res.json({
                    'data': "Update success",
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

//----------------------------------------------------------------------------------------------------------------------------------------------------//


  this.createPlan = function(body, res) {
    connection.acquire(function(err, conn) {
        var count = 0;
        // Random id for plan
        var id = Math.floor((Math.random() * 1000000000) + 1);

        // Write to database plan
        var sqlPlan = 'INSERT INTO plan (id, name, destination, date_go, date_back, id_background, id_user_make_plan, avatar_user_make_plan, username_user_make_plan, email_user_make_plan) VALUES (' + id + ', "' + body.name + '", "' + body.destination + '", "' + body.date_go + '", "' + body.date_back + '", ' + body.id_background + ', ' + body.id_user_make_plan + ', "' + body.avatar_user_make_plan + '", "' + body.username_user_make_plan + '", "' + body.email_user_make_plan + '")';
        conn.query(sqlPlan, function(err, result) {
            if (!err) {
                sendResponse();
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
                return;
            }
        });

        // Write to database plan_schedule (because a plan can has list of schedule)
        var sqlSchedule = 'INSERT INTO plan_schedule (content, title, timestamp, id_plan) VALUES ?';
        var schedules = [];
        for (i = 0; i < body.plan_schedule_list.length; i++) {
            var item = [body.plan_schedule_list[i].content, body.plan_schedule_list[i].title, body.plan_schedule_list[i].timestamp, id];
            schedules.push(item);
        }
        conn.query(sqlSchedule, [schedules], function(err, result) {
            if (!err) {
                sendResponse();
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
                return;
            }
        });

        // Write to database user_in_plan to know which user can see these plan
        var sqlUser = 'INSERT INTO user_in_plan (id_user, id_plan, email, username, avatar) VALUES ?';
        var users = [];
        users.push([body.id_user_make_plan, id, body.email_user_make_plan, body.username_user_make_plan, body.avatar_user_make_plan]);
        for (i = 0; i < body.invited_friend_list.length; i++) {
            var item = [body.invited_friend_list[i].id_user, id, body.invited_friend_list[i].email, body.invited_friend_list[i].username, body.invited_friend_list[i].avatar];
            users.push(item);
        }
        conn.query(sqlUser, [users], function(err, result) {
            if (!err) {
                sendResponse();
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
                return;
            }
        });

        // Send response when all write task complete
        var sendResponse = function() {
            count = count + 1;
            if (count == 3) {
                res.json({
                    'data': "Create success",
                    'error': false,
                    'errors': null
                });
                conn.release();
            }
        };

    });
  }

//----------------------------------------------------------------------------------------------------------------------------------------------------//

  this.updatePlan = function(body, res) {
        connection.acquire(function(err, conn) {
        var count = 0;

        // Update to database plan
        var sqlPlan = 'UPDATE plan SET name = "' + body.name + '", destination = "' + body.destination + '", date_go = "' + body.date_go + '", date_back = "' + body.date_back + '", id_background = ' + body.id_background + ' WHERE id = ' + body.id;

        conn.query(sqlPlan, function(err, result) {
            if (!err) {
                sendResponse();
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
                return;
            }
        });


        // Delete old plan_schedule
        conn.query('DELETE FROM plan_schedule WHERE id_plan = ?', [body.id], function(err, result) {
             if (!err) {
                // Insert new plan_schedule
                var sqlSchedule = 'INSERT INTO plan_schedule (content, title, timestamp, id_plan) VALUES ?';
                var schedules = [];
                for (i = 0; i < body.plan_schedule_list.length; i++) {
                    var item = [body.plan_schedule_list[i].content, body.plan_schedule_list[i].title, body.plan_schedule_list[i].timestamp, body.id];
                    schedules.push(item);
                }
                conn.query(sqlSchedule, [schedules], function(err, result) {
                    if (!err) {
                        sendResponse();
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
                        return;
                    }
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
                return;
            }
        });

        
        // Delete old user_in_plan
        conn.query('DELETE FROM user_in_plan WHERE id_plan = ?', [body.id], function(err, result) {
            if (!err) {
                // Insert new user_in_plan
                var sqlUser = 'INSERT INTO user_in_plan (id_user, id_plan, email, username, avatar) VALUES ?';
                var users = [];
                for (i = 0; i < body.invited_friend_list.length; i++) {
                    var item = [body.invited_friend_list[i].id_user, body.id, body.invited_friend_list[i].email, body.invited_friend_list[i].username, body.invited_friend_list[i].avatar];
                    users.push(item);
                }
                conn.query(sqlUser, [users], function(err, result) {
                    if (!err) {
                        sendResponse();
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
                        return;
                    }
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
                return;
            }
        });



        // Send response when all update task complete
        var sendResponse = function() {
            count = count + 1;
            if (count == 3) {
                res.json({
                    'data': "Update success",
                    'error': false,
                    'errors': null
                });
                conn.release();
            }
        };

    });
}

//----------------------------------------------------------------------------------------------------------------------------------------------------//

  this.getPlan = function(userId, page, pageSize, res) {
    connection.acquire(function(err, conn) {

        page = parseInt(page) - 1;
        pageSize = parseInt(pageSize);

        var sql = 'SELECT * FROM plan WHERE id IN (SELECT id_plan FROM user_in_plan WHERE id_user = ' + userId + ')';

        conn.query(sql, function (err, result) {
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
                return;
            }
        });
    });
  }

//----------------------------------------------------------------------------------------------------------------------------------------------------//


  this.getPlanSchedule = function(planId, res) {
    connection.acquire(function(err, conn) {

        conn.query('SELECT * FROM plan_schedule WHERE id_plan = ?', [planId], function (err, result) {
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
                return;
            }
        });
    });
  }

//----------------------------------------------------------------------------------------------------------------------------------------------------//


  this.getPlanUser = function(planId, res) {
    connection.acquire(function(err, conn) {
        conn.query('SELECT * FROM user_in_plan WHERE id_plan = ?', [planId], function (err, result) {
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
                return;
            }
        })
    });
  }

}
module.exports = new Todo();