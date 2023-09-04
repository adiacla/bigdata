echo Correr una partición

#!/bin/bash
clear
echo
echo *******************************************************************
echo Este script funciona cuando ya se tiene instalado monogodb
echo 
echo *******************************************************************
echo

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Descargando archivos de datos y de configuracion
echo 
echo *******************************************************************
echo

wget https://raw.githubusercontent.com/adiacla/bigdata/master/mongod.conf
sudo cp ./mongod.conf /etc
wait
mkdir dataset
cd ~/dataset
wait
wget https://raw.githubusercontent.com/adiacla/bigdata/master/papeleria.js
mongosh --f ~/dataset/papeleria.js
wget https://raw.githubusercontent.com/adiacla/bigdata/master/cargarcolegios.js
mongosh --f ~/dataset/cargarcolegios.js
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28000.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28001.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28002.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28003.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28004.conf
wget https://raw.githubusercontent.com/adiacla/bigdata/master/config28005.conf
wait

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Creando la llave privada
echo 
echo *******************************************************************
echo

openssl rand -base64 741 > keyfile
chmod 400 keyfile
wait

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Creando las carpetas para nodo0 al nodo4
echo 
echo *******************************************************************
echo

cd ~/
mkdir -r replica
mkdir replica
echo **************************
echo Crea nodo0
echo *************************
mkdir ./replica/nodo0
mkdir ./replica/nodo0/key
mkdir ./replica/nodo0/logs
mkdir ./replica/nodo0/mongo
wait
cp ./keyfile ./replica/nodo0/key

cp -r ~/replica/nodo0 ~/replica/nodo1
cp -r ~/replica/nodo0 ~/replica/nodo2
cp -r ~/replica/nodo0 ~/replica/nodo3
cp -r ~/replica/nodo0 ~/replica/nodo4
wait
cp ~/config28000.conf ~/replica/nodo0/
cp ~/config28001.conf ~/replica/nodo1/
cp ~/config28002.conf ~/replica/nodo2/
cp ~/config28003.conf ~/replica/nodo3/
cp ~/config28004.conf ~/replica/nodo4/
cd ~/replica/nodo0/
wait

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Lanzando o desplegando los servicios de mongod en puertos 28800 al 28004
echo 
echo *******************************************************************
echo
mongosh --port 28000
cd ~/replica/nodo1/
wait
mongosh --port 28001
cd ~/replica/nodo2/
wait
mongosh --port 28002
cd ~/replica/nodo3/
wait
mongosh --port 28003
cd ~/replica/nodo4/
wait
mongosh --port 28004
cd ~/replica
wait

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Verifique que los servicios están lanzados
echo 
echo *******************************************************************
echo

netstat -tulnp

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Inciando el replica set y crando el usuari
echo Usuario adiaz
echo password a1234
echo 
echo *******************************************************************
echo


mongosh --port 28000 --eval 'rs.initiate()' --eval 'db.createUser({user: "adiaz",pwd: "a1234",roles: [{role: "root", db: "admin"}]})'

read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Verifique que el servidor Ec2 tiene los puertos
echo habilitados en el ACL
echo 
echo Vamos a 
echo *******************************************************************
echo

read -rsn1 -p"Digite la Ip del nodo 0 EC2 y el puerto 28000" variable;echo

mongosh --host "mongoRpl/localhost:28000" -u "adiaz" --authenticationDatabase "admin" --eval "rs.add(variable)"

read -rsn1 -p"Digite la Ip del nodo 1 EC2 y el puerto 28001" variable;echo

mongosh --host "mongoRpl/localhost:28000" -u "adiaz" --authenticationDatabase "admin" --eval "rs.add(variable)"

read -rsn1 -p"Digite la Ip del nodo 2 EC2 y el puerto 28002" variable;echo

mongosh --host "mongoRpl/localhost:28000" -u "adiaz" --authenticationDatabase "admin" --eval "rs.add(variable)"

read -rsn1 -p"Digite la Ip del nodo 3 EC2 y el puerto 28003" variable;echo

mongosh --host "mongoRpl/localhost:28000" -u "adiaz" --authenticationDatabase "admin" --eval "rs.add(variable)"

read -rsn1 -p"Digite la Ip del nodo 4 EC2 y el puerto 28004" variable;echo

mongosh --host "mongoRpl/localhost:28000" -u "adiaz" --authenticationDatabase "admin" --eval "rs.add(variable)"

wait
read -rsn1 -p"Oprima cualquier tecla para continuar";echo

echo
echo *******************************************************************
echo Felicitaciones ya tienes una replica funcionando
echo 
echo 
echo 
echo *******************************************************************
echo
exit