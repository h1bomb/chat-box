/*
* contactList
*/
var ContactList = 
{
	temp:function(data)
	{
		return "<li val='"+data.id+"' name='"+data.nickname+"'>"+data.nickname+"["+(data.state?"online":"offline")+"]<a href='#'>x</a></li>";
	},
	init:function(data)
	{
		var ret = "";
		$.each(data,function(k,v)
		{
			ret += ContactList.temp(v);
		});
		$("#contact_list ul").html(ret);
	},
	add:function(self)
	{
		Io.addContact({id:UI_control.id,cid:self.attr("val"),cname:self.find("span").text()},function(data)
		{
			if(data.suc)
			{
				$("#contact_list ul").append(ContactList.temp(data.info));
			}
			else
			{
				alert(data.info);
			}
		});
	},
	del:function(self)
	{
		Io.delContact({"id":UI_control.id,"cid":self.parent().attr("val")},function(data)
		{
			if(data.suc)
			{
				self.parents("li").remove();
			}
		});
	},
	say:function(e)
	{
		e.stopPropagation();
		var id = $(this).attr("val");
		var name = $(this).attr("name");
		if($(".tab[val='"+id+"']").length>0)
		{
			$(".tab[val='"+id+"']").click();
		}
		else
		{
			Tab.addTab(name,"",id,true);
		}
	},
	getID:function()
	{
		var index = Tab.getCurIndex();
		return $(".tab:eq("+index+")").attr("val");
	},
	joinin:function(data)
	{
		$("#contact_list li[val='"+data.from+"']").html(data.name+"[online]<a href='#'>x</a>");
	},
	leave:function(data)
	{
		$("#contact_list li[val='"+data.from+"']").html(data.name+"[offline]<a href='#'>x</a>");
	}
}