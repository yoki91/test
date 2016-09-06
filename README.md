Se plantea el siguiente problema:
- Se desea implementar una solución para poder interpretar los nombres de los eventos que nos llegan del proveedor de datos. El "input" es una cadena de texto,
en un formato que puede variar dependiendo del deporte, y el "output" es un objeto JSON con cada uno de los elementos que se pueden obtener de la cadena.
- Dicha solución debe ser ampliable fácilmente, para poder aceptar nuevas cadenas en otros formatos para otros deportes.

Se debe poder interpretar la cadena de textos de los siguientes deportes:
Futbol: F.C. Barcelona 3-2 Real Madrid (<teamAName> <teamAScore>-<teamBScore> <teamBName>)
Tenis: Anna Karolina Schmiedlova (1) 1 40-Adv 1 (0) *Varvara Lepchenko (<teamAName> (<teamASets>) <teamAGames> <teamAScore>-<teamBScore> <teamBGames> (<teamBSets>) <isServing><teamBName>)
American Football: Pittsburgh Steelers 3-7 Minnesota Vikings 3rd Quarter (<teamAName> <teamAScore>-<teamBScore> <teamBName> <Period>), period puede ser "[1st|2nd|3rd|4th] Quarter"
 En la GUI debe aparecer un campo de texto y un botón de envío.
El objeto JSON debe mostrarse en pantalla después de realizar el cálculo.
Se debe entregar un proyecto javascript

 Ejemplo:
Input: "F.C. Barcelona 3-2 Real Madrid"
Output: { "teamAName": "F.C. Barcelona", "teamBName": "Real Madrid", "teamAScore": "3", "teamBScore": "2" }
 Input: Anna Karolina Schmiedlova (1) 1 40-Adv 1 (0) *Varvara Lepchenko
Output: { "teamAName": "Anna Karolina Schmiedlova", "teamBName": "Varvara Lepchenko", "teamAScore": "40", "teamBScore": "Adv", "teamAGames": "1", "teamBGames": "1", "teamBServing": true, "scoreboard": { "elements": [ { "title": "Sets", "teamAScore": "1", "teamBScore": "0" } ] } }
 Input: Pittsburgh Steelers 3-7 Minnesota Vikings 3rd Quarter
Output: { "teamAName": "Pittsburgh Steelers", "teamBName": "Minnesota Vikings", "teamAScore": "3", "teamBScore": "7", "currentPeriod": "3rd Quarter” }


Depedencias:

Por favor, aplica el comando "bower install --save" para installar los componentes necesarios o descargar los siguientes componentes manualmente:(creando un directorio bower_components dentro del directorio app)

 -angular
 -angular-loader
 -angular-mocks
 -angular-route
 -bootstrap
 -font-awesome
 -html5-boilerplate
 -jquery
 -tether