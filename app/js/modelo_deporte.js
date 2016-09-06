/**
 * Created by yifei on 1/09/16.
 */
//Construirmos el modelo de dato para cada deporte.  Según requerimiento del cliente: Fútbol, Tenis, Fútbol americano.

var app = angular.module('testApp',[]);
app.controller('ControladorJuego',['$scope','$log',function ($scope,$log) {
    $scope.calcular = function () {
        //recoger la entrada con el scope
        var Infodeporte = $scope.input;

        //procesamos la entrada,verifica si tiene un formato correcto o no.
        verificarFormato(Infodeporte);
    }

    //procesamos la entrada,verifica si tiene un formato correcto o no.
    function verificarFormato(Infodeporte) {

        var formatoFutbol = /^(.+?) (\d+)-(\d+) (.+?)$/;

        var formatoTenis = /^(.+?) (\W)(\d+)(\W) (\d+) (.{2,})-(.{2,}) (\W)(\d+)(\W) (.+?)$/;

        var formatoFutbolAmericano = /^(.+?) (\d+)-(\d+) (.+) (.+(?= Quarter)) (Quarter)$/;

        if (formatoFutbolAmericano.test(Infodeporte)) {
            //procesamos el dato como fútbolAmericano
            var esCorrecto = false;
            esCorrecto = salidaFutbolAm(Infodeporte);

            if (esCorrecto)
                return;
            else {
                errorAlert("mensajeErrorFubolA");
                $scope.input = '';
                $scope.resultado = '';
                return;
            }
        }
        if (formatoFutbol.test(Infodeporte)) {
            //procesamos el dato como fútbol
            var esCorrecto = false;
            esCorrecto = salidaFutbol(Infodeporte);

            if (esCorrecto)
                return;
            else {
                errorAlert("mensajeErrorFutbol");
                $scope.input = '';
                $scope.resultado = '';
                return;
            }

        }
        if (formatoTenis.test(Infodeporte)) {
            //procesamos el dato como tenis
            var esCorrecto = false;
            esCorrecto = salidoTenis(Infodeporte);
            if (esCorrecto)
                return;
            else {
                errorAlert("mensajeErrorTenis");
                $scope.input = '';
                $scope.resultado = '';
                return;
            }

        }

        errorAlert("mensajeError");
        $scope.input = '';
        $scope.resultado = '';
        return;

    }//fin verificarFormato


    function salidaFutbol(Infodeporte) {

        var datos = separarDatos(Infodeporte);
        //asignamos valores a cada equipo;
        var puntoEquipo = recuperarPuntoEquipo(datos);
        var puntoEquipoA = puntoEquipo[0][0];
        var puntoEquipoB = puntoEquipo[1][0];

        var nombreEquipo = recuperarNombreEquipo(datos, puntoEquipoA);
        var nombreEquipoA = nombreEquipo[0];
        var nombreEquipoB = nombreEquipo[1];
        $scope.resultado = {
            teamAName: nombreEquipoA,
            teamBName: nombreEquipoB,
            teamAScore: puntoEquipoA,
            teamBScore: puntoEquipoB
        }

        return true;
    }

    function salidaFutbolAm(Infodeporte) {
        var datos = separarDatos(Infodeporte);
        //recuperamos primero el periodo
        var periodo = datos[1].slice(datos[1].indexOf("Quarter") - 4, datos[1].indexOf("Quarter") - 1);
        if (periodo != "1st" && periodo != "2nd" && periodo != "3rd" && periodo != "4th") {
            return false;
        }
        //quitamos el periodo para que la entrada como futbol
        datos[1] = datos[1].replace(periodo + " Quarter", '');
        var puntoEquipo = recuperarPuntoEquipo(datos);
        var puntoEquipoA = puntoEquipo[0][0];
        var puntoEquipoB = puntoEquipo[1][0];

        var nombreEquipo = recuperarNombreEquipo(datos, puntoEquipoA);
        var nombreEquipoA = nombreEquipo[0];
        var nombreEquipoB = nombreEquipo[1];

        $scope.resultado = {
            teamAName: nombreEquipoA,
            teamBName: nombreEquipoB,
            teamAScore: puntoEquipoA,
            teamBScore: puntoEquipoB,
            currentPeriod: periodo
        }

        return true;
    }

    function salidoTenis(Infodeporte) {
        var temp;
        var datos = separarDatos(Infodeporte);
        var puntoEquipo = recuperarPuntoEquipo(datos);
        if (puntoEquipo[0].constructor === Array) {
            var puntoEquipoA = puntoEquipo[0][0];
            var puntoEquipoB = puntoEquipo[1];
        }
        else {
            var puntoEquipoA = puntoEquipo[0];
            var puntoEquipoB = puntoEquipo[1][0];
        }
        if ((puntoEquipoA != "00" && puntoEquipoA != "15" && puntoEquipoA != "30" && puntoEquipoA != "40") || puntoEquipoA == "null") {
            var pattEquipoA = /\w+$/g;
            temp = pattEquipoA.exec(datos[0]);
            if (temp[0] != "Adv")
                return false;
            else
               puntoEquipoA = temp[0];
        }
        if ((puntoEquipoB != "00" && puntoEquipoB != "15" && puntoEquipoB != "30" && puntoEquipoB != "40") || puntoEquipoB == "null") {
            var pattEquipoB = /^\w+/g;
            temp = pattEquipoB.exec(datos[1]);
            if (temp[0] != "Adv")
                return false;
            else
                puntoEquipoB = temp[0];
        }
        var setPunto = recuperarSetEquipo(datos);
        var setPuntoA = setPunto[0][1];
        var setPuntoB = setPunto[1][1];

        var nombreEquipoA = datos[0].slice(0,datos[0].indexOf("(")-1);
        var nombreEquipoB = datos[1].slice(datos[1].indexOf(")")+2,datos[1].length);

        var EquipoBServing = esEquipoBserving(nombreEquipoA,nombreEquipoB);
        if(EquipoBServing =="error")
            return false;
        if (EquipoBServing == true)
            nombreEquipoB = nombreEquipoB.replace("*"," ");
        if(EquipoBServing ==false)
            nombreEquipoA = nombreEquipoA.replace("*"," ");

        var partidoEquipoA = datos[0].slice(datos[0].indexOf(")")+1,datos[0].indexOf(puntoEquipoA));
        var partidoEquipoB = datos[1].slice(puntoEquipoB.length,datos[1].indexOf("(")-1);


        $scope.resultado=
        {
            teamAName: nombreEquipoA,
            teamBName: nombreEquipoB,
            teamAScore: puntoEquipoA,
            teamBScore: puntoEquipoB,
            teamAGames: partidoEquipoA,
            teamBGames: partidoEquipoB,
            teamBServing:EquipoBServing,
            scoreboard:{
                elements:[{
                    title: "Sets",
                    teamAScore: setPuntoA,
                    teamBScore: setPuntoB
                }]
            }}
        return true;
    }
    function separarDatos(Infodeporte) {
        // separamos los datos de cada equipo para cada juego...
        var resultado = Infodeporte.split("-");
        return resultado;
    }
    function recuperarNombreEquipo(datos,puntoEquipoA) {
        var index = 0;
        var nombreEquipo = [];
        var reg = new RegExp(puntoEquipoA+"$","g");
        var puntoAIndex = datos[0].search(reg);
        nombreEquipo.push(datos[0].slice(0,datos[0].indexOf(puntoAIndex)-1));
        nombreEquipo.push(datos[1].slice(1,datos[1].length));

        return nombreEquipo;
    }
    function recuperarPuntoEquipo(datos) {
        var pattEquipoA = /\d+$/g;
        var pattEquipoB = /^\d+/g;
        var pattEquipos =[pattEquipoA,pattEquipoB];
        var index = 0;
        var puntoEquipo = []
        while(index < datos.length)
        {
            var valor = pattEquipos[index].exec(datos[index])
            if(valor == null)
            {
                valor = "null";
            }
            puntoEquipo.push(valor);
            index = index+1;
        }
        return puntoEquipo;
    }
    function recuperarSetEquipo(datos) {
        var pattSetA = /\((\d+)\)/g;
        var pattSetB = /\((\d+)\)/g;
        var pattSetEquipo = [pattSetA,pattSetB];
        var index = 0;
        var SetEquipo = [];
        var valorA = pattSetEquipo[0].exec(datos[0]);
        var valorB = pattSetEquipo[1].exec(datos[1]);
        SetEquipo.push(valorA);
        SetEquipo.push(valorB);
        return SetEquipo;
    }
    function esEquipoBserving(nombreEquipoA,nombreEquipoB) {
        //si la * no está, lanza el error
        if(nombreEquipoA.indexOf('*')<0 && nombreEquipoB.indexOf('*')<0)
        {
            return "error";
        }

        //si hay * para los dos jugadores, lanza el error
        if(nombreEquipoA.indexOf('*') >=0 && nombreEquipoB.indexOf('*') >=0)
        {
            return "error";
        }
        //si la * no está la primera posicion del nombre, lanza error
        if(nombreEquipoA.indexOf('*') != 0 && nombreEquipoB.indexOf('*') != 0)
        {
            return "error";
        }

        if(nombreEquipoB.indexOf('*')==0)
            var teamBServing = true;
        else
            teamBServing = false;

        return teamBServing;


    }
    function errorAlert (mensaje)
    {
        var mensajeError = "Ops, parece que el formato de la entrada no es correcto! Por favor siga uno de los siguientes formatos:\n\n" +
            "Fútbol: teamAName teamAScore-teamBScore teamBName\n\n" +
            "Tenis: teamAName (teamASets) teamAGames teamAScore-teamBScore teamBGames (teamBSets) isServing teamBName\n\n" +
            "Fútbol Americano: teamAName teamAScore-teamBScore teamBName Period";

        var mensajeErrorFubolA = "Ops, parece que el formato de la entrada para el Fútbol Americano no es correcto! por favor siga el siguiente formato:\n\n" +
            "Fútbol Americano: teamAName teamAScore-teamBScore teamBName Period\n\n" +
            "Nota:el periodo solo puede ser uno de los siguientes formatos:\n\n" +
            "1st,2nd,3rd,4th";


        var mensajeErrorTenis = "Ops, parece que el formato de la entrada para el Tenis no es correcto! por favor siga el siguiente formato:\n\n" +
            "Tenis: teamAName (teamASets) teamAGames teamAScore-teamBScore teamBGames (teamBSets) isServing teamBName\n\n" +
            "Nota: teamScore sería uno de los siguientes valores: 00,15,30,40,Adv\n\n" +
            "Nota: isServing se marca con una * y siempre va delante del nombre del jugador"


        var mensajeErrorFutbol = "Ops, parece que el formato de la entrada para el Fútbol no es correcto! por favor siga el siguiente formato:\n\n" +
            "Fútbol: teamAName teamAScore-teamBScore teamBName\n\n";

        switch (mensaje)
        {
            case "mensajeError" :
                alert(mensajeError);
                return;
                break;
            case "mensajeErrorFubolA":
                alert(mensajeErrorFubolA);
                return;
                break;
            case "mensajeErrorTenis":
                alert(mensajeErrorTenis);
                return;
                break;
            case "mensajeErrorFutbol":
                alert(mensajeErrorFutbol);
                return;
                break;
            default:
                alert(mensajeError);
                return;
        }


    }


}])

