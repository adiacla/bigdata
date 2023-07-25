#!/bin/bash
echo Script para instalar Mongodb
echo Instalación verifica la version
grep ^NAME  /etc/*release
echo Script para Amazon Linux
cd /etc/yum.repos.d/
wget https://raw.githubusercontent.com/adiacla/bigdata/master/mongodb-org-6.0.repo
cd ~
sudo yum install -y mongodb-org
echo Tipo de comando para activar el servicio de inicio
ps --no-headers -o comm 1
sudo systemctl start mongod
echo Verifique que el servicio está activo
sudo systemctl status mongod
