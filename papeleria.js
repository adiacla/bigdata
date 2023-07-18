db = connect( 'mongodb://localhost/papeleria' )
db.inventario.drop()
db.inventario.insertMany( [
   { item: "libro", qty:6, precio:NumberDecimal("12.8"),color:["rojo","azul","verde"],tamano:[10,12.1,14.2],
	stock: [ { bodega: "principal", ubicacion:[-77.02824,-12.04318],cantidad: 5 }, { bodega: "sucursal", ubicacion:[-71.535,-16.39889], cantidad: 15 } ],estado:"A", ventas: { "nacional": 14, "internacional": 21, licencia:true }, 
	"fecha" : ISODate("2014-03-01T08:00:00Z"),evaCalidad: [ 10, 9, 10 ], evaLogistica: [ 8, 6, 8 ], 
	localizacion: { type: "Point", coordinates: [-77.02824,-12.04318] }, ciudad:"Lima", 
	detalle:{producto: "libro",codigobar : "978020137962"}
	},
   { item: "cuaderno",qty:10, precio:NumberDecimal("8.3"), color:["blanco","verde","azul"], tamano:[10.3,18,12], 
	stock: [ { bodega: "sucursal", ubicacion:[-71.535,-16.39889],cantidad: 5 } ], estado:"B",
	 "fecha" : ISODate("2014-03-01T09:00:00Z"),evaCalidad: [ 8, 8, 8 ], evaLogistica: [ 7, 7, 7 ], 
	localizacion: { type: "Point", coordinates: [ -75.72861,-14.06777] }, ciudad:"Ica",
	detalle:{producto: "cuaderno",codigobar:"318032117901"}
	},
   { item: "hojas", qty:30,precio:NumberDecimal("6.2"),color:["verde","azul"],tamano:[16,18.4,21],
	stock: [ { bodega: "principal", ubicacion:[-77.02824,-12.04318],cantidad: 60 }, { bodega: "regional", ubicacion:[-79.02998,-8.11599],cantidad: 15 } ],estado:"B", ventas: { "nacional": 5, "internacional": 10, licencia:true },
	"fecha" : ISODate("2014-03-15T09:00:00Z"),evaCalidad: [ 4, 4, 4 ], evaLogistica: [ 4, 4, 4 ], 
	localizacion: { type: "Point", coordinates: [-71.535,-16.39889 ] },ciudad:"Arequipa",
	detalle:{producto: "hojas",codigobar:"318032117901"}
	},
   { item: "escuadra", qty:25,precio:NumberDecimal("3.1"),color:["blanco"],tamano:[21.5,14,6],stock: [ { bodega: "principal", ubicacion:[-77.02824,-12.04318],cantidad: 40 }, { bodega: "regional", ubicacion:[-79.02998,-8.11599],cantidad: 5 } ],estado:"A",ventas: { "nacional": 13, "internacional": 21, licencia:false },
	"fecha" : ISODate("2014-04-04T11:21:39.736Z"),evaCalidad: [ 10, 10, 10 ], evaLogistica: [ 4, 4, 4 ], 
	localizacion: { type: "Point", coordinates: [-79.02998,-8.11599 ]},ciudad:"Callao",
	detalle:{producto: "escuadra",codigobar: "658022512902"}
	},
   { item: "regla", qty:15,precio:NumberDecimal("10.4"),color:["verde","azul"], tamano:[13,14,20.2],
	stock: [ { bodega: "regional",ubicacion:[-79.02998,-8.11599], cantidad: 15 }, { bodega: "sucursal", ubicacion:[-71.535,-16.39889],cantidad: 35 } ],estado:"C", ventas: { "nacional": 12, "internacional": 9, licencia:true }, 
	"fecha" : ISODate("2014-04-04T21:23:13.331Z"),evaCalidad: [ 5, 5, 6 ], evaLogistica: [ 6, 6, 6 ], 
	localizacion: { type: "Point", coordinates: [-79.02998,-8.11599] },ciudad:"Trujillo",
	detalle:{producto: "regla",codigobar : "208020137903"}
	},
   { item: "lapiceros", qty:3,precio:NumberDecimal("15"),color:["amarillo","azul","verde"],
	stock: [ { bodega: "principal", ubicacion:[-77.02824,-12.04318],cantidad: 5 }, { bodega: "sucursal", ubicacion:[-71.535,-16.39889], cantidad: 15 } ],estado:"A",ventas: { "nacional": 25, "internacional": 8, licencia:true },
	"fecha" : ISODate("2015-06-04T05:08:13Z"),evaCalidad: [ 8, 8, 8 ], evaLogistica: [ 8, 8, 8 ], 
	localizacion: { type: "Point", coordinates: [-79.84088,-6.77137] },ciudad:"Chiclayo",
	detalle:{producto: "lapiceros",codigobar : "314021137941"}
	},
   { item: "portalapices",qty:21,precio:NumberDecimal("20"), color:["blanco","amarillo","azul"], tamano:[32,13,10], 
	stock: [ { bodega: "sucursal", ubicacion:[-71.535,-16.39889],cantidad: 5 } ], estado:"B",
	"fecha" : ISODate("2015-09-10T08:43:00Z"),evaCalidad: [ 10, 10, 10 ], evaLogistica: [ 10, 10, 10 ], 
	localizacion: { type: "Point", coordinates: [-73.25383,-3.74912] },ciudad:"Iquitos",
	detalle:{producto: "portalapices",codigobar : "322221137941"}
	},
   { item: "portatil", qty:12,precio:NumberDecimal("14.5"),color:["negro","azul"],tamano:[25,20,66.8],
	stock: [ { bodega: "principal", ubicacion:[-77.02824,-12.04318],cantidad: 60 }, { bodega: "regional", ubicacion:[-79.02998,-8.11599],cantidad: 15 } ],estado:"B",ventas: { "nacional": 8, "internacional": 7, licencia:false },
	"fecha" : ISODate("2016-02-06T20:20:13Z"),evaCalidad: [ 10, 8, 8 ], evaLogistica: [ 4, 4, 4 ], 
	localizacion: { type: "Point", coordinates: [-80.63282,-5.19449] },ciudad:"Piura",
	detalle:{producto: "portatil",codigobar : "978251237939"}
	},
   { item: "impresora", qty:16,precio:NumberDecimal("2.3"),color:["blanco"],tamano:[12.7,14.6,16],
	stock: [ { bodega: "principal", ubicacion:[-77.02824,-12.04318],cantidad: 40 }, { bodega: "regional", ubicacion:[-79.02998,-8.11599],cantidad: 5 } ],estado:"A", ventas: { "nacional": 9, "internacional": 10, licencia:true },
	"fecha" : ISODate("2015-06-04T05:08:13Z"),evaCalidad: [ 6, 8, 8 ], evaLogistica: [ 9, 9, 9 ], 
	localizacion: { type: "Point", coordinates: [-71.96734,-13.52264 ] },ciudad:"Cusco",
	detalle:{producto: "impresora",codigobar : "314021188888"}
	},
   { item: "tarjetas", qty:40,precio:NumberDecimal("4.1"),color:["gris"], tamano:[5.1,7.2,2],
	stock: [ { bodega: "regional",ubicacion:[-79.02998,-8.11599], cantidad: 15 }, { bodega: "sucursal", ubicacion:[-71.535,-16.39889],cantidad: 35 } ],estado:"C", ventas: { "nacional": 7, "internacional": 18, licencia:true },
	"fecha" : ISODate("2015-06-04T05:08:13Z"),evaCalidad: [6, 9, 6 ], evaLogistica: [ 8, 8, 8 ], 
	localizacion: { type: "Point", coordinates: [-74.22321,	-13.15878 ] },ciudad:"Ayacucho",
	detalle:{producto: "tarjetas",codigobar : "818060327925"}
	}
])