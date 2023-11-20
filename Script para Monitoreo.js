/*
Práctica 2.1: Configuración del laboratorio
Crear un ReplicaSet para el ejercicio
*/

clear
echo Correr una replicaset
#!/bin/bashcuando ya se tiene instalado monogodb
echo creando las carpetas

cd ~
rm -r replica
mkdir replica
mkdir dataset
cd replica
mkdir -p node1/data node1/logs node2/data node2/logs node3/data node3/logs

echo Iniciando los nodos del replicaset

mongod --dbpath node1/data --logpath node1/logs/mongod.log --port 27020  --replSet replicas --oplogSize 50 --fork
mongod --dbpath node2/data --logpath node2/logs/mongod.log --port 27018 --replSet replicas --oplogSize 50 --fork
mongod --dbpath node3/data --logpath node3/logs/mongod.log --port 27019 --replSet replicas --oplogSize 50 --fork

echo Iniciando el replica set

mongosh --port 27018 --eval 'rs.initiate( {"_id":"replicas","members": [ {"_id":0, "host": "localhost:27019" },{"_id":1, "host": "localhost:27018" },{"_id":2, "host": "localhost:27020"}]})'


mkdir dataset
cd dataset

rm -r *
wget https://raw.githubusercontent.com/adiacla/bigdata/master/papeleriarpl.js
wget https://raw.githubusercontent.com/adiacla/bigdata/master/cargarcolegiosrpl.js

mongosh mongodb://localhost:27020,localhost:27018,localhost:27019/?replicaSet=replicas -f papeleriarpl.js -f cargarcolegiosrpl.js

mongosh mongodb://localhost:27020,localhost:27018,localhost:27019/?replicaSet=replicas --quiet --eval "use admin" --eval "show dbs"
mongosh mongodb://localhost:27020,localhost:27018,localhost:27019/?replicaSet=replicas --eval "show collections"
mongosh mongodb://localhost:27020,localhost:27018,localhost:27019/?replicaSet=replicas --quiet --eval "use almacen" --eval "db.inventario.findOne()"

mongosh mongodb://localhost:27020,localhost:27018,localhost:27019/?replicaSet=replicas
use colegio

/*

serverStatus
el comando devuelve un documento que proporciona una visión general 
del estado de la base de datos. Monitoreo las aplicaciones pueden 
ejecutar este comando en un intervalo regular para recopilar 
estadísticas sobre la instancia.
*/

db.serverStatus( )
//opicional 
db.runCommand(
   {
     serverStatus: 1
   }
)
db.serverStatus( { repl: 0,  metrics: 0, locks: 0 } )
db.serverStatus( { repl: 1 } )
db.serverStatus().metrics.commands.findAndModify
db.serverStatus().metrics.commands.update.pipeline
db.serverStatus().opcounters
db.serverStatus().transactions
db.serverStatus().mem
db.serverStatus().

https://www.mongodb.com/docs/manual/reference/command/serverStatus/#std-label-server-status-output

/*
db.stats()
db.stats(scale)
Devuelve estadísticas que reflejan el estado de uso de un solo base de datos.
*/

db.stats() 
db.stats(1024)
db.stats().indexSize
db.stats(1024).indexSize
db.stats( { freeStorage: 1, scale: 1024 } ).indexFreeStorageSize

/*
replSetGetStatus 
el comando devuelve el estado de la réplica establecer desde el 
punto de vista del servidor que procesó el comando. 
replSetGetStatus debe ser ejecutado en el base de datos de 
administrador.

El mongod la instancia debe ser un miembro de conjunto de réplicas 
para replSetGetStatus para volver con éxito.

Los datos proporcionados por este comando se derivan de los datos 
incluidos en heartbeats enviados al servidor por otros 
miembros del conjunto de réplicas. Debido a la frecuencia de 
los heartbeats, estos datos pueden ser varios segundos desactualizados.
*/
use admin
db.adminCommand(
   {
     replSetGetStatus: 1
   }
)

https://www.mongodb.com/docs/manual/reference/command/replSetGetStatus/

db.adminCommand( { replSetGetStatus: 1 } ).myState
db.adminCommand( { replSetGetStatus: 1 } ).


db.setProfilingLevel(level, options)
Changed in version 5.0.

/*
Profiling
El método habilita, deshabilita, o configura el 
Perfilador de Base de Datos. El profiler captura y registra datos 
sobre el rendimiento de la escritura operaciones, cursores y 
comandos de base de datos en una ejecución mongod instancia. 
Si el perfilador está deshabilitado, el método configura cómo 
se registran las operaciones lentas en el diagnóstico registro.
*/

use banco

for (let i = 1; i <= 10000; ++i) { db.cuenta.insertOne({ "numero": "1000-" + i, "moneda": i > 5000 ? "soles" : "pesos", "saldo": Math.random() * 10000 }); }

db.getProfilingStatus()
db.setProfilingLevel(2)
db.getProfilingStatus()

db.cuentas.findOne({ "saldo": Math.random() * 10000)

db.cuenta.find({"numero": "1000-888"})

db.cuenta.find().limit(3)

db.system.profile.find()
db.system.profile.find().sort({ "ts" : -1 })
db.system.profile.find({},{ns:1,millis:1}).sort({ "millis" : -1 })
db.system.profile.find({op="query"}).sort({ "millis" : -1 })

db.system.profile.find({},{ns:1,"command.filter":1,millis:1}).sort({ "millis" : -1 })

db.getProfilingStatus()
db.setProfilingLevel(1, { slowms: 20 })
db.getProfilingStatus()
/*
El shell devuelve un documento que muestra el anterior nivel de perfil. 
los "ok" : 1 el par clave-valor indica que la operación tuvo éxito:

Perfilar una muestra aleatoria de operaciones lentas
Para perfilar sólo un subconjunto muestreado aleatoriamente de todas las 
operaciones lentas , especifique la frecuencia de muestreo deseada de una 
de las siguientes maneras:
*/

db.setProfilingLevel(1, { sampleRate: 0.42 })

/*
Establecer un filtro para determinar las operaciones generadas
Nuevo en la versión 4.4.2.

Puede establecer un filtro para controlar qué operaciones se perfilan y anotado. 
Puede definir el filtro de generación de perfiles de una de las siguientes maneras:
*/

db.setProfilingLevel( 2, { filter: { op: "query", millis: { $gt: 2000 } } } )

db.getProfilingStatus()

db.system.profile.drop()
 
/*
Desactivar la generación de perfiles

Para deshabilitar la generación de perfiles, utilice la siguiente ayuda en 
mongosh:
*/
db.setProfilingLevel(0)



/*
Para habilitar la generación de perfiles para un 
mongod instancia, pase lo siguiente opciones para 
mongod al inicio.
*/

mongod --profile 1 --slowms 15 --slowOpSampleRate 0.5

/*
Ejemplos de consultas de datos del generador de perfiles
En esta sección se muestran consultas de ejemplo a la 
system.profile colección. Para obtener una explicación 
del resultado de la consulta, consulte Salida del 
generador de perfiles de base de datos.
*/

/*
Para devolver las 10 entradas de registro más recientes en el cuadro system.profile , 
ejecute una consulta similar a la siguiente:
*/
db.system.profile.find().limit(10).sort( { ts : -1 } )


/*
Para devolver todas las operaciones excepto las operaciones de comando ($cmd),
 ejecutar una consulta similar al siguiente
*/
db.system.profile.find( { op: { $ne : 'command' } } )

/*
Para devolver operaciones para una colección determinada,
 ejecute una consulta similar a lo siguiente. 
 En este ejemplo se devuelven operaciones de la 
 colección de la base de datos:mydbtest
*/
db.system.profile.find( { ns : 'banco.cuenta' } )

/*
Para devolver operaciones más lentas que milisegundos, 
ejecute una consulta similar al siguiente:5
*/
db.system.profile.find( { millis : { $gt : 5 } } )

/*
Para devolver información de un intervalo de tiempo 
determinado, ejecute una consulta similar a Lo 
siguiente:
*/
db.system.profile.find({
  ts : {
    $gt: new ISODate("2023-11-18T03:00:00Z"),
    $lt: new ISODate("2023-11-19T21:40:00Z")
  }
})

/*
En el ejemplo siguiente se examina el intervalo de 
tiempo, se suprime el campo de la salida para 
facilitar la lectura y se ordenan los resultados 
Por cuánto tiempo tardó en ejecutarse cada 
operación:user
*/

db.system.profile.find({
  ts : {
    $gt: new ISODate("2023-11-18T03:00:00Z"),
    $lt: new ISODate("2023-11-19T20:40:00Z")
  }
}, { user: 0 }).sort( { millis: -1 } )

db.system.profile.find({user:''},{ns:1,"command.filter":1,millis:1}).sort({ "millis" : -1 })

/*
explain proporciona información sobre el ejecución de los siguientes comandos: aggregate, count, distinct, find, findAndModify, delete, mapReduce, y update.
*/

db.collection.explain()

Lo siguiente explain  el comando se ejecuta en "queryPlanner" modo de verbosidad 
para devolver la información de planificación de consulta para un count comando:

use almacen

db.runCommand(
   {
     explain: { count: "item", query: { qty: { $gt: 15 } } },
     verbosity: "queryPlanner"
   }
)


db.inventario.explain().count( { qty: { $gt: 15 } } )

/*
La siguiente operación se ejecuta en "executionStats" modo de verbosidad 
para devolver la información de planificación y ejecución de consultas 
para un count comando:
 */
 
db.inventario.explain("executionStats").find(
   { qty: { $gt: 15 }, estado: 'C'}
)

db.inventario.find(
   { qty: { $gt: 15 }, estado: 'C'}
).explain("executionStats")

allPlansExecution 
Se ejecuta en modo verbosidad "allPlansExecution". 
El siguiente comando devuelve el queryPlanner y executionStats para todos los 
planes considerados para un update comando:

db.runCommand( { explain: { update: "inventario", updates: [ { q: { qty: { $lte: 6 }}, u: { $set: { "reordenar": true }} } ]}})

db.inventario.find({},{qty:1,reordenar:1})


var explainResult = db.inventario.explain().find( { estado: "C" } ).next();
var explainResult = db.inventario.explain().find( { estado: "C" } );


**********************************************************************************

Indice

**********************************************************************************

use papeleria
db.inventario.insertMany( [
 { "item": "libro", "qty":6, "precio":NumberDecimal("12.8"),"color":["rojo","azul","verde"],"tamano":[10,12.1,14.2],"stock": [ { "bodega": "principal", "ubicacion":[-77.02824,-12.04318],"cantidad": 5 }, { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889], "cantidad": 15 } ],"estado":"A", "ventas": { "nacional": 14, "internacional": 21, "licencia":true }, "fecha" : ISODate("2014-03-01T08:00:00Z"),"evaCalidad": [ 10, 9, 10 ], "evaLogistica": [ 8, 6, 8 ], "localizacion": { "type": "Point", "coordinates": [-77.02824,-12.04318] }, "ciudad":"Lima", "detalle":{"producto": "libro","codigobar" : "978020137962"}},
 { "item": "cuaderno","qty":10, "precio":NumberDecimal("8.3"), "color":["blanco","verde","azul"], "tamano":[10.3,18,12], "stock": [ { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889],"cantidad": 5 } ], "estado":"B","fecha" : ISODate("2014-03-01T09:00:00Z"),"evaCalidad": [ 8, 8, 8 ], "evaLogistica": [ 7, 7, 7 ], "localizacion": { "type": "Point", "coordinates": [ -75.72861,-14.06777] }, "ciudad":"Ica","detalle":{"producto": "cuaderno","codigobar":"318032117901"}},
 { "item": "hojas", "qty":30,"precio":NumberDecimal("6.2"),"color":["verde","azul"],"tamano":[16,18.4,21],"stock": [ { "bodega": "principal", "ubicacion":[-77.02824,-12.04318],"cantidad": 60 }, { "bodega": "regional", "ubicacion":[-79.02998,-8.11599],"cantidad": 15 } ],"estado":"B", "ventas": { "nacional": 5, "internacional": 10, "licencia":true },"fecha" : ISODate("2014-03-15T09:00:00Z"),"evaCalidad": [ 4, 4, 4 ], "evaLogistica": [ 4, 4, 4 ], "localizacion": { "type": "Point", "coordinates": [-71.535,-16.39889 ] },"ciudad":"Arequipa","detalle":{"producto": "hojas","codigobar":"318032117901"}},
 { "item": "escuadra", "qty":25,"precio":NumberDecimal("3.1"),"color":["blanco"],"tamano":[21.5,14,6],"stock": [ { "bodega": "principal", "ubicacion":[-77.02824,-12.04318],"cantidad": 40 }, { "bodega": "regional", "ubicacion":[-79.02998,-8.11599],"cantidad": 5 } ],"estado":"A","ventas": { "nacional": 13, "internacional": 21, "licencia":false },"fecha" : ISODate("2014-04-04T11:21:39.736Z"),"evaCalidad": [ 10, 10, 10 ], "evaLogistica": [ 4, 4, 4 ], "localizacion": { "type": "Point", "coordinates": [-79.02998,-8.11599 ]},"ciudad":"Callao","detalle":{"producto": "escuadra","codigobar": "658022512902"}},
 { "item": "regla", "qty":15,"precio":NumberDecimal("10.4"),"color":["verde","azul"], "tamano":[13,14,20.2],"stock": [ { "bodega": "regional","ubicacion":[-79.02998,-8.11599], "cantidad": 15 }, { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889],"cantidad": 35 } ],"estado":"C", "ventas": { "nacional": 12, "internacional": 9, "licencia":true }, "fecha" : ISODate("2014-04-04T21:23:13.331Z"),"evaCalidad": [ 5, 5, 6 ], "evaLogistica": [ 6, 6, 6 ], "localizacion": { "type": "Point", "coordinates": [-79.02998,-8.11599] },"ciudad":"Trujillo","detalle":{"producto": "regla","codigobar" : "208020137903"}},
 { "item": "lapiceros", "qty":3,"precio":NumberDecimal("15"),"color":["amarillo","azul","verde"],"stock": [ { "bodega": "principal", "ubicacion":[-77.02824,-12.04318],"cantidad": 5 }, { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889], "cantidad": 15 } ],"estado":"A","ventas": { "nacional": 25, "internacional": 8, "licencia":true },"fecha" : ISODate("2015-06-04T05:08:13Z"),"evaCalidad": [ 8, 8, 8 ], "evaLogistica": [ 8, 8, 8 ], "localizacion": { "type": "Point", "coordinates": [-79.84088,-6.77137] },"ciudad":"Chiclayo","detalle":{"producto": "lapiceros","codigobar" : "314021137941"}},
 { "item": "portalapices","qty":21,"precio":NumberDecimal("20"), "color":["blanco","amarillo","azul"], "tamano":[32,13,10], "stock": [ { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889],"cantidad": 5 } ], "estado":"B","fecha" : ISODate("2015-09-10T08:43:00Z"),"evaCalidad": [ 10, 10, 10 ], "evaLogistica": [ 10, 10, 10 ], "localizacion": { "type": "Point", "coordinates": [-73.25383,-3.74912] },"ciudad":"Iquitos","detalle":{"producto": "portalapices","codigobar" : "322221137941"}},
 { "item": "portatil", "qty":12,"precio":NumberDecimal("14.5"),"color":["negro","azul"],"tamano":[25,20,66.8],"stock": [ { "bodega": "principal", "ubicacion":[-77.02824,-12.04318],"cantidad": 60 }, { "bodega": "regional", "ubicacion":[-79.02998,-8.11599],"cantidad": 15 } ],"estado":"B","ventas": { "nacional": 8, "internacional": 7, "licencia":false },"fecha" : ISODate("2016-02-06T20:20:13Z"),"evaCalidad": [ 10, 8, 8 ], "evaLogistica": [ 4, 4, 4 ], "localizacion": { "type": "Point", "coordinates": [-80.63282,-5.19449] },"ciudad":"Piura","detalle":{"producto": "portatil","codigobar" : "978251237939"}},
 { "item": "impresora", "qty":16,"precio":NumberDecimal("2.3"),"color":["blanco"],"tamano":[12.7,14.6,16],"stock": [ { "bodega": "principal", "ubicacion":[-77.02824,-12.04318],"cantidad": 40 }, { "bodega": "regional", "ubicacion":[-79.02998,-8.11599],"cantidad": 5 } ],"estado":"A", "ventas": { "nacional": 9, "internacional": 10, "licencia":true },"fecha" : ISODate("2015-06-04T05:08:13Z"),"evaCalidad": [ 6, 8, 8 ], "evaLogistica": [ 9, 9, 9 ], "localizacion": { "type": "Point", "coordinates": [-71.96734,-13.52264 ] },"ciudad":"Cusco","detalle":{"producto": "impresora","codigobar" : "314021188888"}},
 { "item": "tarjetas", "qty":40,"precio":NumberDecimal("4.1"),"color":["gris"], "tamano":[5.1,7.2,2],"stock": [ { "bodega": "regional","ubicacion":[-79.02998,-8.11599], "cantidad": 15 }, { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889],"cantidad": 35 } ],"estado":"C", "ventas": { "nacional": 7, "internacional": 18, "licencia":true },"fecha" : ISODate("2015-06-04T05:08:13Z"),"evaCalidad": [6, 9, 6 ], "evaLogistica": [ 8, 8, 8 ], "localizacion": { "type": "Point", "coordinates": [-74.22321,-13.15878 ] },"ciudad":"Ayacucho","detalle":{"producto": "tarjetas","codigobar" : "818060327925"}}])

use papeleria
cls
show collections
db.inventario.find()
db.inventario.getIndexes()
db.inventario.totalIndexSize()



Selecciones un _id

db.inventario.find({_id: ObjectId("649cc5af27dfc167e3502b12")}).explain('executionStats')

Check if an index is being used on a query
********************************************

db.inventario.find({_id: ObjectId("64ff57b929611d326fbf101a")}).explain('executionStats')


Detalles de uso del índice a través de explain
**********************************************


Para usar el método explique en su modo predeterminado, 
puede pasar en el queryPlanner parámetro, o 
puede invocar el método sin ningún parámetro. 
Cuando no se proporciona ningún parámetro, 
el modo predeterminado (queryPlanner Se utilizará ).

db.inventario.explain("queryPlanner").find({ qty: { $gt: 20 }, estado:"A" })

// or

db.inventario.explain().find({ qty: { $gt: 20 }, estado:"A" })

db.inventario.find({ qty: { $gt: 20 }, estado:"A" }).explain('executionStats')

db.inventario.find({ qty: { $gt: 20 }, estado:"A" }).explain()

db.inventario.find({ qty: { $gt: 20 }, estado:"A" }).explain('executionStats').queryPlanner.winningPlan

db.inventario.explain('executionStats').find({ qty: { $gt: 20 }, estado:"A" }).sort({ qty: -1 })


Para usar el método de explicación en executionStats 
modo para obtener estadísticas detalladas de 
ejecución ( incluyendo nReturned, totalKeysExamined,
 totalDocsExamined, y executionTimeMillis), 
 puede pasar la cadena executionStats al método de 
 explicación como parámetro, así:

db.inventario.explain('executionStats').find({ "ventas.nacional":9 }).sort({ qty: -1 })

Los allPlansExecution El modo de verbosidad devolverá la salida que contiene puntajes que el planificador de consultas de MongoDB calcula para cada índice en función de una serie de factores. Para usar el método de explicación en allPlansExecution modo, puedes pasar la cadena allPlansExecution al método de explicación como parámetro, así
db.collection.explain("allPlansExecution").find({ "ventas.nacional":9 }).sort({ qty: -1 })

Check if an index is being used on a query
Use explain() in a collection when running a query to see the Execution plan. This plan provides the details of the execution stages (IXSCAN , COLLSCAN, FETCH, SORT, etc.).

The IXSCAN stage indicates the query is using an 
index and what index is being selected.
The COLLSCAN stage indicates a collection scan is 
perform, not using any indexes.
The FETCH stage indicates documents are being read 
from the collection.
The SORT stage indicates documents are being sorted 
in memory.

Búsqueda sin indice

db.inventario.find({item:"qty"}).explain('executionStats')


Create a Single Field Index
***************************

Use createIndex() to create a new index in a collection. Within the parentheses of createIndex(), include an object that contains the field and sort order.

db.inventario.createIndex({ qty: 1 })
db.inventario.find({item:"qty"}).explain('executionStats')


Create a Unique Single Field Index
**********************************
Add {unique:true} as a second, optional, parameter 
in createIndex() to force uniqueness in the index 
field values. Once the unique index is created, 
any inserts or updates including duplicated values 
in the collection for the index field/s will fail.

db.inventario.createIndex({ item: 1 }, { unique: true })

Traer el nombre del índice
db.inventario.getIndexes('item')
cls

Create a Single field Multikey Index
**************************************
Use createIndex() to create a new index in a 
collection. Include an object as parameter 
that contains the array field and sort order. 
In this example accounts is an array field.

db.inventario.createIndex({
  color: -1
})

db.inventario.aggregate({$match:{color:"blanco"}},{ $project:{_id:0,color:1}})
db.inventario.aggregate({$match:{color:"blanco"}},{ $project:{_id:0,color:1}}).explain('executionSta



Working with Compound Indexes
*****************************


db.inventario.createIndex({
  estado:1, 
  ciudad:-1
})

db.inventario.aggregate({$match:{estado:"A"}},{ $project:{_id:0,estado:1}}).explain('executionStats')
db.inventario.aggregate({$match:{estado:"A",ciudad:"lima"}},{ $project:{_id:0,estado:1}}).explain('executionStats')
db.inventario.aggregate({$match:{ciudad:"lima",estado:"A"}},{ $project:{_id:0,estado:1}}).explain('executionStats')
db.inventario.aggregate({$match:{qty:{ $gt: 70, $lt: 90 } ,estado:"A"}},{ $project:{_id:0,estado:1}}).explain('executionStats')

IXSCAN - Escaneo de índice usando el índice compuesto

PROYECTION_COVERED - Toda la información necesaria 
es devuelta por el índice, no es necesario buscarla 
de la memoria


Colecciones de series de tiempo
**********************************
db.inventario.createIndex( { "fecha": 1 } )
db.inventario.explain().find({},{project:{fecha:1}}).sort({ "fecha": 1 })
db.inventario.createIndex( { "item": 1, "fecha": 1 } )
db.inventario.explain().find({},{project:{fecha:1}}).sort({ "fecha": 1 })


Eliminar un índice
*********************

Revise el siguiente código, que demuestra cómo eliminar índices en una colección.

Eliminar un índice
Revise el siguiente código, que demuestra cómo eliminar índices en una colección.


Ver los índices utilizados en una colección
Usar getIndexes() para ver todos los índices creados en una colección. Siempre hay un índice predeterminado en cada colección en el campo _id. MongoDB utiliza este índice internamente y no se puede eliminar.

db.customers.getIndexes()

Eliminar un índice
Usar dropIndex() para eliminar un índice existente de una colección. Dentro de los paréntesis de dropIndex(), incluya un objeto que represente la clave de índice o proporcione el nombre de índice como una cadena.

Eliminar índice por nombre:

db.inventario.dropIndex(
  'color_-1'
)
Eliminar índice por clave:

db.inventario.createIndex({ color: -1 })
db.inventario.dropIndex({color:-1})

Varios indices
**************
db.collection.dropIndexes([
  'index1name', 'index2name', 'index3name'
  ])
  
  
db.inventario.createIndex({item:1,qty:1},{name:'consulta de inventario'})


db.inventario.createIndex({item:1,precio:-1},{name:'consulta de precio por articulo'})

db.inventario.explain('executionStats').find({item:"tarjeta"})

Tiempo con $ne 
db.inventario.explain('executionStats').find({item:{$ne:"tarjeta"}})b.inventario.find({item:{$eq:"tarjeta"}}).explain('executionStats').consulta.queryPlanner.winningPlan.stage

var consulta=db.inventario.find({item:{$eq:"tarjeta"}}).explain('executionStats')
consulta.queryPlanner.winningPlan.stage
consulta.executionStats.executionStages.inputStage.indexBounds.qty

var consulta=db.inventario.find({$and:[{qty:{$gt:20}},{qty:{$lt:40}}]},{qty:1})
consulta.executionStats.executionStages.inputStage

Para ordenar
db.inventario.find({$and:[{qty:{$gt:20}},{qty:{$lt:40}}]},{qty:1}).sort({qty:1})

db.inventario.find({$and:[{qty:{$gt:20}},{qty:{$lt:40}}]},{qty:1}).sort({qty:1}).explain('executionStats')

unique
db.inventario.createIndex({estado:1},{unique:true})

Crear indice de documentos embebidos
db.inventario.createIndex( { ventas: 1 } )
db.inventario.find( {ventas: {nacional:14 ,internacional:21, licencia: true  }} )

ejemplo de indice parcial

db.inventario.find({color:{$in:['verde', 'azul']}},{item:1,color:1})
db.inventario.find({color:{$in:['verde', 'azul']}},{item:1,color:1}).count()
	{{
partialFilterExpression
db.inventario.createIndex({item:1},{partialFilterExpression:{color:{$in:['verde', 'azul']}}})
db.inventario.find({item:"libro",color:{$in:['rojo']}})
db.inventario.find({item:"libro",color:{$in:['rojo']}}).explain('executionStats').executionStats.executionStages.stage
db.inventario.find({item:"libro",color:{$in:['verde']}}).explain('executionStats').executionStats.executionStages.stage

db.inventario.distinct("item")

Consultas cubiertas
 db.inventario.find({},{qty:1,precio:1,_id:0})
 db.inventario.createIndex({qty:1,precio:-1},{name:"cantidad y precio"})
db.inventario.find({qty:{$lt:30},precio:{$mod:[2,1]}},{qty:1,precio:1,_id:0})
db.inventario.find({qty:{$lt:30},precio:{$mod:[2,1]}},{qty:1,item:1,_id:0}).explain('executionStats')
queryPlanner.winningPlan.inputStage


********************************************************************************

MONGO STATS

********************************************************************************


El mongostat Utilidad proporciona una visión general 
rápida de la Estado de un mongod o mongos instancia. Uso 
mongostat Ayudar Identificar los cuellos de botella del sistema.

https://www.mongodb.com/docs/database-tools/mongostat/ revisar los fields

mongostat desde la línea de comandos del sistema, no desde la mongo shell.

Especificar el período y la frecuencia de recopilación mongostat
En el primer ejemplo, mongostat devolverá datos cada segundo durante 20 segundos. 
mongostat recopila datos de la mongod

Instancia que se ejecuta en la interfaz Localhost en 
Puerto 27017. Todas las invocaciones siguientes 
producen idénticos comportamiento:

mongostat --discover --humanReadable=true
mongosh 
use banco
for (let i = 1; i <= 5000; ++i) {
    db.cuentas.insertOne({
        "numero": "2000-" + i,
        "moneda": "Soles",
        "saldo": Math.random() * 100000
    })
}

db.cuentas.countDocuments()

for (let i = 50001; i <= 10000; ++i) {
    db.cuentas.findOne({ "saldo": Math.random() * 100000
    })
}

for (let i = 1; i <= 2000; ++i) {
db.cuentas.updateOne( { "numero": "2000-" + i },
{$set: {"saldo": Math.random() * 100000}
})}

db.cuenta.find().limit(1500)

mongostat --rowcount=20 1
mongostat --rowcount=20
mongostat -n=20 1
mongostat -n=20


/* En el siguiente ejemplo, 
mongostat devuelve datos cada 5 minutos (o 300 segundos) durante el tiempo que se ejecute el programa. 
mongostat recopila datos de la mongod instancia que se ejecuta en el Interfaz localhost en el puerto . Lo siguiente Las invocaciones producen un comportamiento idéntico:27017
*/
mongostat --rowcount=0 300
mongostat -n=0 300
mongostat 300

/*
En el siguiente ejemplo, 
mongostat devuelve datos cada 5 minutos durante una hora (12 veces). 
mongostat recopila datos del mongod Instancia que se ejecuta en la interfaz LocalHost en el puerto 27017. Las siguientes invocaciones producen comportamiento:
*/
mongostat --rowcount=12 300
mongostat -n=12 300


Agregar campos a mongostat Salida 
-O permite especificar campos desde el serverStatus
 Salida para agregar al valor predeterminado mongostat. 
 Si incluyes un espacio en tu Nombre archivado 
 personalizado, no ponga comillas adicionales alrededor 
 del nombre del campo.

En el ejemplo siguiente se agregan campos al valor predeterminado 
mongostat salida:

mongostat -O='host,version,network.numRequests=network requests'
mongostat -O='host,version,network.numRequests=network requests' -n=3
 
Especificar mongostat Campos de salida
-o Especifica las columnas mongostat
incluye en su salida. Puede especificar cualquier 
serverStatus como un campo como mongostat salida columna.

En el ejemplo siguiente se utilizan campos personalizados para 
mongostat:

mongostat --port 27017 -o='opcounters.insert.rate()=Insertado,opcounters.query.rate()=Consultados' -n=4

mongostat --port 27017 -o='host,opcounters.insert.rate()=Insert Rate,opcounters.query.rate()=Query Rate,opcounters.command.rate()=Command Rate,wiredTiger.cache.pages requested from the cache=Pages Req,metrics.document.inserted=inserted rate' -n=4

/*
Ver la tasa de cambio de un campo con .rate()
.rate()  le permite ver la velocidad por segundo a la que un El campo numérico ha cambiado de uno 
mongostat  Llame a la próximo. Por ejemplo, puede ver la velocidad a la que se han realizado los documentos. insertado durante una operación de inserción. 
.rate() por lo tanto, puede ayudarle a ver el rendimiento de su 
mongod  instancia.
*/
mongostat -o='host,mem,bits,metrics.document.inserted.rate()=inserted rate,metrics.document.inserted=inserted' --rowcount=5


***************************
MONGOTOP
***************************

mongotop Proporciona un método para realizar un 
seguimiento de la cantidad de tiempo que un 
Instancia de MongoDB mongod  Gasta leyendo y escribiendo datos. 
mongotop Proporciona estadísticas por colección. De forma predeterminada, 
mongotop  devuelve valores cada segundo.

Correr mongotop  desde la línea de comandos del sistema, no desde la 
mongo shell.

mongotop

/*
Tener mongotop informe cada 30 segundos, especifique 
el Intervalo de sondeo:
*/
mongotop 30

Por ejemplo, para conectar mongotop a un mongod
 Instancia que se ejecuta en un host 
 remoto e informe cada 30 segundos:mongodb0.example.com

Puede incluir la frecuencia deseada de informes 
(en este ejemplo, 30 segundos) y el --uri
 Opción para especificar el host y el puerto:

mongotop 30 --uri='mongodb://mongodb0.example.com:27017' [additional options]


Si el mongod Instancia requiere autenticación, usted 
Puede especificar la base de datos de usuario, 
contraseña y autenticación como parte de la cadena 
de conexión URI:

mongotop 30 --uri='mongodb://user:password@mongodb0.example.com:27017/?authSource=admin' [additional options]

El usuario que ejecuta mongotop debe tener el serverStatus
 y top Privilegios.

Para obtener más información sobre la cadena de conexión URI, consulte 
--uri.

Alternativamente, puede utilizar el botón --host  y 
--port  Opciones para especificar el host y puerto:

mongotop 30 --host=mongodb0.example.com --port=27017 [additional options]

Si el mongod instancia requiere autenticación, usted puede especificar el usuario 
-u , y el Base de datos de autenticación  
--authenticationDatabase
. Omita el 
--password
 Opción de tener mongoexport solicitar el contraseña.

mongotop 30 --host=mongodb0.example.com --port=27017 -u=user --authenticationDatabase=admin [additional options]

El usuario que ejecutA mongotop debe tener el serverStatus  y 
top Privilegios.
