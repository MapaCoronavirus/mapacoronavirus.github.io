var map = L.map('map').setView([-15.793889, -47.882778], 4);

var creditosStr=`Criado por
<a target=\"_blank\" href='https://github.com/aicoutos'>
@aicoutos
</a>`;

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: creditosStr
}).addTo(map);
