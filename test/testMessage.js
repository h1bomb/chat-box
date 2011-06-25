var testCase = require('nodeunit').testCase

module.exports = testCase({
    setUp: function (callback) 
    {       
		process["DB_URL"] = 'mongodb://root:123321@localhost/im';
		this.msg = require("../server/message");
		callback();
    },
    tearDown: function (callback) 
    {
        // clean up
        callback();
    },
    testGet: function (test) 
    {
        var self = this;
		this.msg.addM(function()
		{
			self.msg.get(2,function(data)
	        {
		        test.equals(data[0].name, 'haha');
		        test.done();
	        });
		});
    },
    testDel:function(test)
    {
		var self = this;
		this.msg.delUnread(2,function(err)
		{
			if(!err)
			{
				self.msg.get(2,function(data)
		        {
			        //console.log("haha");
					test.equals(data.length, 0);
			        test.done();
		        });	
			}
		});
	}
});