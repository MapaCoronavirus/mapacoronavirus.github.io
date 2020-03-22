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
var estados=[
    "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT","PA","PB",
    "PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
];
var map = L.map('map').setView(brasiliaLatLong, 4);

L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'TOPO-OSM-WMS',
    maxZoom: 18,
    attribution: creditosStr
}).addTo(map);

var marker = new L.Marker([-30, -53]).on('click', function(){
    clicouEm('RS');
}).addTo(map);
marker.bindTooltip("Rio Grande do Sul").openTooltip();

var marker = new L.Marker([-27.27, -50.49]).on('click', function(){
    clicouEm('SC');
}).addTo(map);
marker.bindTooltip('Santa Catarina').openTooltip();

function clicouEm(sigla){
    var estados={
        'RS':{
            name:'Rio Grande do Sul',
            location:[-30, -53]
        },
        'SC':{
            name:'Santa Catarina',
            location:[-27.27, -50.49]
        }
    };
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

function setDados(arr){
    dados=arr;
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
                'UF',
                'Total',
                'Total (MS)',
                'Diferença',
                'Mortes',
                'Site'
            ];
            var cols=$.extend({},colNames);//array2object
            delete arr[0];//remove a linha do cabeçalho
            delete arr[1];//remove a linha do total
            setDados(arr);
            //converter tabela json para html
            var html = '<h2>Todos estados</h2>';
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
                "searching": false,
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
