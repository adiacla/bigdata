#!/bin/bash
echo *******************************************************************
echo Este script funciona cuando ya se tiene instalado monogodb
echo *******************************************************************
echo *******************************************************************
echo Descargando archivos de datos y de configuracion
echo *******************************************************************
mkdir  dataset
cd ./dataset
wget https://raw.githubusercontent.com/adiacla/bigdata/master/papeleria.js
wget https://raw.githubusercontent.com/adiacla/bigdata/master/cargarcolegios.js
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28000.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28001.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28002.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28003.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28004.conf
echo *******************************************************************
echo Creando la llave privada
echo *******************************************************************
openssl rand -base64 741 > keyfile
chmod 400 keyfile
echo *******************************************************************
echo Creando las carpetas para nodo0 al nodo4
echo *******************************************************************
cd ~/
mkdir ./replica
echo **************************
echo Crea nodo0
echo *************************
mkdir ~/replica/nodo0
mkdir ~/replica/nodo0/key
mkdir ~/replica/nodo0/logs
mkdir ~/replica/nodo0/mongo
cp ~/dataset/keyfile ./replica/nodo0/key/
cp -r ~/replica/nodo0 ~/replica/nodo1
cp -r ~/replica/nodo0 ~/replica/nodo2
cp -r ~/replica/nodo0 ~/replica/nodo3
cp -r ~/replica/nodo0 ~/replica/nodo4
cp ~/dataset/config28000.conf ~/replica/nodo0/
cp ~/dataset/config28001.conf ~/replica/nodo1/
cp ~/dataset/config28002.conf ~/replica/nodo2/
cp ~/dataset/config28003.conf ~/replica/nodo3/
cp ~/dataset/config28004.conf ~/replica/nodo4/
cd ~/replica/nodo0/
echo *******************************************************************
echo Lanzando o desplegando los servicios de mongod en puertos 28800 al 28004
echo *******************************************************************
mongosh --port 28000
cd ~/replica/nodo1/
mongosh --port 28001
cd ~/replica/nodo2/
mongosh --port 28002
cd ~/replica/nodo3/
mongosh --port 28003
cd ~/replica/nodo4/
mongosh --port 28004
cd ~/replica
echo *******************************************************************
echo Verifique que los servicios están lanzados
echo *******************************************************************
netstat -tulnp
echo *******************************************************************
echo Inciando el replica set y crando el usuari
echo Usuario adiaz
echo password a1234
echo *******************************************************************
mongosh --port 28000 --eval 'rs.initiate()' --eval 'db.createUser({user: "adiaz",pwd: "a1234",roles: [{role: "root", db: "admin"}]})'
echo *******************************************************************
echo Verifique que el servidor Ec2 tiene los puertos
echo habilitados en el ACL
echo *******************************************************************
echo *******************************************************************
echo Felicitaciones ya tienes una replica funcionando
echo *******************************************************************
exit
