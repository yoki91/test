/**
 * Created by yifei on 1/09/16.
 */
//Construirmos el modelo de dato para cada deporte.  Según requerimiento del cliente: Fútbol, Tenis, Fútbol americano.

var app = angular.module('testApp',[]);
app.controller('ControladorJuego',['$scope','$log',function ($scope,$log) {
    $scope.calcular = function ()
    {
        var Infodeporte = $scope.input;

        var encontrado =false;




        var mensajeError = "Ops, parece que el formato de la entrada no es correcto! Por favor siga uno de los siguientes formatos:\n\n" +
            "Fútbol: teamAName teamAScore - teamBScore teamBName\n\n" +
            "Tenis: teamAName (teamASets) teamAGames teamAScore - teamBScore teamBGames (teamBSets) isServing teamBName\n\n" +
            "Fútbol Americano: teamAName teamAScore - teamBScore teamBName Period";

        var mensajeErrorFubolA = "Ops, parece que el formato de la entrada para el Fútbol Americano no es correcto! por favor siga el siguiente formato:\n\n" +
            "Fútbol Americano: teamAName teamAScore - teamBScore teamBName Period";

        var mensajeErrorCurrentPeriod = "Ops, parece que el formato del periodo no es correcto! Por favor siga uno de los siguiente formatos:\n\n" +
            "1st,2nd,3rd,4th";


        var mensajeErrorTenis= "Ops, parece que el formato de la entrada para el Tenis no es correcto! por favor siga el siguiente formato:\n\n" +
            "Tenis: teamAName (teamASets) teamAGames teamAScore - teamBScore teamBGames (teamBSets) isServing teamBName\n\n" +
            "Nota: teamScore sería uno de los siguientes valores: 00,15,30,40,Adv\n\n"+
            "Nota: isServing se marca con una * y siempre va delante del nombre del jugador"


        var mensajeErrorFutbol ="Ops, parece que el formato de la entrada para el Fútbol no es correcto! por favor siga el siguiente formato:\n\n" +
            "Fútbol: teamAName teamAScore - teamBScore teamBName\n\n";

        //buscamos si el Infodeporte contiene -
        var buscar = new RegExp("-");

        var resultado = buscar.test(Infodeporte);

        if(!resultado)
        {
            alert(mensajeError);
            $scope.input='';
        }



        else
        {
            var data = Infodeporte.split('-');
            $log.debug(data);

            //Si el numero de elementos del array es más que 2, el usuario ha puesto más de 1 '-'
            if(data.length !=2)
            {
            	alert(mensajeError);
            	return;
            }
            

            //primero intentamos averiguar cual de los tres juegos corresponde
            //intentamos buscar la palabra clave Quarter, si existe se tratra del fútbol americano

             buscar = /Quarter/i;

            //importante buscarlo en data[1]
            var esFutbolAmericano = buscar.test(data[1])

            if(esFutbolAmericano && encontrado==false)
            {
                //procesamos el caso del fútbol americano
                var teamAScore_error = false;
                var teamAScore_patt = /[0-9]/g;
                while(teamAScore_patt.test(data[0]) == true)
                {
                    //buscamos la posición después del numero
                    var teamAScore_index = teamAScore_patt.lastIndex;

                    //verifica si una posición antes del numero es una letra, si una posición después del num es una letra.
                    // si la última lectura nos devuelve undefined(porque lastIndex es una posición despúes..), ha leido solo numeros en la cadena.
                    if(isNaN(data[0][teamAScore_index-2])  || (isNaN(data[0][teamAScore_index]) && data[0][teamAScore_index] != undefined ))
                    {
                        teamAScore_error=true;
                        break;
                    }
                }

                if(teamAScore_error)
                {
                    alert(mensajeErrorFubolA);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }




                var currentPeriod = data[1].slice(data[1].indexOf("Quarter")-4,data[1].indexOf("Quarter")-1);
                $log.debug(currentPeriod);
                if(currentPeriod != "1st" && currentPeriod != "2nd" && currentPeriod != "3rd" && currentPeriod != "4th")
                {
                    alert(mensajeErrorCurrentPeriod);
                    $scope.input='';
                    $scope.resultado='';
                    return;

                }

                var data1_copy = data[1];
                var temp = data1_copy.replace(currentPeriod,'');
                var teamBScore_error = false;
                var teamBScore_patt = /[0-9]/g;
                while(teamBScore_patt.test(temp) == true)
                {

                    var teamBScore_index = teamBScore_patt.lastIndex;
                    var valueB = data[1][teamBScore_index];

                    if( (data[1][teamBScore_index-2] != undefined) &&  (isNaN(data[1][teamBScore_index-2]) || (isNaN(data[1][teamBScore_index]) &&  data[1][teamBScore_index] != " ")))
                    {
                        teamBScore_error=true;
                        break;
                    }

                }

                if(teamBScore_error)
                {
                    alert(mensajeErrorFubolA);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }
                    //si no ha lanzado ningun error, recogemos el valor del score
                    var teamAScore = data[0].replace(/[^0-9]/g,'');
                
                        data1_copy = data[1];
                        temp = data1_copy.replace(currentPeriod,'');
                    var teamBScore = temp.replace(/[^0-9]/g,'');



                    var teamAName = data[0].slice(0,teamAScore_index-1);
                    $log.debug(teamAName);
                    var teamBName_index = data[1].indexOf("Quarter")-5;

                    var teamBName = data[1].slice(2,teamBName_index);
                    $log.debug(teamBName);


                        //formamos el JSON final del Futbol americano
                        $scope.resultado=
                        {
                            teamAName: teamAName,
                            teamBName: teamBName,
                            teamAScore: teamAScore,
                            teamBScore: teamBScore,
                            currentPeriod: currentPeriod
                        }
                        $log.debug($scope.resultado);
                        encontrado=true;


            }

            var esTenis = data[0].indexOf("(");
            if(esTenis > 0 && encontrado==false)
            {
                //procesamos el caso del tenis
                var teamAScore_index = data[0].length-1;
                var teamAScore = data[0][teamAScore_index];

                //si teamAScore ='Adv', leer 3 caracteres
                if(isNaN(teamAScore))
                {
                    teamAScore = data[0].slice(teamAScore_index-2,teamAScore_index+1);
                }
                else
                {
                    teamAScore = data[0].slice(teamAScore_index-1,teamAScore_index+1);
                }
                 
                //si teamBScore ='Adv', leer 3 caracteres
                var teamBScore = data[1][0];
                if(isNaN(teamBScore))
                {
                    var teamBScore = data[1].slice(0,3);
                }
                else
                {
                    var teamBScore = data[1].slice(0,2);
                }


                if(isNaN(teamAScore) || isNaN(teamBScore))
                {
                    if(teamAScore != "Adv" && teamBScore != "Adv")
                    {
                        alert(mensajeErrorTenis);
                        $scope.input='';
                        $scope.resultado='';
                        return;
                    }
                    

                }



                var Set_teamAScore_index= data[0].indexOf("(");

                var Set_teamAScore = data[0][Set_teamAScore_index+1];

                var Set_teamBScore_index = data[1].indexOf("(");

                var Set_teamBScore=data[1][Set_teamBScore_index+1];


                if(isNaN(Set_teamAScore) || isNaN(Set_teamBScore))
                {
                    alert(mensajeErrorTenis);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }


                if(data[0][Set_teamAScore_index+2] !=")" || data[1][Set_teamBScore_index+2] !=")")
                {
                	alert(mensajeErrorTenis);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }


                var teamAGames = data[0].slice(Set_teamAScore_index+3,Set_teamAScore_index+5);

                var teamBGames = data[1].slice(Set_teamBScore_index-3,Set_teamBScore_index-1);


                if(isNaN(teamAGames) || isNaN(teamBGames))
                {
                    alert(mensajeErrorTenis);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }


                var teamAName = data[0].slice(0,Set_teamAScore_index-1);
                var teamBName = data[1].slice(Set_teamBScore_index+4,data[1].length);



                //si la * no está, lanza el error
                if(teamAName.indexOf('*')<0 && teamBName.indexOf('*')<0)
                {

                	    alert(mensajeErrorTenis);
                        $scope.input='';
                        $scope.resultado='';
                        return;
                }

                 //si hay * para los dos jugadores, lanza el error
                 if(teamAName.indexOf('*') >=0 && teamBName.indexOf('*') >=0)
                {

                	    alert(mensajeErrorTenis);
                        $scope.input='';
                        $scope.resultado='';
                        return;
                }

                //si la * no está la primera posicion del nombre, lanza error
                if(teamAName.indexOf('*') != 0 && teamBName.indexOf('*') != 0)
                {
                		alert(mensajeErrorTenis);
                        $scope.input='';
                        $scope.resultado='';
                        return;
                }

                if(teamBName.indexOf('*')==0)
                {
                    var teamBServing = true;
                    teamBName = data[1].slice(Set_teamBScore_index+5,data[1].length);
                }
                else
                {
                    teamBServing=false;
                    teamBName = data[1].slice(Set_teamBScore_index+4,data[1].length);
                    
                }

                if(teamBServing)
                {
                	teamAName = data[0].slice(0,Set_teamAScore_index-1);
                }
                else
                {
                	teamAName = data[0].slice(1,Set_teamAScore_index-1);
                }


                $scope.resultado=
                {
                    teamAName: teamAName,
                    teamBName: teamBName,
                    teamAScore: teamAScore,
                    teamBScore: teamBScore,
                    teamAGames: teamAGames,
                    teamBGames: teamBGames,
                    teamBServing:teamBServing,
                    scoreboard:{
                        elements:[{
                            title: "Sets",
                            teamAScore: Set_teamAScore,
                            teamBScore: Set_teamBScore
                        }]
                    }}
                encontrado=true;
            }


            if(!esFutbolAmericano && encontrado == false)
            {
                //procesamos el caso del fútbol
                var teamAScore_error = false;
                var teamAScore_patt = /[0-9]/g;
                while(teamAScore_patt.test(data[0]) == true)
                {
                    //buscamos la posición después del numero
                    var teamAScore_index = teamAScore_patt.lastIndex;

                    //verifica si una posición antes del numero es una letra, si una posición después del num es una letra.
                    // si la última lectura nos devuelve undefined(porque lastIndex es una posición despúes..), ha leido solo numeros en la cadena.
                    if(isNaN(data[0][teamAScore_index-2])  || (isNaN(data[0][teamAScore_index]) && data[0][teamAScore_index] != undefined ))
                    {
                        teamAScore_error=true;
                        break;
                    }
                }



                if(teamAScore_error)
                {
                    alert(mensajeErrorFutbol);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }

                var teamBScore_error = false;
                var teamBScore_patt = /[0-9]/g;
                while(teamBScore_patt.test(data[1]) == true)
                {

                    var teamBScore_index = teamBScore_patt.lastIndex;
                    var valueB = data[1][teamBScore_index];

                    if( (data[1][teamBScore_index-2] != undefined) &&  (isNaN(data[1][teamBScore_index-2]) || (isNaN(data[1][teamBScore_index]) &&  data[1][teamBScore_index] != " ")))
                    {
                        teamBScore_error=true;
                        break;
                    }
                }
                if(teamBScore_error)
                {
                    alert(mensajeErrorFutbol);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }





               //si no ha lanzado ningun error, recogemos el valor del score
                var teamAScore = data[0].replace(/[^0-9]/g,'');
                var teamBScore = data[1].replace(/[^0-9]/g,'');


                var teamAName = data[0].slice(0,data[0].indexOf(teamAScore)-1);
                var teamBName = data[1].slice(teamBScore.length+1,data[1].length);

                
                //si el equipo contiene numeros, lanza un error
                var teamAName_error = /\d/.test(teamAName);

                var teamBName_error = /\d/.test(teamBName);

                if( teamAName_error || teamBName_error)
                {
                	alert(mensajeErrorFutbol);
                    $scope.input='';
                    $scope.resultado='';
                    return;
                }

                $scope.resultado={
                    teamAName: teamAName,
                    teamBName: teamBName,
                    teamAScore: teamAScore,
                    teamBScore: teamBScore

                }
                encontrado=true;
            }

        }//end else

    }


}])

