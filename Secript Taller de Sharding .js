****************************************************
Práctica 1.4: Sharding
Material del tutor
****************************************************

//Para la configuración, generaremos instancias de 10 mongos y instancia de 1 mongos(enrutador).
//Primero necesitamos configurar la réplica del servidor de configuración Server. (3 Nodos)
//Conjunto de réplicas shard 01. (3 nodos)
//Conjunto de réplicas shard 02.  (1 solo nodo nodos)
//Conjunto de réplicas de 1 solo nodo. Shard 03 (1 Nodo)
//Router(mongos) con la configuración apuntando a Config Serverars. (1 nodo)
//Agregar Shard 01, Shard 02 y Shard 03 al Cluster a través del router.

/Revisemos la dispobinilidad de memoria en disco y ram

df -h
free -h


mkdir sharding
cd sharding


//configurar la réplica del servidor Darta Base (3 Nodos)
mkdir -p csrs/nodo1/csrs1db csrs/nodo1/logs csrs/nodo2/csrs1db csrs/nodo2/logs csrs/nodo3/csrs1db csrs/nodo3/logs
tree

//configsvr nodo1
mongod --port 27030 --configsvr --replSet rplcsrs --dbpath  csrs/nodo1/csrs1db --logpath  csrs/nodo1/logs/csrs1.log  --oplogSize 50 --fork
// opcion 
//mongod --port 27030 --configsvr --replSet rplcsrs --dbpath  csrs/nodo1/csrs1db --logpath  csrs/nodo1/logs/csrs1.log  --oplogSize 50 --fork

// puede crear un archivo de configuracion. En este ejercicio no vamos a usar keyfile.  se inicia con mongod -f confisvr.conf
/*
#configsrv.conf
sharding:
  clusterRole: configsvr
replication:
  replSetName: rplcsrs
#security:
#  keyFile: /var/mongodb/pki/m103-keyfile
net:
  bindIp: localhost
  port: 27030
systemLog:
  destination: file
  path: /home/netec/csrs/nodo1/logs/csrs1.log
  logAppend: true
processManagement:
  fork: true
storage:
  dbPath: /home/netec/csrs/nodo1/csrs1db
 */
 
 
//configsvr nodo2
mongod --port 27031 --configsvr --replSet rplcsrs --dbpath  csrs/nodo2/csrs1db --logpath  csrs/nodo2/logs/mongod.log  --oplogSize 50 --fork


//configsvr nodo3
mongod --port 27032 --configsvr --replSet rplcsrs --dbpath  csrs/nodo3/csrs1db --logpath  csrs/nodo3/logs/mongod.log  --oplogSize 50 --fork

netstat -ano|grep mongo
df -h
free -h

//Iniciamos primero el replicaset
mongosh --port 27030
rs.initiate( {"_id":"rplcsrs", "configsvr": true,
"members": [ {"_id":0, "host": "localhost:27030" },
{"_id":1, "host": "localhost:27031" },
{"_id":2, "host": "localhost:27032"}
]})


/*Opcional
 use admin
 rs.initiate() 
 rs.add("localhsot:27030") 
 rs.add("localhost:27031")
*/
 rs.conf()
 rs.conf()._id
 rs.conf().members
 rs.conf().members[0]
 rs.isMaster()
 rs.status().members[0]
 

// crear usuario en el Config Server
use admin
db.createUser({
  user: "root",
  pwd: "root123",
  roles: [
    {role: "root", db: "admin"}
  ]
})

show collections
db.system.users.find()
db.auth("root", "root123")

exit
	
/Nota: Recuerda que no tienes habilitada la autenticación: authorization: "enabled" en security
 
	
//Configurar el mongos	
//Router(mongos)
mkdir -p router/nodo1/logs

mongos --configdb rplcsrs/localhost:27030,localhost:27031,localhost:27032 --port 27033 --logpath router/nodo1/logs/router.log --fork

mongosh --port 27033 --username root --password root123 --authenticationDatabase admin
use admin
db.runCommand("connectionStatus")
exit

//Este comando te conecta directo al nodo, pero no al shard
mongosh –27033
db.runCommand("connectionStatus")
exit

//Verificar el estado del sharding
mongosh --port 27033 --username root --password root123 --authenticationDatabase admin
sh.status()
exit



//Configurar los Shards


mkdir -p shard1/nodo1/data shard1/nodo1/logs shard1/nodo2/data shard1/nodo2/logs shard1/nodo3/data shard1/nodo3/logs
mkdir -p shard2/nodo1/data shard2/nodo1/logs 
mkdir -p shard3/nodo1/data shard3/nodo1/logs 
#ls –la
tree


/* ***********************************************

//Shard 1

**************************************************
*/

// Nodo 1 -

mongod --shardsvr --replSet rplshard1 --dbpath  shard1/nodo1/data --logpath  shard1/nodo1/logs/shard1.log  --port 27034 --oplogSize 50 --fork

// nodo 2 -
mongod --shardsvr --replSet rplshard1 --dbpath  shard1/nodo2/data --logpath  shard1/nodo2/logs/shard1.log  --port 27035 --oplogSize 50 --fork


// nodo 3 -
mongod --shardsvr --replSet rplshard1 --dbpath  shard1/nodo3/data --logpath  shard1/nodo3/logs/shard1.log  --port 27036 --oplogSize 50 --fork

netstat -ano|grep mongo

//Iniciar el replicaset del shard 1
mongosh --port 27034
use admin
rs.initiate( {
   _id : "rplshard1",
   members: [
      { _id: 0, host: "localhost:27034" },
      { _id: 1, host: "localhost:27035" },
      { _id: 2, host: "localhost:27036" }
   ]
})

rs.conf()
rs.isMaster()
exit
mongosh mongodb://localhost:27034,localhost:27035,localhost:27036/?replicaSet=rplshard1
exit


/* ***********************************************

//Shard 2

**************************************************
*/

// Nodo 1 -

mongod --shardsvr --replSet rplshard2 --dbpath  shard2/nodo1/data --logpath  shard2/nodo1/logs/shard2.log  --port 27037 --oplogSize 50 --fork

netstat -ano|grep mongo

//Iniciar el replicaset del shard 2
mongosh --port 27037
use admin
rs.initiate( {
   _id : "rplshard2",
   members: [
      { _id: 0, host: "localhost:27037" }
   ]
})
rs.conf()
rs.isMaster()
exit
mongosh mongodb://localhost:27037,localhost:27038,localhost:27039/?replicaSet=rplshard2
exit



/* ***********************************************

//Shard 3

**************************************************
*/

// Nodo 1 -

mongod --shardsvr --replSet rplshard3 --dbpath  shard3/nodo1/data --logpath  shard3/nodo1/logs/shard3.log  --port 27040 --oplogSize 50 --fork

netstat -ano|grep mongo

//Iniciar el replicaset del shard 2
mongosh --port 27040
use admin
rs.initiate( {
   _id : "rplshard3",
   members: [
      { _id: 0, host: "localhost:27040" },
   ]
})
rs.conf()
rs.isMasterster()
exit
mongosh mongodb://localhost:27040/?replicaSet=rplshard3
exit


/*
*********************************************************
 Configurar mongos con los Shards
*********************************************************
*/

df -h
free -h


mongosh --port 27033 --username root --password root123 --authenticationDatabase admin

use admin

/* Nota: No adicionar host standalone (nodos directos)
ejemplo
sh.addShard(“127.0.0.1:27034")
sh.addShard(“127.0.0.1:27035")
sh.status()
*/

sh.addShard( "rplshard1/localhost:27034,localhost:27035,localhost:27036")
sh.addShard( "rplshard2/localhost:27037")
sh.addShard( "rplshard3/localhost:27040")


/*
***************************************************************************
EXPLORAR EL CONFIG Server

***************************************************************************
*/

//Conectese al router
mongosh --port 27033 --username root --password root123 --authenticationDatabase admin

//mongosh mongodb://localhost:27030,localhost:27031,localhost:27032/?replicaSet=rplcsrs

use config
show collections

//Consulta de la base datos
db.mongos.find()
db.shards.find()
db.collections.find()
db.chunks.find()

/*
*************************************************
Cargar una base de datos

***************************************************
*/

 

12. proceso de importar datos de un backup
mkdir dataset
cd dataset


//ssh -o ServerAliveInterval=10 -i "MongoKeyAlfredo.pem" ec2-user@ec2-54-208-52-68.compute-1.amazonaws.com
/*
Nota: Solo para AWS
scp -i "MongoKeyAlfredo.pem" ./products1.json ec2-user@ec2-54-208-52-68.compute-1.amazonaws.com:~/sharding/dataset
scp -i "MongoKeyAlfredo.pem" ec2-user@ec2-54-208-52-68.compute-1.amazonaws.com:~/sharding/dataset/products1.tar.gz ./products1.tar.gz
vmstat -s -S M

/* Si requiere instalar tar
sudo yum list tar
sudo yum update
sudo yum install tar
// comprir
tar -zcvf productos.tar.gz ./products1.json

//descomprimir
tar -xvzf productos.tar.gz
*/

wget https://raw.githubusercontent.com/adiacla/bigdata/master/people.json

wget https://raw.githubusercontent.com/adiacla/bigdata/master/productos.json
head 10 productos.json


//Importar el archivo de copia en json al router

mongoimport --file productos.json --port 27033 -u "root" -p "root123" --authenticationDatabase admin --collection almacen --db empresa
mongoimport --file people.json --port 27033 -u "root" -p "root123" --authenticationDatabase admin --collection empleados --db empresa
/*
df -h
free -h
********************************************************
Verificar si el proceso de importación fué exitoso
Ingresemos al ROuter
*********************************************************
*/

mongosh --port 27033 --username root --password root123 --authenticationDatabase admin

show dbs
use empresa
show collections
db.empleados.findOne()

cls
db.almacen.findOne()
db.almacen.find({},{sku:1})
db.almacen.getIndexes()
db.almacen.count()

db.stats()

/*******************************************************
Verificar en qué shard ser guardó la collección sin shardear
*******************************************************/

//Habilitemos el sharding en los empresa:

sh.enableSharding("empresa")


// Creamos un indice en  sku:

db.almacen.createIndex( { "sku": 1 } )

db.almacen.getIndexes()


// Shardeamos los products en la colección  en el sku:

sh.shardCollection( "empresa.almacen", { "sku": 1 } )

// verifiquemos el status del  sharded cluster:

sh.status()

//Ahora  vamos a modificar los chunks

//Revisemos los chunks en config:

use config
show collections
db.runCommand("getShardMap")
db.adminCommand({ listShards: 1 })


//Veamos un documento de chunks y revisemos el tamaño

db.chunks.findOne()

// Cambiemos el tamaño del chunk size:

use config
db.settings.updateOne(
   { _id: "chunksize" },
   { $set: { _id: "chunksize", value: 2} },
   { upsert: true }
)

//Verifiquemos el status del sharded cluster:

sh.status()

db.almacen.find({"sku" : 27539372})
db.almacen.find({"sku" : 27539372}).explain()

db.almacen.find({"sku" : 31482465}).explain()
exit

//Importamos la segunda parte de la colección almacen de productos1.json en MongoDB (empresa):

wget https://raw.githubusercontent.com/adiacla/bigdata/master/productos1.json

mongoimport --file productos1.json --port 27033 -u "root" -p "root123" --authenticationDatabase admin --collection almacen --db empresa

mongosh --port 27033 --username root --password root123 --authenticationDatabase admin

use empresa
db.almacen.count()

db.almacen.find().sort({sku:-1})
db.runCommand("getShardMap")

//Balancing (No lo ejecutamos solo lo tenemos de referencia)

sh.getBalancerState()
sh.isBalancerRunning()

//sh.startBalancer(timeout, interval)

//sh.stopBalancer(timeout, interval)

Enable/disable the balancer:

sh.setBalancerState(boolean)
sh.getBalancerState()

sh.disableBalancing("empresa.almacen")


