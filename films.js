db = connect( 'mongodb://localhost/films' );
db.peliculas.insertMany( [
   {
      "título": 'Titanic',
      "año": 1997,
      "género": [ 'Drama', 'Romance' ]
   },
   {
      "título": 'Spirited Away',
      "año": 2001,
      "género": [ 'Animacion', 'Aventura', 'Familiar' ]
   },
   {
      "título": 'Casablanca',
      "género": [ 'Drama', 'Romance', 'Guerra' ]
   }
] )
