var map;
var markers=[];
var infoWindow;

function initMap() {
  var India={
    lat: 34.063380,
    lng: -118.358080
  }
  map = new google.maps.Map(document.getElementById('map'), {
    center: India,
    zoom: 8
  });

  infoWindow = new google.maps.InfoWindow();
     searchstores()
     
  }

  function searchstores()
  { var c=0;
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode)
    {
    stores.forEach(function(store){
      var postal = store.address.postalCode.substring(0,5);

      if(postal == zipCode){
          foundStores.push(store);
       c++;}
    });
      if(c>0)
      {
      clearLocations()
      displayStores(foundStores)
      showmarkers(foundStores)
      setOnClickListener()
      }
      else
      { clearLocations()
        var notfound=`<div class="address-container">
        <div class="no-result">
      <marquee>No Stores found for this Zip Code.</marquee>
    </div>
    </div>`;
     
      document.querySelector('.stores-list').innerHTML = notfound;
      }
    } 
  else
      {
    foundStores=stores;
    displayStores(foundStores)
    showmarkers(foundStores)
    setOnClickListener()
      }
    
    
  }

  function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

  function displayStores(stores) {
    var storesHtml = "";
    stores.forEach(function(store, index){
        var address = store.addressLines;
        var phone = store.phoneNumber;
        storesHtml += `
        <div class="list-container">
        <div class="info-container">
          <div class="address-container">
            <span>${address[0]}</span>
            <span>${address[1]}</span>
          </div>
        <div class="phone-container">
        ${phone}
        </div>
        </div>
        <div class="store-number-container">
          <div class="store-number">
              ${index+1}
          </div>
      </div>
      </div>
        `
    });
    document.querySelector('.stores-list').innerHTML = storesHtml;

}

function showmarkers(stores){
  var bounds = new google.maps.LatLngBounds();
  stores.forEach(function(store,index){
    var latlng = new google.maps.LatLng(
        store.coordinates.latitude,
        store.coordinates.longitude);
        bounds.extend(latlng);
    var name = store.name;
    var address = store.addressLines[0];
    var phone = store.phoneNumber;
    var statusText = store.openStatusText;
        var phone = store.phoneNumber;
    createMarker(latlng, name, address ,statusText,phone,index);
});
map.fitBounds(bounds);
}



function createMarker(latlng,name,address, statusText ,phone,index)
{  var html = ` <div class="store-info-window">
<div class="store-info-name">
    ${name}
</div>
<div class="store-info-status">
    ${statusText}
</div>
<div class="store-info-address">
    <div class="circle">
        <i class="fas fa-location-arrow"></i>
    </div>
    ${address}
</div>
<div class="store-info-phone">
    <div class="circle">
        <i class="fas fa-phone-alt"></i>
    </div>
    ${phone}
</div>
</div>`;
   var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label:`${index+1}`
  });
  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}


function setOnClickListener() {
  var storeElements = document.querySelectorAll('.list-container');
  storeElements.forEach(function(elem, index){
      elem.addEventListener('click', function(){
          google.maps.event.trigger(markers[index], 'click');
      })
  });
}