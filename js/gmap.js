var campany_ = "천지연폭포";   
var addr_ = "제주 서귀포시 천지동 667-7";
var lat_ = "33.246952";
var lng_ = "126.554417";

function initMap() {
    var myLocal = new google.maps.LatLng(lat_, lng_);

    var map = new google.maps.Map(document.getElementById('section_gmap'), {
      center: myLocal,
      zoom: 15
    });

    // 마커 생성부분
    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    './img/bottom.png';
    var marker = new google.maps.Marker({
    position: myLocal,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: image
    });
    // 라벨 부분
    var infowindow = new google.maps.InfoWindow({
    content: campany_ + '<br>' + addr_ + '<br>'
     });
    marker.addListener('mouseover', function() {
        infowindow.open(map, marker);
    });
    marker.setMap(map);
}  