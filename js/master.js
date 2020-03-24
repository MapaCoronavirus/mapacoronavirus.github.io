var brasiliaLatLong=[-15.793889, -47.882778];
var creditosStr=`Site criado por
<a target="_blank" href='https://github.com/aicoutos'>
@aicoutos
</a>
| Dados fornecidos por
<a target="_blank" href="https://github.com/wcota">
@wcota
</a>
`;
var dados;
var map = L.map('map').setView(brasiliaLatLong, 4);
var totalDeCasos;
var totalDeMortos;

L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'TOPO-OSM-WMS',
    maxZoom: 18,
    attribution: creditosStr
}).addTo(map);

function adicionarMarcadores(){
    var keys = Object.keys(estados)
    var len = keys.length;
    var i,key;
    for (i = 0; i < len; i++) {
        key = keys[i];
        var estado=estados[key];
        //marcadores
        var myIcon = L.icon({
            iconUrl: 'img/covid.png',
            iconSize: [25,25]
        });
        var marker = new L.Marker(estado.location,{icon: myIcon}).on('click', function(){
            clicouEm(key);
        }).addTo(map);
        var optsTooltip={
            icon:'img/covid.png',
            permanent:true
        };
        marker.bindTooltip(estado.name,optsTooltip).openTooltip();
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
        var track = new L.KML('kml/'+key+'.kml', {async: true})
        .on('loaded', function (e) {
            this.setStyle(highlightStyle1);
        })
        .addTo(map);
    }
}

function clicouEm(sigla){
    var estados=estados;
    var nomeDoEstado=estados[sigla].name;
    $('#país').hide();
    $('#estado').html('');
    var arr = getDados();
    arr.forEach(function (item, index) {
        if(item[1]==sigla){
            var casosConfirmados=item[2];
            var mortes=item[5];
            var site=item[6];
            var detalhesDoEstado=`
            <h2>${nomeDoEstado}</h2>
            <h3>Casos confirmados:</h3><h1>${casosConfirmados}</h1>
            <h3>Mortes:</h3><h1>${mortes}</h1>
            <h3>Site:</h3><a href="${site}" target="_blank">${site}</a><br><br>
            <button type="button" onclick="javascript:verPaís();">
            Ver todos os estados
            </button>
            `;
            $('#estado').html(detalhesDoEstado).show();
        }
    });
}

function getDados(){
    return dados;
}

function getTotalDeCasos(){
    return totalDeCasos;
}

function getTotalDeMortos(){
    return totalDeMortos;
}

function setDados(arr){
    dados=arr;
    adicionarMarcadores();
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
            //converter tabela json para html
            var casos=getTotalDeCasos();
            var mortos=getTotalDeMortos();
            var html = `
            <h1>${casos} casos, ${mortos} mortes</h1>
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
                "order": [[ 2, "desc" ]],
                "pageLength": 8,
                // "searching": false,
                "lengthChange":false,
                "language": {
                    "url": "https://cdn.datatables.net/plug-ins/1.10.20/i18n/Portuguese-Brasil.json"
                }
            } );
        },
        error: function(jqXHR, textStatus, errorThrow){
            alert('HTTP '+jqXHR['status']+'\n'+errorThrow);
        }
    });
});
