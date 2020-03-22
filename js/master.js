var brasiliaLatLong=[-15.793889, -47.882778];
var creditosStr=`Criado por
<a target=\"_blank\" href='https://github.com/aicoutos'>
@aicoutos
</a>`;
var estados=[
    "AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO"
];
var map = L.map('map').setView(brasiliaLatLong, 4);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    $('#detalhes').html(nomeDoEstado);
}
