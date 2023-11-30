Crear una colección con validador.
************************************

Vamos a crear la colección estudiantes
y usar el operador $jsonSchema 
para activar la regla de validación:


db.createCollection("estudiantes", {
   validator: {
      $jsonSchema: {
         title: "Validación de estudiantes",
         required: [ "ubicacion.direccion", "ubicacion.ciudad","carrera", "nombre", "periodo" ],
         properties: {
            nombre: {
               bsonType: "string",
               description: "'nombre' debe ser un string y es obligatorio"
            },
            periodo: {
               bsonType: "int",
               minimum: 2015,
               maximum: 2030,
               description: "'El periodo' debe ser un entero en [ 2015, 2030 ] y es obligratorio"
            },
            gpa: {
               bsonType: [ "double" ],
               description: "'gpa' es un un float si existe el dato"
            }
         }
      }
   }
} )
	
Documentar las reglas
Puede utilizar los campos de título y descripción para proporcionar una 
explicación de las reglas de validación cuando las reglas no estén claras 
de inmediato. Cuando un documento no supera la validación, MongoDB incluye 
estos campos en la salida del error.

Confirme que la validación evita documentos no válidos.
*************************************************
La siguiente operación de inserción falla porque gpa es un 
número entero cuando el validador requiere un doble.

db.estudiantes.insertOne( {
   nombre: "Alfredo",
   periodo: Int32( 2023 ),
   carrera: "Ciencia de datos",
   gpa: Int32(3),
   ubicacion: {
      ciudad: "Lima",
      direccion: "Avenida Javier Prado Este No. 4600Urbanización Fundo Monterrico Chico"
   }
} )

La operación devuelve este error.

Inserte un documento válido.
*************************
La inserción se realiza correctamente después de cambiar el campo gpa a doble:

db.estudiantes.insertOne( {
   nombre: "Juan",
   edad:23,
   anyosestudio:5,
   periodo: Int32( 2021 ),
   carrera: "Matematicas",
   gpa: Double(4.0),
   ubicacion:{
   ciudad: "Callao",
   direccion: "Av. Juan Pablo II 306, Bellavista - Callao"
   }
} )


db.runCommand( { collMod: "estudiantes",
   validator: {
     "$and": [
		// Validation with JSON Schema
	{
      $jsonSchema: {
         title: "Validación de estudiantes",
         required: [ "ubicacion.direccion", "ubicacion.ciudad","carrera", "nombre", "periodo" ],
         properties: {
            nombre: {
               bsonType: "string",
               description: "'nombre' debe ser un string y es obligatorio"
            },
            periodo: {
               bsonType: "int",
               minimum: 2015,
               maximum: 2030,
               description: "'El periodo' debe ser un entero en [ 2015, 2030 ] y es obligratorio"
            },
            gpa: {
               bsonType: [ "double" ],
               description: "'gpa' es un un float si existe el dato"
            }
         }
      }
	},
	{
       // Validation with query operators
      "$expr": {
      "$lt": ["$detalle.Estudio", "$detalle.edad"]
         }
       }
      ]
    }
   }
)
******************************




db.estudiantes.insertOne( {
   nombre: "Alfredo",
   edad:20,
   anyosestudio:25,
   periodo: Int32( 2022 ),
   carrera: "Ciencias Computacionales",
   gpa: Double(4.5),
   ubicacion:{
   ciudad: "Lima",
   direccion: "Avenida Javier Prado Este No. 4600 Urbanización Fundo Monterrico Chico"
   }
} )

Dato  correcto

db.estudiantes.insertOne( {
   nombre: "Alfredo",
   edad:20,
   anyosestudio:25,
   periodo: Int32( 2022 ),
   carrera: "Ciencias Computacionales",
   gpa: Double(4.5),
   ubicacion:{
   ciudad: "Lima",
   direccion: "Avenida Javier Prado Este No. 4600 Urbanización Fundo Monterrico Chico"
   }
} )

*******************************************


db.getCollectionInfos( { name: "estudiantes" } )[0].options.validator

db.getCollectionInfos( { name: "estudiantes" } )



db.estudiantes.insertOne( {
   nombre: "Alfredo",
   periodo: Int32( 2023 ),
   carrera: "Ciencia de datos",
   gpa: Int32(3),
   ubicacion: {
      ciudad: "Lima",
      direccion: "Avenida Javier Prado Este No. 4600Urbanización Fundo Monterrico Chico"
   }
} )

db.estudiantes.insertOne( {
   nombre: "Juan",
   periodo: Int32( 2021 ),
   carrera: "Matematicas",
   gpa: Double(4.0),
   ubicacion:{
   ciudad: "Callao",
   direccion: "Av. Juan Pablo II 306, Bellavista - Callao"
   },
   coordinate:[,]
} )

db.estudiantes.insertOne( {
   nombre: "Alfredo",
   periodo: Int32( 2023 ),
   carrera: "Ciencia de datos",
   gpa: Double(3),
   ubicacion: {
      ciudad: "Lima",
      direccion: "Avenida Javier Prado Este No. 4600Urbanización Fundo Monterrico Chico"
   }
} )

Ejercicio modificando el validador en inventario

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
 { "item": "tarjetas", "qty":40,"precio":NumberDecimal("4.1"),"color":["gris"], "tamano":[5.1,7.2,2],"stock": [ { "bodega": "regional","ubicacion":[-79.02998,-8.11599], "cantidad": 15 }, { "bodega": "sucursal", "ubicacion":[-71.535,-16.39889],"cantidad": 35 } ],"estado":"C", "ventas": { "nacional": 7, "internacional": 18, "licencia":true },"fecha" : ISODate("2015-06-04T05:08:13Z"),"evaCalidad": [6, 9, 6 ], "evaLogistica": [ 8, 8, 8 ], "localizacion": { "type": "Point", "coordinates": [-74.22321,-13.15878 ] },"ciudad":"Ayacucho","detalle":{"producto": "tarjetas","codigobar" : "818060327925"}}]);



db.runCommand( { collMod: "inventario",
   validator: {
      $jsonSchema: {
         title: "Validación de venta de productos",
         required: [ "item", "qty","precio"],
         properties: {
            nombre: {
               bsonType: "string",
               description: "'nombre' debe ser un string y es obligatorio"
            },
            qty: {
               bsonType: "int",
               minimum: 0,
               maximum: 2000,
               description: "'LA Cantidad' debe ser un entero entre [ 0, 2000 ] y es obligratorio"
            },
            precio: {
               bsonType: [ "Decimal128" ],
               description: "'precio' es un un float obligatorio"
            },
			ciudad: {
               bsonType: [ "string" ],
               description: "'ciudad' es un un string si existe el dato"
            }	
         }
      }
   }
} )


db.inventario.insertOne({
	producto: "Papel impresora",
	qty:12,
	precio: Int32( 2 ),
	ciudad:"Lima"
	}
)

db.inventario.insertOne({
	producto: "Papel impresora",
	qty:12,
	precio: 2.2,
	ciudad:"Lima"
	}
)

db.inventario.insertOne({
	item: "Papel impresora",
	qty:12,
	precio: 2.2,
	ciudad:"Lima"
	}
)

Especificar valores de campo permitidos
******************************************


Cuando crea un esquema JSON, puede
especificar qué valores están permitidos en un
campo particular. Utilice esta funcionalidad
para garantizar que los valores de sus campos pertenezcan a
un conjunto esperado de valores, como una lista
de países. Del mismo modo, puedes utilizar este
funcionalidad para evitar errores humanos,
como errores tipográficos, al insertar datos en un
recopilación.

Cree una colección con validación que contenga enum.

Cree una colección de envío y use el operador $jsonSchema para establecer reglas de validación de esquema:

db.createCollection("sedes", {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         title: "Validación ciudad universidad",
         properties: {
            ciudad: {
               enum: ["Arequipa","Callao","Lima","Pisco","Iquitos" ],
               description: "Debe ser una ciudad de Perú"
            }
         }
      }
   }
} )

db.sedes.insertOne({nombre:"Universidad de Lima", country:"Lima"})


Cuando especifica propiedades adicionales: falso en
su esquema JSON, MongoDB rechaza documentos
que contienen campos no incluidos en su
objeto de propiedades del esquema.

Campos nulo
****************

db.createCollection("almacen",
   {
      validator:
         {
            "$jsonSchema": {
               "properties": {
                  "ubicación": { "bsonType": [ "null", "string" ] }
               }
            }
         }
    }
 )
 
db.almacen.insertOne( { ubicacion: null } )

db.runCommand({ collMod:"almacen", 
  validator: {
  "$jsonSchema": {
    "required": [ "_id", "ubicación" ],
    "properties": {
      "ubicación": { "bsonType": "string" }
    },
    "additionalProperties": true
  }
}})

db.almacen.insertOne( { "ubicación": "Calle 2" } )

db.almacen.insertOne( { "_id":1, ubicación: "Calle 2" } )


db.runCommand({ collMod: "almacen", 
	validator: { 
		"$jsonSchema": {
		"required": ["_id", "ubicación"], 
		"properties": {
			"_id": { "bsonType": "int" }, 
			"ubicación": { "bsonType": "string" } 
			}, 
		"additionalProperties": false 
		} 
		} 
		}
)

db.almacen.insertOne( { "_id":1, ubicación: "Calle 2" } )
db.almacen.insertOne( { ubicación: "Calle 3" } )
db.almacen.insertOne( { "_id":2, datos:"nuevos"} )
db.almacen.insertOne( { "_id":2, datos:"nuevos"} )


Especificar validación con operadores de consulta
*************************************************
	  
db.facturacion.insertOne( {
   total: NumberDecimal("141"),
   IGV: NumberDecimal("0.20"),
   TotalConIGV: NumberDecimal("169")
} )

db.getCollectionInfos( { name: "facturacion" } )[0].options.validator

db.runCommand({ collMod: "facturacion", 
	validator: { 
         $expr:
            {
               $eq: [
                  "$TotalConIGV",
                  { $multiply: [ "$total", { $sum:[ 1, "$IGV" ] } ] }
               ]
            }
      }
   }
)

 db.facturacion.insertOne({ total: NumberDecimal("141"), IGV: NumberDecimal("0.20"), TotalConIGV: NumberDecimal("169.2") })
 db.facturacion.insertOne({ total: 142, IGV: 0.21, TotalConIGV:169.2 })
 db.facturacion.insertOne({ total: 142, IGV: 0.21, TotalConIGV:29.82 })
 db.facturacion.insertOne({ total: 142.0, IGV: 0.21, TotalConIGV:171.82 })
 
 
Consulta y modificación de documentos válidos o no válidos
*************************************************

https://www.mongodb.com/docs/v4.4/reference/bson-types/#:~:text=BSON%20has%20a%20special%20timestamp,seconds%20since%20the%20Unix%20epoch)

db.runCommand( { collMod: "inventario",
   validator: {
      $jsonSchema: {
         title: "Validación de venta de productos",
         required: [ "item", "qty","precio"],
         properties: {
            nombre: {
               bsonType: "string",
               description: "'nombre' debe ser un string y es obligatorio"
            },
            qty: {
               bsonType: "int",
               minimum: 0,
               maximum: 2000,
               description: "'LA Cantidad' debe ser un entero entre [ 0, 2000 ] y es obligratorio"
            },
            precio: {
               bsonType: [ "Decimal128" ],
               description: "'precio' es un un float obligatorio"
            },
			ciudad: {
               bsonType: [ "string" ],
               description: "'ciudad' es un un string si existe el dato"
            }	
         }
      }
   }
} )


#Conocer de los datos guardados cuáles no cumplem
con el esquema. 
 
 
 
let esquema = let esquema = db.getCollectionInfos( { name: "inventario" } )[0].options.validator

db.facturacion.find(esquema)

db.facturacion.find( { $nor: [ esquema ] } )



