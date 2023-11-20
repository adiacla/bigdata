/*
Práctica 1.5: Seguridad, Respaldo y recuperación
Material del tutor
*/

/*
Preparando la base de datos y colecciones para el laboratorio.
Creando los directorios para la instancia de pruebas. */

mkdir seguridad
cd seguridad
mkdir -p nodo1/data nodo1/logs
tree
//Levantando una instancia de MongoDB.
mongod --dbpath nodo1/data --logpath nodo1/logs/mongod.log --port 27018 --oplogSize 50 --fork

//Conectándonos a la instancia de mongo

mongosh --port 27018
	

//Cree de superusuario en CSRS:
use admin
db.createUser({user: "root",pwd: "root123",roles: [{role: "root", db: "admin"}]})

//Autenticando como el superusuario:

db.auth("root", "root123")

//Creemos otro usuario de root, personal.

db.createUser( {
   user:"adiaz1",
   pwd: passwordPrompt(),   
   roles:[ "readWrite" ]
} )
db.runCommand({connectionStatus : 1})
mongosh --port 27018 -u "almacenUser" -p "a123" --authenticationDatabase "almacen"

db.changeUserPassword("adiaz1","a1234")
db.changeUserPassword("adiaz1",passwordPrompt())
db.getUser("adiaz1")

use almacen
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


db.inventario.findOne()

//Salimos de la base de datos
exit

//Ejecutamos comandos desde el shell de linux sin ingresar al shell de mongo

mongosh mongodb://localhost:27018 --quiet --eval "use almacen" --eval "show collections"

//creamos otro usuario desde el shell de linux
mongosh mongodb://localhost:27018 --quiet --eval "use admin" --eval "db.createUser ( { user: 'adiaz', pwd: 'Dclaros1',roles: [ 'userAdminAnyDatabase' ] } )"
mongosh mongodb://localhost:27018 --quiet --eval "use almacen" --eval "db.inventario.find({},{"item":1,_id:0})"
mongosh mongodb://localhost:27018 --quiet --eval "use admin" --eval "db.getUsers()"

//ingrese al nodo y cierre el servicio


mongosh --port 27018
use admin
db.shutdownServer()
exit
mongosh mongodb://localhost:27018 --quiet --eval "use admin" --eval "db.shutdownServer()"

//Edite un archivo YAML para habilitar la Seguridad
nano mongod.conf
********************************
En el archivo conf YAML
********************************

# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# where to write logging data.

systemLog:
  destination: file
  logAppend: true
  path: nodo1/logs/mongod.log

# Where and how to store data.
storage:
  dbPath: nodo1/data
#  engine:
#  wiredTiger:

# how the process runs
processManagement:
  fork: true
  timeZoneInfo: /usr/share/zoneinfo

# network interfaces
net:
  port: 27018
  bindIp: 127.0.0.1  # Enter 0.0.0.0,:: to bind to all IPv4 and IPv6 addresses or, alternatively, use the net.bindIpAll$

security:
  authorization: "enabled"
#operationProfiling:
#replication:
#sharding:
## Enterprise-Only Options
#auditLog:
#snmp:

*************************************

//Reinicie el servicio
mongod -f mongod.conf
mongo --port 27018
db.auth("root","root123")
show dbs
exit

//Autentiquese como root
//cd seguridad
//mongod --dbpath nodo1/data --logpath nodo1/logs/mongod.log --port 27018 --oplogSize 50 --fork
//Script si el servicio está down

mongosh --port 27018 -u "root" -p "root123" --authenticationDatabase "admin"
mongosh --port 27018 --username root --password root123 --authenticationDatabase admin

use almacen
db.createUser(
   {
     user: "almacenUser",
     pwd: passwordPrompt(),   // Or  "<cleartext password>"
     roles:
       [
         { role: "readWrite", db: "almacen" }
       ]
   }
)

db.createUser( {
   user:"adiaz2",
   pwd: passwordPrompt(),   
   roles:[ "readWrite" ]
} )

db.createUser( {
   user:"adiaz3",
   pwd: passwordPrompt(),   
   roles:[ "readWrite" ]
} )

db.getUsers()

db.dropUser("adiaz3")
db.getUser("adiaz3")

//Borramos un usuario de la db

db.runCommand( {
   dropUser: "adiaz3",
   writeConcern: { w: "majority", wtimeout: 5000 }
} )

db.runCommand( {
   updateUser : "almacenUser",
   customData : { empelado : "AA111" },
   roles : [ { role : "read", db : "almacen" } ]
} )


db.updateUser( "adiaz2",
{
   customData : { empleado : "id1234" },
   roles : [
      { role : "read", db : "almacen"  }
   ]
} )

use admin

db.updateUser("adiaz1",
{
roles:[{role:"userAdmin",db:"almacen"},{role:"dbAdmin",db:"peliculas"}]
}
)

db.createUser(
  { user: "useradmin",
    pwd: "a1234",
    roles: [ { db: "admin", role: "userAdmin" } ]
  }
)


//Autentiquese como root
//cd seguridad
//mongod --dbpath nodo1/data --logpath nodo1/logs/mongod.log --port 27018 --oplogSize 50 --fork
//Script si el servicio está down
/*
******************************************************
Roles incorporados
MongoDB otorga acceso a datos y comandos a través de basado
 en roles autorización y proporciona roles integrados que 
 proporcionan los diferentes niveles de acceso comúnmente 
 necesarios en un sistema de base de datos. Puedes 
 adicionalmente crear roles definidos por el usuario.

Un rol otorga privilegios para realizar conjuntos de 
acciones en definido recursos. A el rol dado se aplica 
a la base de datos en la que está definido y puede otorgar 
acceso hasta un nivel de recolección de granularidad. 

*******************************************************
 */
 
 
db.createUser(
  { user: "dbainv",
    pwd: "a1234",
    roles: [ { db: "almacen", role: "dbAdmin" } ]
  }
)

> db.createUser(
  {
    user: "userInv",
    pwd: "a1234",
    roles: [ { role: "read", db: "almacen" } ]
  }
)

db.createUser(
  {
    user: "userAlm",
    pwd: "a1234",
    roles: [ { role: "read", db: "almacen", collection:"inventaro" } ]
  }
)


db.createUser(
  {
    user: "pruebaInv",
    pwd: "a1234",
    roles: [ { role: "readWrite", db: "almacen" } ]
  }
)

use universidad
db.estudiantes.insertOne({ nombre: "Alfredo", periodo: Int32(2023), carrera: "Ciencia de datos", gpa: Int32(3), ubicacion: { ciudad: "Lima", direccion: "Avenida Javier Prado Este No. 4600Urbanización Fundo Monterrico Chico" } })
db.getUsers()
use almacen
db.grantRolesToUser( "almacenUser",  [ { db: "universidad", role: "dbOwner"  } ] )
 
use universidad
db.getUsers()
use almacen
db.getUser("adiaz2")

//Conceder roles a usuario

db.grantRolesToUser( "adiaz2",  [ { db: "universidad", role: "dbOwner"  } ] )
db.getUser("adiaz2")

//Modificar los roles 
db.updateUser("adiaz2",
{
roles:[{role:"userAdmin",db:"almacen"},
{role:"dbAdmin",db:"almacen"},
{role:"readWrite",db:"almacen"}]
}
)

db.grantRolesToUser( "adiaz2",  [ { db: "universidad", role: "dbOwner"  } ] )

https://www.mongodb.com/docs/manual/reference/built-in-roles/#database-user-roles

db.runCommand( { rolesInfo: { role: "dbOwner", db: "almacen" }, showPrivileges: true} )
db.runCommand( { rolesInfo: { role: "read", db: "universidad" }, showPrivileges: true} )

readWriteAnyDatabase solo en admin
db.runCommand( { rolesInfo: { role: "readWrite", db: "universidad" }, showPrivileges: true} )

******************************************************************************

use almacen

db.createUser(
{user: "adminSeguridad",
 pwd: "a1234",roles: 
 [
 {role:"dbAdmin",db:"almacen"}
 {role: "readAnyDatabase", db: "admin"},
 {role: "backup", db: "admin"},
 {role: "restore", db: "admin"}
 ]
}
)

use universidad
********************************************
Crear un roles
*********************************************
db.createRole( { role: "consultarestudiante", privileges: [ { actions: ["find","update"], resource: { db: "universidad", collection: "estudiantes" } }], roles: [] })
 
********************************
db.getRoles() 
db.getRole("consultarestudiante",{showBuiltinRoles: true  })
db.runCommand(
    {
      rolesInfo: "consultarestudiante"
    }
)
db.createUser(
  {
    user: "userestudiante",
    pwd: "a1234",
    roles: [ { role: "consultarestudiante", db: "universidad", collection:"estudiantes" } ]
  }
)
db.runCommand( { rolesInfo: "consultarestudiante", showBuiltinRoles: true  })

 
***********************************
use almacen
db.createRole( { role: "usuarioAlmacen", privileges: [ { actions: ["find","update"], resource: { db: "almacen", collection: "inventario" } }], roles: [] })

db.updateRole(
"usuarioAlmacen",
{
privileges: [
{
resource: { db: "almacen", collection: "inventario"},
actions: [ "find", "update", "insert" ]
}
],
roles: [ ]
}
)

db.dropRole("usuarioAlmacen")

exit

//Viste la siguiente página para ver los roles.
https://www.mongodb.com/docs/manual/reference/built-in-roles/

/*
*************************
Herramientas de respaldo
************************

Implementaciones los mongodump y mongorestore
*********************************************
utilidades trabajar con BSON volcados de datos, y 
son útil para crear copias de seguridad de 
pequeñas implementaciones. Para resistente y 
copias de seguridad no disruptivas, use un sistema 
de archivos o una instantánea de disco a nivel de 
bloque función, como los métodos descritos en el 
Métodos de respaldo de MongoDB documento.

 
 mongodump \
   --host=mongodb1.example.net \
   --port=3017 \
   --username=user \
   --password="pass" \
   --out=/opt/backup/mongodump-1
*/
cd ~/seguridad
mkdir respaldo
cd respaldo

mongosh --port 27017
use ventas
db.ordenes.insertMany(
   [
   { "_id" : 10, "Producto" : "almendras", "precio" : 12, "cantidad" : 2 },
   { "_id" : 20, "Producto" : "nueces", "precio" : 20, "cantidad" : 1 },
   { "_id" : 30 }
] 
)
exit
mongodump 
mongodump --host localhost --port 27017
tree
   
mongosh --port 27017
use ventas
db.dropDatabase()
exit

mongorestore ./dump --drop
mongosh --port 27017
use ventas
show collections

mongodump --host=localhost --port=27018 --out=./backup/backupAlmacen  --db=almacen --collection=inventario
tree
mongorestore ./backup/backupAlmacen
mongosh --port 27017
use almacen
show collections

mongodump -v --gzip --archive=./backup.gz 



Herramientas de exportación de datos
************************************
mongoexport --host=localhost --port=27017 --out=./exportacion/ordenes.json  --db=almacen --collection=inventario
cd exportacion
cat csvinventario.csv

mongoimport --file=ordendes.json --db=nuevoalmacen --collection=nuevoinventario



mongodump -v --gzip --archive=backup.gz "mongodb+srv://dbaTestAdmin@cluster1.xwgj1.mongodb.net/sample_analytics"

**********************************************************************************
 
