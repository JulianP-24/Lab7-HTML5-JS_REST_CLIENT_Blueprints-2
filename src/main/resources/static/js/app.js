var Module = (function () {
    let author;
    var consulta=apiclient;
    var lastxlist=null;
    var lastylist=null;
    var listPuntos = [];
    var datos;
    function getName(){
        author = document.getElementById("Autor").value;
        $("#autorLabel").text(author);
        return author;
    }

    var _blueprintData = function (valores) {
        $("#listBlueprints tbody").empty();

        if (valores == undefined){
            alert("No existe el autor ingresado");
            $("Autor").empty();
        } else {
            var arreglo = valores.map((elemento) => {
                return {
                    name: elemento.name,
                    puntos: elemento.points.length
                }
            });
            arreglo.map((elementos) => {
                $("#listBlueprints > tbody:last").append($("<tr><td>" + elementos.name + "</td><td>" + elementos.puntos.toString() + "</td><td>" + '<button id=" + elementos.name + "onclick=Module.drawPlan(\''+elementos.name+'\'),Module.funListener()>open</button>' + "</td></tr>"));
            });
            var totalPuntos = arreglo.reduce((suma, {puntos}) => suma + puntos, 0);
            $("#totalPoints").text(totalPuntos);


        }
    }
    var pintaparcero = function(data) {
        console.log(data);
        datos = data;
        const puntos = data.points;
        var planoSeleccionado = data.name;
        var c = document.getElementById("MyCanvas");
        var ctx = c.getContext("2d");
        var lastx ;
        var lasty ;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.restore();
        ctx.beginPath();
        listaCoord = puntos.map((elemento)=>{

            var miniArreglo = [];
            miniArreglo.push(elemento.x, elemento.y);
            if (!(miniArreglo in listPuntos)){
                listPuntos.push(miniArreglo);
            }
            if (lastx == undefined){
                lastx = elemento.x;
                lasty = elemento.y;
            }
            else{
                ctx.moveTo(lastx, lasty);
                ctx.lineTo(elemento.x, elemento.y);
                ctx.stroke();
                lastx = elemento.x;
                lasty = elemento.y;
                lastxlist = elemento.x;
                lastylist = elemento.y;
            }
        })
        ctx.stroke();
        $("#currentName").text(planoSeleccionado);
    }
    var draw = function (){
        const canvas = document.getElementById("MyCanvas");
        const contexto = canvas.getContext("2d");
        const color = "black";
        const grosor = 2;
        let xActual = 0, yActual = 0
        const obtenerXReal = (clientX) => clientX - canvas.getBoundingClientRect().left;
        const obtenerYReal = (clientY) => clientY - canvas.getBoundingClientRect().top;
        canvas.addEventListener("mousedown",evento = function (event){
                xActual = obtenerXReal(event.clientX);
                yActual = obtenerYReal(event.clientY);
                contexto.moveTo(lastxlist, lastylist);
                contexto.lineTo(xActual, yActual);
                contexto.fillStyle=color;
                contexto.fillStyle=grosor;
                contexto.stroke();
                lastxlist = xActual;
                lastylist = yActual;
                var parejas = [];
                parejas.push(lastxlist,lastylist);
                listPuntos.push(parejas);
                console.log(listPuntos);
        },false);

        };
    var savePlanD = function () {
        var json={datos:[listPuntos]};
        console.log(listPuntos);
        return json;
    }
    function borrar(){
        var c = document.getElementById("MyCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, 450, 450);
        ctx.beginPath();
        ctx.fillStyle = "white";
        console.log(MyCanvas.width)
        ctx.fillRect(0, 0, MyCanvas.width , MyCanvas.height);
        ctx.beginPath();
        lastxlist=null;
        lastylist=null;
        listPuntos = [];
    }

    return {
        planosAutor: function (){
            consulta.getBlueprintsByAuthor(getName(),_blueprintData);
        },
        drawPlan: function(name) {
            listPuntos = [];
            obra = name;
            consulta.getBlueprintsByNameAndAuthor(getName(),obra,pintaparcero);
        },
        savePlan: function(){
            x = savePlanD();
            if(document.getElementById("blueprint").style.display == 'none'){
                consulta.putBlueprints(getName(), datos.name, x, _blueprintData());
            }
            else{
                consulta.postBlueprints(getName(),datos,_blueprintData())
            }

        },
        newblueprint: function(){
            borrar();
            datos={"author":"","points":[],"name":""}
            draw();
            document.getElementById("blueprint").style.display ='block';
            document.getElementById("newblueprints").value = "";

        },

        funListener: draw
    };
})();

