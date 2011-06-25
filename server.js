process["DB_URL"] = 'mongodb://127.0.0.1/im';
var qs = require("querystring"),
    sys = require("sys"),
    fu = require("./server/fu"),
    url = require("url"),
    user = require("./server/user");
    message = require("./server/message");

server.listen(process.env.PORT || 8001);
fu.get("/", fu.staticHandler("./index.html"));
fu.get("/source/style.css", fu.staticHandler("./source/style.css"));
fu.get("/lib/jquery-1.5.2.min.js", fu.staticHandler("./lib/jquery-1.5.2.min.js"));
fu.get("/client/message.js", fu.staticHandler("./client/message.js"));
fu.get("/client/io.js", fu.staticHandler("./client/io.js"));
fu.get("/client/tab.js", fu.staticHandler("./client/tab.js"));
fu.get("/client/contactList.js", fu.staticHandler("./client/contactList.js"));
fu.get("/client/index.js", fu.staticHandler("./client/index.js"));

//send message
fu.get("/send",function(req, res)
{
	req.addListener("data", function(chunk) 
	{
			var req = qs.parse(chunk.toString());
			message.addMsg(
			{
				 type:"msg",
				 time:new Date(),
				 info:req.msg,
				 to:req.toID
			},req.id,function(err)
			{
				 if (err) 
				  {
					res.simpleJSON(400, { suc: false
					                     ,info: err
					                    });
				    console.log('save msg failed');
				  }
				  else
				  {

					res.simpleJSON(200, { suc: true
					                     //,data: msg
					                    });
				    console.log('add msg success');					    	
				  }
			});
	});
});

//register user
fu.get("/reg",function(req, res)
{
	req.addListener("data", function(chunk) 
	{
			var req = qs.parse(chunk.toString());
			user.add(req,function(err,data)
			{
				if(err)
				{
					res.simpleJSON(400, { suc: false
					                     ,info: err
					                    });
				}
				else
				{
					res.simpleJSON(200, { suc: true
					                     ,data: data
					                    });
				}
			});
	});
});

//user login
fu.get("/login",function(req, res)
{
	req.addListener("data", function(chunk) 
	{
		var req = qs.parse(chunk.toString());
		user.get(req,function(err,info)
		{
			if(err)
			{
				res.simpleJSON(400, { suc: false
				                     ,info: err
				                    });
			}
			else
			{
				res.simpleJSON(200, info);
			}
		});
			
	});
});

//user logout
fu.get("/logout",function(req,res)
{
	var req = qs.parse(url.parse(req.url).query);
	user.logout(req,function(flag)
	{
		if(flag)
		{
			res.simpleJSON(200, { suc: true
			                    });			
		}
		else
		{
			res.simpleJSON(400, { suc: false
			                     ,info: "logout err"
			                    });
		}
	});
});

//message loop
fu.get("/loop",function(req,res)
{
	var re = qs.parse(url.parse(req.url).query);
	message.addCall(re.id,
	function(res_arr)
	{
		res.simpleJSON(200, { 
			                  suc: true
		                     ,info: res_arr
		                    });
	});
});

//add contact
fu.get("/addcon",function(req,res)
{
	var re = qs.parse(url.parse(req.url).query);
	user.addCon (re,function(err,info)
	{
		if(err)
		{
			res.simpleJSON(400, info);
		}
		else
		{
			res.simpleJSON(200, info);
		}
	});
});

//del contact
fu.get("/delcon",function(req,res)
{
	var re = qs.parse(url.parse(req.url).query);
	user.delCon (re,function(err,info)
	{
		if(err)
		{
			res.simpleJSON(400, info);
		}
		else
		{
			res.simpleJSON(200, info);
		}
	});
});

//del msg
fu.get("/delmsg",function(req,res)
{
	var re = qs.parse(url.parse(req.url).query);
	message.delUnread (re.id,function(err)
	{
		if(err)
		{
			res.simpleJSON(200, { suc: false
			                     ,data: "del err"
			                    });
		}
		else
		{
			res.simpleJSON(200, { suc: true
			                     ,data: "del suc"
			                    });
		}
	});
})