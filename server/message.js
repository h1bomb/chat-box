var sys = require("sys"),
		  mongoose = require('mongoose'),
          user = require('./user'),
          Schema = mongoose.Schema;
mongoose.connect(process.DB_URL);

var message = new Schema(
{
   type     : {type : String, required: true },
   from     : {type : Number, required: true },
   to       : {type : Number, required: true },
   name     : {type : String, required: true },
   info     : {type : String, required: true },
   time     : {type : Date, required: true }
});

var model_name = coll_name = 'message';
mongoose.model(model_name, message, coll_name);
var Message  = mongoose.model(model_name, coll_name);

var SESSION_TIMEOUT = 60 * 1000,
    LOOP_TIME = 3000;
    LOOP_SESSION_TIME = 1000;
var msg = exports;

var sessions = {};

setInterval(function () 
{
    var now = new Date();
    for(var k in sessions)
    {
	    while (sessions[k].calls.length > 0&&now - sessions[k].calls[0].timestamp > 30*1000) 
	    {
			sessions[k].calls.shift().callback([]);
	    }
    }
}, LOOP_TIME);

msg.get = function(id,call)
{
	Message.find({to:id},function(err, docs)
	{
		if(!err)
		{
			call(docs);
		}
	});
}


msg.delUnread = function(id,callback)
{
	Message.find({to:id},function(err, docs)
	{
		if(!err)
		{
			var errMsg = [],num=0;
			if(docs.length==0)
			{
				callback();
			}
			for(var i = 0;i<docs.length;i++)
			{
				docs[i].remove(function(err)
				{
					if(err)
					{
						console.log(id+':del msg error');
						errMsg.push(err);
					}
					else
					{
						console.log(id+':del msg suc');
					}
					num++;
					//console.log(num +"|||"+(docs.length));
					if(num == docs.length)
					{
						if(errMsg.length>0)
						{
							callback(errMsg);
						}
						else
						{
							callback();
						}
					}
				});
			}

		}
		else
		{
			callback(err);
		}
	});
}

msg.addM = function(callback)
{
	var message = new Message();
	
	message.type = "msg";
	message.from = 1;
	message.to = 2;
	message.name = "haha";
	message.info = "test";
	message.time = new Date();
	
	message.save(function(err) 
	{
	  if (err) 
	  {
	    console.log('save msg failed');
	  }
	  else
	  {
	    console.log('save msg success');					    	
	  }
	  callback();
	});
}

var save = function(msg,callback)
{
	var message = new Message();
	
	for(var k in msg)
	{
		message[k] = msg[k];
	}
	
	message.save(function(err) 
	{
	  callback(err?err:null); 
	});
}

msg.getSession = function(id)
{
	if(sessions[id])
	{
		return sessions[id];
	}
}

msg.updateSession = function(id)
{
	if(sessions[id])
	{
		sessions[id].update();
	}
}

msg.delSession = function(id,call)
{
	if(sessions[id])
	{
		sessions[id].destroy(call);
	}
}

msg.addCall = function(id,callback)
{
	if(sessions[id])
	{
		var obj = 
		{
			callback : callback,
			timestamp : new Date()
		};
		msg.updateSession(id);
		sessions[id].calls.push(obj);
	}
	else
	{
		callback([],{suc:false,data:"you can't get message ,because you offline!"});
	}
}

msg.addMsg = function(msg,id,callback)
{
	var session = sessions[id];
	if(!id)
	{
		if(callback){callback("id error!")};
		return;
	}
	if(!session)
	{
		if(callback){callback("session error!")};
		return;
	}
	
	msg.from = session.id;
	msg.name = session.name;
	console.log(msg.name+":"+msg.info);
	if(msg.to == 0)
	{
	    for(var k in sessions)
	    {
		    while (sessions[k].calls.length > 0) 
		    {
				sessions[k].calls.shift().callback([msg]);
		    }
	    }
	   if(callback){callback()};
	}
	else if(sessions[msg.to])
	{
		while (sessions[msg.to].calls.length > 0) 
	    {
			sessions[msg.to].calls.shift().callback([msg]);
	    }
		if(callback){callback()};
	}
	else
	{
		save(msg,function(err)
		{
			if(callback){callback(err?err:null)}; 
			if(!err)
			{
				console.log('save msg success');	
			}
		});
	}
}




msg.createSession  = function (name,id) 
{
  if (name==""||id=="") return null;
  for (var i in sessions) 
  {
    var session = sessions[i];
    if (session && session.id === id)
    {
		session.update();
		return null;
    } 
  }
  var session = 
  { 
    name: name, 
    id: id,
    timestamp: new Date(),
    calls:[],

    update: function () 
    {
      session.timestamp = new Date();
    },

    destroy: function (call) 
    {
	  msg.addMsg(
	  {
		 type:"leave",
		 time:new Date(),
		 info:"I'm leaving now!",
		 to:0
      },session.id);
      delete sessions[session.id];
	  user.logout_server(id,call);
    }
  };

  sessions[session.id] = session;
  
  msg.addMsg(
  {
		 type:"join",
		 time:new Date(),
		 info:"I'm coming now!",
		 to:0
  },session.id);
  console.log(session);
  return session;
}




// interval to kill off old sessions
setInterval(function () 
{
  var now = new Date();
  for (var id in sessions) 
  {
    if (!sessions.hasOwnProperty(id)) continue;
    var session = sessions[id];

    if (now - session.timestamp > SESSION_TIMEOUT) 
    {
      session.destroy();
    }
  }
}, 1000);