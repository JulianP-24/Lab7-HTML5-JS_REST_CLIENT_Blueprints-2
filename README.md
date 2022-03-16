#### Escuela Colombiana de Ingeniería
#### Procesos de desarrollo de software - PDSW
#### Construción de un cliente 'grueso' con un API REST, HTML5, Javascript y CSS3. Parte II.


![](img/mock2.png)

1. Agregue al canvas de la página un manejador de eventos que permita capturar los 'clicks' realizados, bien sea a través del mouse, o a través de una pantalla táctil. Para esto, tenga en cuenta [este ejemplo de uso de los eventos de tipo 'PointerEvent'](https://mobiforge.com/design-development/html5-pointer-events-api-combining-touch-mouse-and-pen) (aún no soportado por todos los navegadores) para este fin. Recuerde que a diferencia del ejemplo anterior (donde el código JS está incrustado en la vista), se espera tener la inicialización de los manejadores de eventos correctamente modularizado, tal [como se muestra en este codepen](https://codepen.io/hcadavid/pen/BwWbrw).
   ```js
   var draw = function (){
   const canvas = document.getElementById("MyCanvas");
   const contexto = canvas.getContext("2d");
   const color = "black";
   const grosor = 2;
   let xActual = 0, yActual = 0;
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
   },false);
   };
   ```

2. Agregue lo que haga falta en sus módulos para que cuando se capturen nuevos puntos en el canvas abierto (si no se ha seleccionado un canvas NO se debe hacer nada):
    1. Se agregue el punto al final de la secuencia de puntos del canvas actual (sólo en la memoria de la aplicación, AÚN NO EN EL API!).
    2. Se repinte el dibujo.
    
   ```js 
       var draw = function (){
        const canvas = document.getElementById("MyCanvas");
        const contexto = canvas.getContext("2d");
        const color = "black";
        const grosor = 2;
        let xActual = 0, yActual = 0;
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
     ```

3. Agregue el botón Save/Update. Respetando la arquitectura de módulos actual del cliente, haga que al oprimirse el botón:
    1. Se haga PUT al API, con el plano actualizado, en su recurso REST correspondiente.
    2. Se haga GET al recurso /blueprints, para obtener de nuevo todos los planos realizados.
    3. Se calculen nuevamente los puntos totales del usuario.
    
    Para lo anterior tenga en cuenta:

    * jQuery no tiene funciones para peticiones PUT o DELETE, por lo que es necesario 'configurarlas' manualmente a través de su API para AJAX. Por ejemplo, para hacer una peticion PUT a un recurso /myrecurso:

    ```javascript
    return $.ajax({
        url: "/mirecurso",
        type: 'PUT',
        data: '{"prop1":1000,"prop2":"papas"}',
        contentType: "application/json"
    });
    
    ```
    Para éste note que la propiedad 'data' del objeto enviado a $.ajax debe ser un objeto jSON (en formato de texto). Si el dato que quiere enviar es un objeto JavaScript, puede convertirlo a jSON con: 
	
    ```javascript
    JSON.stringify(objetojavascript),
    ```
    * Como en este caso se tienen tres operaciones basadas en _callbacks_, y que las mismas requieren realizarse en un orden específico, tenga en cuenta cómo usar las promesas de JavaScript [mediante alguno de los ejemplos disponibles](http://codepen.io/hcadavid/pen/jrwdgK).
   
    Se realiza una funcion de guardar en el ```app.js```, como la siguiente
   ```js
   var savePlanD = function () {
   var json={datos:[listPuntos]};
   console.log(listPuntos);
   return json;
   }
   ```
   Se crea una funcion publica que llama a la funcion privada savePlanD y que esta se usa en el html como funcion
   del boton correspondiente
   ```js
      savePlan: function(){
          x = savePlanD();
          consulta.putBlueprints(getName(), datos.name, x, _blueprintData());
   }
   ```
   En el ```apiclient.js``` se crea el metodo para realizar el put al API usando ajax
   ```js
      putBlueprints:function(autor,obra,blueprintAct,callback){
            $.ajax({
                url: "http://localhost:8080/blueprints/"+autor+"/"+obra,
                type: 'PUT',
                data: JSON.stringify(blueprintAct),
                contentType: "application/json"
            }).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
        }
   ```
4. Agregue el botón 'Create new blueprint', de manera que cuando se oprima: 
    * Se borre el canvas actual.
    * Se solicite el nombre del nuevo 'blueprint' (usted decide la manera de hacerlo).
	
    Esta opción debe cambiar la manera como funciona la opción 'save/update', pues en este caso, al oprimirse la primera vez debe (igualmente, usando promesas):

    1. Hacer POST al recurso /blueprints, para crear el nuevo plano.
    2. Hacer GET a este mismo recurso, para actualizar el listado de planos y el puntaje del usuario.
    
   Se crea el metodo para borrar el canvas actual en ```app.js``` como se muestra a continuacion
   ```js
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
   ```
   Se crea una funcion publica que llama a la funcion privada de borrar y a la funcion que lee los 
   eventos del mouse
   ```js
      newblueprint: function(){
            borrar();
            datos={"author":"","points":[],"name":""}
            draw();
            document.getElementById("blueprint").style.display ='block';
            document.getElementById("newblueprints").value = "";
        }
   ```
   En el ```apiclient.js``` se tiene un metodo para hacer la peticion post que se cominica con el API
   ```js
      postBlueprints:function(autor,blueprintAct,callback){
            $.ajax({
                url: "http://localhost:8080/blueprints/",
                type: 'POST',
                data: JSON.stringify(blueprintAct),
                contentType: "application/json"
            }).then((responseJSON)=>apiclient.getBlueprintsByAuthor(autor,callback))
        }
   ```
   Se modifica la funcion publica savePlan que llama a la funcion privada savePlanD para que ahora se diferencie
   cuando hacer el put y cuando hacer el post
   ```js
      savePlan: function(){
            x = savePlanD();
            if(document.getElementById("blueprint").style.display == 'none'){
                consulta.putBlueprints(getName(), datos.name, x, _blueprintData());
            }
            else{
                consulta.postBlueprints(getName(),datos,_blueprintData())
            }
        }
   ```

5. Agregue el botón 'DELETE', de manera que (también con promesas):
    * Borre el canvas.
    * Haga DELETE del recurso correspondiente.
    * Haga GET de los planos ahora disponibles.

### Criterios de evaluación

1. Funcional
	* La aplicación carga y dibuja correctamente los planos.
	* La aplicación actualiza la lista de planos cuando se crea y almacena (a través del API) uno nuevo.
	* La aplicación permite modificar planos existentes.
	* La aplicación calcula correctamente los puntos totales.
2. Diseño
	* Los callback usados al momento de cargar los planos y calcular los puntos de un autor NO hace uso de ciclos, sino de operaciones map/reduce.
	* Las operaciones de actualización y borrado hacen uso de promesas para garantizar que el cálculo del puntaje se realice sólo hasta cando se hayan actualizados los datos en el backend. Si se usan callbacks anidados se evalúa como R.
	
