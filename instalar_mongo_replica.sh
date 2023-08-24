#!/bin/bash
clear
echo *******************************************************************
echo Script para instalar Mongodb Alfredo Díaz en AWS EC2 Amazon Linux 2
echo Antes de instalar verifica la version del S.O.
echo *******************************************************************
grep ^NAME  /etc/*release 
echo Si la versión no es  abstengase de intalar con este script
echo Script para Amazon Linux
sudo yum -y update
cd /etc/yum.repos.d/ 
echo ***************************************
echo **** Instalando tree ******************
echo ***************************************
sudo yum install tree
echo ***************************************
echo **** Mongo ******************
echo ***************************************
sudo wget https://raw.githubusercontent.com/adiacla/bigdata/master/mongodb-org-6.0.repo
cd ~
sudo yum install -y mongodb-org
echo Tipo de comando para activar el servicio de inicio
ps --no-headers -o comm 1
sudo systemctl start mongod
echo Verifique que el servicio está activo
sudo systemctl status mongod
echo ******************************************
echo **** Instalando las colecciones ejemplo **
echo ******************************************
wget https://raw.githubusercontent.com/adiacla/bigdata/master/mongod.conf
sudo cp ./mongod.conf /etc
mkdir dataset
cd ~/dataset
wget https://raw.githubusercontent.com/adiacla/bigdata/master/papeleria.js
mongosh --f ~/dataset/papeleria.js
wget https://raw.githubusercontent.com/adiacla/bigdata/master/cargarcolegios.js
mongosh --f ~/dataset/cargarcolegios.js
cd ~/
mkdir replica
mkdir ./replica/nodo0
mkdir ./replica/nodo0/key
mkdir ./replica/nodo0/log
mkdir ./replica/nodo0/mongo
cp ./mongod.conf ./replica/nodo0/
cp -r ./replica/nodo0 ./replica/nodo1
cp -r ./replica/nodo0 ./replica/nodo2
cp -r ./replica/nodo0 ./replica/nodo3
cp -r ./replica/nodo0 ./replica/nodo4
echo *********************************
ehco ******                       ****
echo finaliza la instalacion
echo *********************************
echo ******                       ****
ps -ef|grep mongo
netstat -tulnp

exit
