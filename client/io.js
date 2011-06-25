/**
*io
*/
var Io = 
{
	_req:function(m,url,req,callback,callback2)
	{
		$.ajax({ cache: false
	           , type: m 
	           , dataType: "json"
	           , url: url
	           , data: req
	           , error: function (err) 
	             {
	                if(callback2)
	 				{
						callback2();
					}
					else
					{
						var flag; 
						window.clearTimeout(flag);
						flag = window.setTimeout(function()
						{
							$("#error")
							.fadeOut(1000)
							.html("");
						},5000);
						
						$("#error")
						.fadeIn(1000)
						.html("error connecting to server");
					}
	             }
	           , success: callback
	           });
	},
	reg:function(req,callback)
	{
		this._req("POST","/reg",req,callback);
	},
	login:function(req,callback)
	{
		this._req("POST","/login",req,callback);
	},
	logout:function(req,callback)
	{
		this._req("GET","/logout",req,callback);
	},
	loop:function(req)
	{
		if(!$("#main").is(":visible"))
		{
			return;
		}
		this._req("GET","/loop",req,function(data)
		{
			if (data && data.suc) 
			{
			    for (var i = 0; i < data.info.length; i++) 
			    {
			      var message = data.info[i];
			      switch (message.type) 
			      {
			        case "msg":
			          Message.add(message);
			          break;
			        case "join":
			          Message.joinin(message);
			          ContactList.joinin(message);
			          break;
			        case "leave":
			          Message.leave(message);
			          ContactList.leave(message);
			          break;
			      }
				}
				Io.loop(req);
			}
		});
	},
	send:function(req,callback)
	{
		this._req("POST","/send",req,callback);
	},
	addContact:function(req,callback)
	{
		this._req("GET","/addcon",req,callback);
	},
	delContact:function(req,callback)
	{
		this._req("GET","/delcon",req,callback);
	},
	delmsg:function(req,callback)
	{
		this._req("GET","/delmsg",req,callback);
	}
}