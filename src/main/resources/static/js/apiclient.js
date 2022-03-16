var apiclient = (function () {
    return {
        getBlueprintsByAuthor: function (author, callback) {
             $.get("http://localhost:8080/blueprints/" + author).then(responseJSON =>{
                 callback(responseJSON)
             });

        },

        getBlueprintsByNameAndAuthor: function (author, name, callback) {
            const promise = $.get({
                url: "http://localhost:8080/blueprints/" + author + "/" + name,
                contentType: "application/json",
            });
            promise.then(responseJSON => {
                    callback(responseJSON);
                }, function (error) {
                    alert("No existen datos del autor!")
                }
            );
        },
        putBlueprints:function(autor,obra,blueprintAct,callback){
            $.ajax({
                url: "http://localhost:8080/blueprints/"+autor+"/"+obra,
                type: 'PUT',
                data: JSON.stringify(blueprintAct),
                contentType: "application/json"
            }).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
        },
        postBlueprints:function(autor,blueprintAct,callback){
            $.ajax({
                url: url,
                type: 'POST',
                data: JSON.stringify(blueprintAct),
                contentType: "application/json"
            }).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
        }



    };
})();