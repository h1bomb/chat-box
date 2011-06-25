/*
*tab
*/
var Tab = 
{
	init:function()
	{
	  $(".tab_con").hide();
	  $(".tab").removeClass("on");
	
	  $(".tab_con:eq(0)").show();	
	  $(".tab:eq(0)").addClass("on");	
	  $(".tab").live("click",this.change)
	           .live("dblclick",this.removeTab);
	  
	},
	addTab:function(name,con,id,flag)
	{
		if(flag)
		{
			$(".tab").removeClass("on");
			$(".tab_con").hide();	
		}
		$(".tab:last").after("<div val='"+id+"' class='tab "+(flag?"on":"")+"'>"+name+"</div>");
		$(".tab_con:last").after("<div val='"+id+"' class='tab_con' style='display:"+(flag?"":"none")+"'>"+con+"</div>");
	},
	removeTab:function()
	{
		var index = $(".tab").index(this);
	
		if(index<2)
		{
			return;
		}
		$(this).prev().click();
		$(".tab_con:eq("+index+")").remove();
		$(this).remove();
	},
	change:function()
	{
		var index = $(".tab").index(this);
		
		$(".tab").removeClass("on");
		$(this).addClass("on");
		
		$(".tab_con").hide();
		$(".tab_con:eq("+index+")").show();
		
	 	$(this).trigger('tabChange',[index]);
	},
	getCurIndex:function()
	{
		var index = $(".tab").index($(".on"));
		return index;
	}
}