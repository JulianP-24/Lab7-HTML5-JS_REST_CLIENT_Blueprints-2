var apiclient = (function () {
    return {
        getBlueprintsByAuthor: function (author, callback) {
            const promise = $.get({
                url: "http://localhost:8080/blueprints" + author,
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(null, data);
                }, function (error) {
                    alert("No existen datos del autor!")
                }
            );
        },

        getBlueprintsByNameAndAuthor: function (name, author, callback) {
            const promise = $.get({
                url: "http://localhost:8080/blueprints" + author + "/" + name,
                contentType: "application/json",
            });
            promise.then(function (data) {
                    callback(null, data);
                }, function (error) {
                    alert("No existen datos del autor!")
                }
            );
        },
        putBlueprints:function(autor,obra,blueprintAct,callback){
            $.ajax({
                url: url+"/"+autor+"/"+obra,
                type: 'PUT',
                data: JSON.stringify(blueprintAct),
                contentType: "application/json"
            }).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
        },



    }
})();