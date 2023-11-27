/*
Práctica 2.5: Instalación del Software MongoDB Ops Manager
*/

Descripción general

Para evaluar Ops Manager, puede instalar el Aplicación Ops Manager y Base de datos 
de aplicaciones de Ops Manager en un solo servidor. Esta configuración proporciona toda la funcionalidad de monitoreo y automatización de Ops Manager pero proporciona no conmutación por error o alta disponibilidad.

A diferencia de una instalación de producción, la instalación de prueba simple 
utiliza solo uno mongod para la base de datos de aplicaciones de Ops Manager. 
En producción, la base de datos requiere un dedicado conjunto de réplica.

Este procedimiento incluye instrucciones opcionales para activar la característica de 
Copia de seguridad , en cuyo caso instalaría Almacenamiento de instantáneas (Snapshot) 
en el mismo servidor que los otros componentes de Ops Manager. La base de datos 
de respaldo utiliza solo uno mongod y no un conjunto de réplica dedicado, 
como lo haría en producción.

Este procedimiento instala la implementación de prueba en servidores que ejecutan 
RHEL 6 + o Amazon Linux.

https://www.mongodb.com/subscription/downloads/archived
wget https://downloads.mongodb.com/on-prem-mms/rpm/mongodb-mms-6.0.20.100.20231102T2129Z.x86_64.rpm
 
Para verificar la capacidad necesaria, inicie sesión en la instancia y 
ejecute el siguientes comandos:

-Conocer la version del S.O. Centos
hostnamectl


vmstat -S M -s | grep "total memory"
La salida para el comando muestra que esta instancia tiene 
xx GB de RAM.
7767 M total memory


df -h | grep "/$"
La salida para el comando muestra que esta instancia tiene xx GB 
de capacidad de almacenamiento.
/dev/sda2       128G   15G  113G  12% /



Configurar un RHEL 6 + o Amazon Linux servidor que cumple los siguientes 

1. Requisitos:
a. Memoria de 15 GB y espacio en disco de 50 GB:
El servidor debe tener 15 GB de memoria y 50 GB de espacio en disco para 
La partición raíz. Puede cumplir con los requisitos de tamaño utilizando un
 Amazon Web Services EC2 m3.xlarge instancia y cambiando el tamaño de la 
 partición raíz a 50 GB. Cuando inicias sesión en el instancia, ejecutar para 
 verificar que la partición raíz tenga 50 GB de espacio.
 df -h
 
b. Acceso de raíz:
Debe tener acceso raíz al servidor.



Ops Manager se conecta a su base de datos de aplicaciones en el puerto 27017. 
Si el host en el que desea instalar la base de datos de la aplicación tiene un 
corriendo mongod, deshabilite esa base de datos existente.

sudo netstat -noa|grep mongo
sudo systemctl status mongod
sudo systemctl stop mongod
sudo systemctl disable mongod
sudo systemctl status mongod


Para evaluar Ops Manager, puede instalar el Aplicación Ops Manager y 
Base de datos de aplicaciones de Ops Manager en un solo host. 


3. Directorio de la base de datos de aplicación
Cree el directorio de datos para la Base de Datos de aplicaciones de Ops Manager.
Emita los siguientes dos comandos para crear el directorio de datos y cambiar su propiedad:

mkdir opsmanager
cd opsmanager
sudo mkdir -p /datos/appdb
sudo chown -R mongod:mongod /datos

4.Crear el directorio de copia de seguridad. (Opcional)
Para configurar también la función Copia de seguridad, emita lo siguiente comandos adicionales para la base de datos de respaldo:

sudo mkdir -p /datos/backup
sudo chown mongod:mongod /datos/backup

5. inicie el servicio de mongodb 
sudo -u mongod mongod --port 27017 --dbpath /datos/appdb --logpath /datos/appdb/mongodb.log --wiredTigerCacheSizeGB 1 --fork

Esta configuración proporciona toda la funcionalidad de monitoreo y 
automatización de Ops Manager pero no proporciona failover por error 
o alta disponibilidad.

https://www.mongodb.com/docs/ops-manager/current/_images/ops-manager-test.png
https://www.mongodb.com/docs/ops-manager/v3.6/tutorial/install-simple-test-deployment/

1. Descargue el paquete Ops Manager.

a. Navegar al Centro de descargas de Ops Manager.

De la Plataformas menú desplegable, haga clic en Red Hat + CentOS 6, 7, 8 / 
SUSE 12 + 15 / Amazon Linux.

De la Paquetes menú desplegable, haga clic en RPM.

Haga clic Descargar.

https://www.mongodb.com/try/download/ops-manager
wget https://downloads.mongodb.com/on-prem-mms/rpm/mongodb-mms-6.0.20.100.20231102T2129Z.x86_64.rpm



6. Instalar Ops Manager.

Para instalar el .rpm paquete, invoca el siguiente comando. 
<version> representa la versión de Ops Manager en el .rpm paquete:

cd Downdloads/Software

sudo rpm -ivh mongodb-mms-<version>.x86_64.rpm
sudo rpm -ivh mongodb-mms-6.0.20.100.20231102T2129Z.x86_64.rpm

Este comando crea los siguientes artefactos:

Artefacto									Valor

Directorio base de software de Ops Manager	/opt/mongodb/mms/

Nuevo usuario del sistema que posee los 
procesos de Ops Manager						mongodb-mms

Archivo de configuración de Ops Manager 	/opt/mongodb/mms/conf/conf-mms.properties


No cambie los valores por defecto de conexion a la Database 
locahost:27017

7Inicie Ops Manager.

sudo systemctl start mongodb-mms.service

Opcional
sudo service mongodb-mms start
sudo systemctl start mongodb-mms.service
sudo systemctl status mongodb-mms.service


Comandos útiles para verificar y manejar el Operation Manager desde la línea de comandos.

Verificar los servicios:
Ops-Manager
		# sudo systemctl status mongodb-mms.service
Agente
		# sudo systemctl status mongodb-mms-automation-agent.service
Levantar Servicios:
		# sudo systemctl start mongodb-mms.service
		# sudo systemctl start mongodb-mms-automation-agent.service
Detener Servicios:
		# sudo systemctl stop mongodb-mms.Service
		# sudo systemctl stop mongodb-mms-automation-agent.service



8. Obtenga su nombre de host de instancia.

Si utiliza una instancia de proveedor de servicios en la nube, busque el nombre de
host siguiendo las instrucciones del proveedor relevante:

AWS
Azure
GCP

Si no tiene un nombre de host, use la dirección IP pública. 
Para encontrar tu dirección IP pública de hostel, pegue esto URL en tu 
preferido navegador:

https://www.google.com/search?q=myip

Para nuestro caso solo debemos usar el localhost.

Abra la página de inicio de Ops Manager y registre el primer usuario.
En un navegador, ingrese lo siguiente URL usando el nombre de host. 
Si no tiene un nombre de host, use la dirección IP pública en su lugar:


9. Inicie Ops Manager, con el siguiente comando:
http://localhost:8080


10. Haga clic en el Registrarse enlace.

Siga las instrucciones de la consola para registrar el primer usuario y 
crear la primera organización y proyecto. Ops Manager asigna el Propietario 
Global rol para el primer usuario.

adiaz@xxx.xxx.xxx
Dclaros123!


11. Configurar Ops Manager.

Ops Manager abre el consola de configuración. Ops Manager marca la 
configuración requerida u obligatoria con un asterisco.

Ingrese la información según corresponda. Cuando termine el configuración, 
Ops Manager abre el Despliegue página



Configure su primera implementación.
Haga clic Gerente de Operaciones de MongoDB en la esquina superior 
izquierda de la página para volver a la Despliegue página.

Haga clic Añadir para implementar una instancia MongoDB.


12. Si va a hacer una copia de seguridad de su instancia
Configure las capacidades de copia de seguridad. (Opcional)
Crear un directorio para almacenar el bases de datos principales.

mkdir /datos/backupDaemon

Haga que el directorio sea escribible por el mongodb-mms usuario:

sudo chown mongodb-mms:mongodb-mms /datos/backupDaemon

En Ops Manager, mientras iniciaba sesión como usuario durante el cual se 
registró instalación, haga clic en el Admin enlace en la parte superior 
derecha de la página.

Haga clic en el Copia de seguridad pestaña.

Siga las instrucciones para configurar el almacenamiento de copia de seguridad. 
Ops Manager lo guía a través de la configuración.

Para almacenamiento instantáneo, seleccione el local sistema de archivos o 
la base de datos de respaldo. Si usas un Sistema de Archivos Tienda, todavía necesita una pequeña base de datos MongoDB para oplogar almacenamiento. En el mensaje para configurar el cadena de conexión a la base de datos de respaldo, ingrese lo siguiente:





**********************************************

Implementar un Stand Alone AWS DEMOSTRACION DEL TUTOR

**********************************************

