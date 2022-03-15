var Module = (function () {
    let author;
    var consulta=apimock;
    var lastxlist=null;
    var lastylist=null;
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
                $("#listBlueprints > tbody:last").append($("<tr><td>" + elementos.name + "</td><td>" + elementos.puntos.toString() + "</td><td>" + '<button id=" + elementos.name + "onclick=Module.drawPlan(\''+elementos.name+'\')>open</button>' + "</td></tr>"));
            });
            var totalPuntos = arreglo.reduce((suma, {puntos}) => suma + puntos, 0);
            $("#totalPoints").text(totalPuntos);


        }
    }
    function pintaparcero(data) {
        const puntos = data.points;
        var planoSeleccionado = data.name;
        var c = document.getElementById("MyCanvas");
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.restore();
        ctx.beginPath();
        /*for (let i = 1; i < puntos.length; i++) {
            ctx.moveTo(puntos[i - 1].x, puntos[i - 1].y);
            ctx.lineTo(puntos[i].x, puntos[i].y);
            if (i === puntos.length - 1) {
                ctx.moveTo(puntos[i].x, puntos[i].y);
                ctx.lineTo(puntos[0].x, puntos[0].y);
            }
        }*/
        for(let i =0; i<puntos.length-1; i++){
            ctx.moveTo(puntos[i].x, puntos[i].y);
            ctx.lineTo(puntos[i+1].x, puntos[i+1].y);
            lastxlist = puntos[i+1].x;
            lastylist = puntos[i+1].y;
        }
        ctx.stroke();
        $("#currentName").text(planoSeleccionado);
    }
    var draw = function (){
        const canvas = document.getElementById("MyCanvas");
        const contexto = canvas.getContext("2d");
        const color = black;
        const grosor = 2;
        let xActual = 0, yActual = 0;
        const obtenerXReal = clientX - canvas.getBoundingClientRect().left;
        const obtenerYReal = clientY - canvas.getBoundingClientRect().top;
        canvas.addEventListener("mousedown",evento=function (){
                xActual = obtenerXReal;
                yActual = obtenerYReal;
                contexto.moveTo(lastxlist, lastylist);
                contexto.lineTo(xActual, yActual);
                contexto.fillStyle=color;
                contexto.stroke();
                lastxlist = xActual;
                lastylist = yActual;

        },false);

        };


    return {
        planosAutor: function (){
            consulta.getBlueprintsByAuthor(getName(),_blueprintData);
        },
        drawPlan: function(name) {
            obra = name;
            consulta.getBlueprintsByNameAndAuthor(getName(),obra,pintaparcero);
        },
        funListener: draw
    };
})();

