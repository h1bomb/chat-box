var mongoose = require('mongoose'),
    sys = require("sys"),
    msg = require("./message"),
    newid = require("./id"),
    Schema = mongoose.Schema;

var user = exports;

mongoose.connect(process.DB_URL);


var contact = new Schema(
{
   id            : {type : Number, index : true }
   ,nickname     : {type : String, required: true }
});

var userSchema = new Schema(
{
   id            : {type : Number, index : true }
  ,nickname      : {type : String,  required: true }
  ,password	     : {type : String,  required: true }
  ,state         : {type : Number}
  ,contacts      : [contact]
});

var model_name = coll_name = 'users';
mongoose.model(model_name, userSchema, coll_name);
var User  = mongoose.model(model_name, coll_name);
user.add = function(req,callback)
{
	var user  = new User();
	newid.get(model_name,function(id)
	{
		if(id)
		{
			user.id  = id;
			user.nickname = req.nickname;
			user.password = req.password;
			user.state = 1;
			user.save(function(err) 
			{
			  if (err) 
			  {
				callback(err);
			    console.log('save failed');
			  }
			  else
			  {
					var data = {};
					msg.get(id,function(ret)
					{
						data.unreadInfo = ret;
						data.contacts = [];
						data.id = id;
						data.name = req.nickname;
						msg.createSession(req.nickname,id);
						callback(null,data);
						console.log('login success');
					});					    	
			  }
			});
		}
	});
}

function addState(data)
{
	console.log(data.length);
	var arr = [];
	for(var i=0;i<data.length;i++)
	{
		var obj = {};
		if(msg.getSession(data[i].id))
		{
			obj.state = 1;
		}
		else
		{
			obj.state = 0;
		}
		obj.nickname = data[i].nickname;
		obj.id = data[i].id;
		arr.push(obj);
	}
	return arr;
}

user.get = function(req,callback)
{
	User.findOne({id:req.id},function(err, doc)
	{
		if(!err)
		{
			if(doc&&doc.password==req.psw)
			{
				User.update({id:req.id},{state:1},function(err)
				{
					if(!err)
					{
						var data = {};
						msg.get(req.id,function(ret)
						{
							data.unreadInfo = ret;
							data.contacts = addState(doc.contacts);
							data.id = req.id;
							data.name = doc.nickname;
							msg.createSession(data.name,req.id);
						//	console.log(sys.inspect(data));
							callback(null,{suc:true,data:data});
							console.log('login success');
						});
					}
					else
					{
						 callback(err);
						 console.log('login err');
					}
				});
			}
			else
			{
				callback(null,{suc:false,info:"login failure"});
				console.log('login failure');
			}
		}
		else
		{
			 callback(err);
			 console.log('login err');
		}
	});
}

user.logout = function(req,callback)
{
	msg.delSession(req.id,function(flag)
	{
		callback(flag);
	});
}

user.logout_server = function(id,call)
{
	User.update({id:id},{state:0},function(err)
	{
		if(!err)
		{
			console.log('logout success');
			if(call)
			{
				call(true);
			}
		}
		else
		{
			console.log('logout err');
			if(call)
			{
				call(true);
			}
		}
	});
}

user.addCon = function(req,callback)
{
	User.findOne({id:req.id},function(err, doc)
	{
		if(!err)
		{
				var ret = true;
				for(var i = 0;i< doc.contacts.length;i++)
				{
					if(doc.contacts[i].id==req.cid)
					{
						callback({ suc: false
						          ,info: "You have this guy contact!"
						          });
						console.log('added success');
						ret = false;
						break;
					}
				}
				
				if(!ret)
				{
					return;
				}
				var newCon = 
				{
					id : req.cid,
					nickname : req.cname
			    };
				doc.contacts.push(newCon);
				doc.save(function(err)
				{
					if(!err)
					{
						newCon.state = msg.getSession(req.cid);
						callback(null,
						{ suc: true
						 ,info: newCon
						});
						console.log('add success');
					}
					else
					{
						callback(err,
						{ suc: false
						 ,info: err
						});
						console.log('addcon err(update)');
					}
				});
		}
		else
		{
			callback(err,
			{ suc: false
			 ,info: err
			});
			 console.log('addcon err');
		}
	});
}

user.delCon = function(req,callback)
{
	User.findOne({id:req.id},function(err, doc)
	{
		if(!err)
		{
				for(var i = 0;i<doc.contacts.length;i++)
				{
					if(doc.contacts[i].id==req.cid)
					{
						doc.contacts[i].remove();
						console.log(i);
						i--
					}
				}
				//console.log(sys.inspect(doc.contacts));
				console.log(doc.contacts.length);
				doc.save(function(err)
				{
					if(!err)
					{
						callback(null,{ suc: true
						               ,info: {id:req.cid}
						              });
						 console.log('delcon suc');
					}
					else
					{
						callback(err, { suc: false
						               ,info: err
						              });
						 console.log('delcon err');
					}
				});
		}
		else
		{
			callback(err, { suc: false
			               ,info: err
			              });
			 console.log('delcon err');
		}
	});
}