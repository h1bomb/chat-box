/**
* UI_control
*/
UI_control=
{
	id:"",
	_validate:function(obj)
	{
		var ret = "";
		$.each(obj,function(k,v)
		{
			if(v.val=="")
			{
				ret += v.info+"\n"; 
			}
		});
		if(ret!="")
		{
			alert(ret);
			return false;
		}
		else
		{
			return true;
		}
	},
	login:function()
	{
		var id =  $("#id").val();
		var psw = $("#psw").val();
       
        var ret = UI_control._validate(
	    [
	       {
		     val : id,
		     info: "id is not filled!"
	       },
	       {
		  	 val : psw,
		     info: "password is not filled!"
	       }
	    ]);
	
	    if(ret)
	    {
		 	var req = 
			{
				id:id,
				psw:psw
			};
			Io.login(req,function(data)
			{
				if(data.suc)
				{
					$("#login").hide();
					UI_control.mainInit(data.data);
				}
				else
				{
					alert(data.info);
				}
			}); 
	    }
	},
	toReg:function()
	{
		$("#login").hide();
		$("#reg").show();
	},
	reg:function()
	{
	    var nickname = $("#nickname").val();
	    var psw = $("#reg_psw").val();
	    var ret = UI_control._validate(
	    [
	       {
		     val : nickname,
		     info: "nickname is not filled!"
	       },
	       {
		  	 val : psw,
		     info: "password is not filled!"
	       }
	    ]);
		var req = 
		{
			nickname:nickname,
			password:psw
		};
		
		if(ret)
		{
			Io.reg(req,function(data)
			{
				if(data.suc)
				{
					$("#reg").hide();
					UI_control.mainInit(data);
				}
				else
				{
					alert(data.info);
				}
			});
		}
	},
	send:function()
	{
		Message.send();
	},
	delContact:function(e)
	{
		e.stopPropagation();
		ContactList.del($(this));
	},
	addContact:function()
	{
		ContactList.add($(this));
	},
	logout:function()
	{
		Io.logout({id:UI_control.id},function(data)
		{
			if(data.suc)
			{
				$("#main").hide();
				$("#reg").hide();
				$("#login").show();
			}
		});
	},
	mainInit:function(data)
	{
		ContactList.init(data.contacts);
		Message.initUnread(data.unreadInfo);
		Tab.init();	
		UI_control.id = data.id;
		$("#main").show();	
		Io.loop(
			{
				id:data.id,
				name:data.name
			});
	},
	bind:function()
	{
		$("#submit").click(this.login);
		$("#login_reg").click(this.toReg);
		$("#reg_submit").click(this.reg);
		$("#log_out").click(this.logout);
		$("#send button").click(this.send);
		$("#send input").keyup(function(e)
		{
			if(e.keyCode==13)
			{
				$("#send button").click();
			}
		});
		$("#chat_con .contact_name").live("click",this.addContact);
		$("#contact_list a").live("click",this.delContact);
		$("#contact_list li").live("click",ContactList.say);
		$("#unread_tab").click(function()
		{
			Io.delmsg({id:UI_control.id},function(data)
			{
				//$("#unread_con").html("");
			});
		});
		$(".tab").live("tabChange",function()
		{
			var index = $(".tab").index(this);
			if(index==1)
			{
				$("#send").hide();
			}
			else
			{
				$("#send").show();
			}
		});
	}
}

$(function()
{
	UI_control.bind();
	var h = $(window).height();
	$(".tab_con").height(h-87);
	$(window).resize(function()
	{
		var h = $(window).height();
		$(".tab_con").height(h-87);
	});
});