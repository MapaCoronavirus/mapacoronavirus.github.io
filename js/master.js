var brasiliaLatLong=[-15.793889, -47.882778];
var creditosStr=`Site criado por
<a target="_blank" href="https://dev.to/portugues/mapa-do-covid-19-no-brasil-2kc6">
Anderson Ismael
</a>
| Dados fornecidos por
<a target="_blank" href="https://github.com/wcota/covid19br">
Wesley Cota
</a>
`;
var dados;
var map = L.map('map', { zoomControl: false }).setView(brasiliaLatLong, 4);
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.boxZoom.disable();
map.keyboard.disable();
var marcador=new Array();
var totalDeCasos;
var totalDeMortos;
//https://cartodb-basemaps-{s}.global.ssl.fastly.net/flatblue_nolabels/{z}/{x}/{y}.png
//https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png
//"http://s3.amazonaws.com/com.modestmaps.bluemarble/{z}-r{y}-c{x}.jpg"
//http://cesiumjs.org/blackmarble/{z}/{x}/{-y}.png
//'https://ows.mundialis.de/services/service?'
L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
    layers: 'TOPO-OSM-WMS',
    maxZoom: 18,
    attribution: creditosStr
}).addTo(map);

function adicionarMarcadores(){
    var keys = Object.keys(estados)
    var len = keys.length;
    var i,k;
    var iAsync=0;
    for (i = 0; i < len; i++) {
        k = keys[i];
        var estado=estados[k];
        //marcadores
        var myIcon = L.icon({
            iconUrl: 'img/covid.png',
            iconSize: [25,25]
        });
        var optsTooltip={
            icon:'img/covid.png',
            sticky:true
        };
        var value = new L.Marker(estado.location,{
            //icon: myIcon,
            title: k
        })
        .on('click', function(){
            clicouEm(this.options.title);
        })
        .addTo(map);
        setMarcador(i,value);
        getMarcador(i).bindTooltip(estado.name,optsTooltip);
        //contornos dos estados
        var highlightStyle1 = {
            //https://leafletjs.com/reference-1.6.0.html#path-option
            fillColor: "#0000FF",//background
            fillOpacity:0,//opacidade do background
            weight: 3,//tamanho do contorno
            color: "#000000",//cor dos contorno
            opacity: 0.5//opacidade do contorno
        };
        var customLayer = L.geoJson(null, {
            // http://leafletjs.com/reference.html#geojson-style
            style: function(feature) {
                //if feature.properties.Name
                return highlightStyle1;
            }
        });
        var track = new L.KML('kml/'+k+'.kml', {async: true})
        .on('loaded', function (e) {
            this.setStyle(highlightStyle1);
            iAsync++;
            if(iAsync==len){
                $("#mapa").loading('stop');
                $("#mapa").css('z-index',-10);
                $("#map").css('z-index',0);
            }

        })
        .addTo(map);
    }
}

function clicouEm(sigla){
    var estados=getEstados();
    var nomeDoEstado=estados[sigla].name;
    $('#país').hide();
    $('#estado').html('');
    var arr = getDados();
    arr.forEach(function (item, index) {
        if(item[1]==sigla){
            var casos=item[2];
            var mortos=item[5];
            var site=item[7];
            var siglaLC=sigla.toLowerCase();
            var detalhesDoEstado=`
            <h1>
            ${nomeDoEstado}
            </h1>
            <h1>
            <span class="red">
            ${casos} casos
            </span>/
            ${mortos} mortes</h1>
            <a href="${site}" target="_blank">${site}</a><br><br>
            <a href="javascript:verPaís();">
            Ver todos os casos do Brasil
            </a>
            `;
            $('#estado').html(detalhesDoEstado).show();
        }
    });
}

function getDados(){
    return dados;
}

function getEstados(){
    return estados;
}

function getMarcador(i){
    return marcador[i];
}

function getTotalDeCasos(){
    return totalDeCasos;
}

function getTotalDeMortos(){
    return totalDeMortos;
}

function setDados(arr){
    dados=arr;
}

function setMarcador(key,value){
    marcador[key]=value;
}

function setTotalDeCasos(num){
    totalDeCasos=num;
}

function setTotalDeMortos(num){
    totalDeMortos=num;
}

function verPaís(){
    $('#estado').hide();
    $('#país').show();
}

$(function(){
    var url='https://raw.githubusercontent.com/wcota/covid19br/master/cases-brazil-total.csv';
    var tableSelector='#país';
    $("#mapa").loading({
        stoppable: true,
        message: 'Carregando mapa...'
    }).css('z-index',-2);
    $("#detalhes").loading({
        stoppable: true,
        message: 'Carregando dados...'
    }).css('z-index',-5);
    $.ajax({
        url: url,
        type: 'get',
        success: function(data) {
            //converter csv para json
            var arr=$.csv.toArrays(data);
            var i=0;
            var numberOfColumns=7;
            var colNames=new Array(numberOfColumns);
            while (i < numberOfColumns) {
                colNames[i]=i;
                i++;
            }
            var colNames=[
                'País',
                'Estado',
                'Casos',
                'Total (MS)',
                'Diferença',
                'Mortes',
                'Site'
            ];
            var cols=$.extend({},colNames);//array2object
            delete arr[0];//remove a linha do cabeçalho
            setTotalDeCasos(arr[1][2]);
            setTotalDeMortos(arr[1][5]);
            delete arr[1];//remove a linha do total
            setDados(arr);
            adicionarMarcadores();
            //converter tabela json para html
            var casos=getTotalDeCasos();
            var mortos=getTotalDeMortos();
            var html = `
            <h1>
            COVID-19 no Brasil
            </h1>
            <h1>
            <span class="red">
            ${casos} casos
            </span>/
            ${mortos} mortes</h1>
            `;
            html=html+ToTable(cols,arr);
            $(tableSelector).html(html);
            //esconder colunas
            var TableColumnHider = window.module.exports;// simulate module loader
            var uniqueTableSelector = tableSelector+' table';
            var hider = new TableColumnHider(uniqueTableSelector);
            hider.hideColumns([1,4,5,7]);
            //paginação
            var linha=$(uniqueTableSelector+' tr:eq(0)').html();
            $(uniqueTableSelector+' tr:eq(0)').remove();
            $(uniqueTableSelector).prepend('<thead>'+linha+'</thead>')
            //datatable
            $(uniqueTableSelector).DataTable( {
                "order": [[ 5, "desc" ]],
                "pageLength": 7,
                // "searching": false,
                "lengthChange":false,
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Portuguese-Brasil.json"
                }
            } )
            .on('draw',function(){
                $("#detalhes").loading('stop');
                $('#país').show();
            });

        },
        error: function(jqXHR, textStatus, errorThrow){
            alert('HTTP '+jqXHR['status']+'\n'+errorThrow);
        }
    });
});
