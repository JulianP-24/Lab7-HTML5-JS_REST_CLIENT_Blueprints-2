//@author hcadavid

apimock=(function(){

	var mockdata=[];

	mockdata["johnconnor"]=	[
		{
			author:"johnconnor",
			"name":"house",
			"points":[
				{
					"x":150,
					"y":120
				},
				{
					"x":215,
					"y":115
				}
			]
		},
	 	{
		 author:"johnconnor",
			"name":"gear",
			"points":[
				{
					"x":340,
					"y":240
				},
				{
					"x":15,
					"y":215
				}
			]
		 }
	];
	mockdata["maryweyland"]=[
		{
			author: "maryweyland",
			"name": "house2",
			"points": [
				{
					"x": 140,
					"y": 140
				},
				{
					"x": 115,
					"y": 115
				}
			]
		},
	    {
			author:"maryweyland",
			"name":"gear2",
			"points":[
				{
					"x":140,
					"y":140
				},
				{
					"x":115,
					"y":115
				}
			]
		}
	];
	mockdata["harryP"]=[
		{
			author:"Potter",
			"name":"hogwarts",
			"points":[
				{
					"x":50,
					"y":90
				},
				{
					"x":130,
					"y":125
				}
			]
		}
	];

	return {
		getBlueprintsByAuthor:function(authname,callback){
			callback(
				mockdata[authname])

		},

		getBlueprintsByNameAndAuthor:function(authname,bpname,callback){
			callback(
				mockdata[authname].filter(prueb => {return prueb.name === bpname;})[0]
			);
		}
	};

})();

/*
Example of use:
var fun=function(list){
	console.info(list);
}

apimock.getBlueprintsByAuthor("johnconnor",fun);
apimock.getBlueprintsByNameAndAuthor("johnconnor","house",fun);*/