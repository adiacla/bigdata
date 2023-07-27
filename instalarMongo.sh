#!/bin/bash
echo Script para instalar Mongodb Alfredo Díaz en AWS EC2 Amazon Linux 2
echo Antes de instalar verifica la version del S.O.
grep ^NAME  /etc/*release 
echo Si la versión no es  abstengase de intalar con este script
echo Script para Amazon Linux
cd /etc/yum.repos.d/ 
sudo wget https://raw.githubusercontent.com/adiacla/bigdata/master/mongodb-org-6.0.repo
cd ~
sudo yum install -y mongodb-org
echo Tipo de comando para activar el servicio de inicio
ps --no-headers -o comm 1
sudo systemctl start mongod
echo Verifique que el servicio está activo
sudo systemctl status mongod
wget https://raw.githubusercontent.com/adiacla/bigdata/master/mongod.conf
sudo cp ./mongod.conf /etc
mkdir dataset
cd ./dataset
wget https://raw.githubusercontent.com/adiacla/bigdata/master/papeleria.js
mongosh --f ~/dataset/papeleria.js
echo finalizar la instalacion
exit
