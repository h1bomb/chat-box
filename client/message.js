/**
* message
*/
var Message = 
{
	_addM:function(v,html)
	{
		if(UI_control.id!=v.from)
		{
			if(v.to==0)
			{
				$("#chat_con").append(html);
			}
			else
			{
				if(v.from=="")
				{
					$(".tab_con[val='"+v.to+"']").append(html);
				}
				else if($(".tab_con[val='"+v.from+"']").length>0)
				{
					$(".tab_con[val='"+v.from+"']").append(html);
				}
				else
				{
					Tab.addTab(v.name,"",v.from);
					$(".tab_con[val='"+v.from+"']").append(html);
				}
			}

			//$(".tab_con[val='"+v.from+"']").scrollBy(0, 100000000000000000);
		    $("#send input").focus();
		}
	},
	temp:function(v)
	{
		return '<div class="one_msg"><div class="contact_name" val ="'+v.from+'"><span>'+v.name+'</span>:</div>'
		       +'<div class="message">'+v.info+'</div><div class="time">'+new Date(v.time)+'</div></div>';
	},
	add : function(v)
	{
		var cur_index = Tab.getCurIndex();
		var html = Message.temp(v);
		Message._addM(v,html);
	},
	
	send : function()
	{
		var msg = $("#send input").val();
		if(msg=="")
		{
			alert("message is not fill!");
			return;
		}
		var req = 
		{
			msg:msg,
			toID:ContactList.getID(),
			id:UI_control.id
		}
		
		var cur_index = Tab.getCurIndex();
		var re = {name:"you",info:msg,time:new Date(),from:"",to:req.toID};
		var html = Message.temp(re);
		
		Io.send(req,function(data)
		{
			if(!data.suc)
			{
				alert(data.info);
			}
			else
			{
				Message._addM(re,html);
				$("#send input").val("");
			}
		});
	},
	
	initUnread:function(data)
	{
		if(data&&data.length>0)
		{
			var ret = "";
			$.each(data,function(k,v)
			{
				ret += Message.temp(v);
			});
			$("#unread_con").html(ret);	
		}
	},
	
	joinin:function(data)
	{
		data.message = "online";
		var html = Message.temp(data);
		Message._addM(data,html);
	},
	leave:function(data)
	{
		data.message = "offline";
		var html = Message.temp(data);
		Message._addM(data,html);
	}
}