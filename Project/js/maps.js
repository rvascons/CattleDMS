const mapsControl = {};
const myLng = -34.95193;
const myLat = -8.05517;
var map;
var markers = [];
var markersCount = 0;
var labels = ['Gateway','FixPoint','Cow','EVAL'];
var fenceEdge;

(function(){
  function createMap(){
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -8.1, lng: -34.9},
      zoom: 11,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    })
  }
  function setMarker(x,y,index,kind){
    if(kind == 1 || kind == 3){
      var new_longitude = myLng + (x / 6371000) * (180 / 3.1415926) / Math.cos(myLng * 3.1415926/180);
      var new_latitude  = myLat  + (y / 6371000) * (180 / 3.1415926);
      markers[index] = new google.maps.Marker({
        position: {lat: new_latitude, lng: new_longitude},
        map: map,
        label: labels[kind],
      });
    }else if(kind == 2){
      var new_longitude = myLng + (x / 6371000) * (180 / 3.1415926) / Math.cos(myLng * 3.1415926/180);
      var new_latitude  = myLat  + (y / 6371000) * (180 / 3.1415926);
      markers[index] = new google.maps.Marker({
        position: {lat: new_latitude, lng: new_longitude},
        map: map,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
      });
    }else{
      markers[index] = new google.maps.Marker({
        position: {lat: myLat, lng: myLng},
        map: map,
        label: labels[kind],
        
      });
    }

    markersCount++;
  }
  function rmvMarker(index){
    markersCount--;
    markers[index].setMap(null);
  }
  function moveMarker(dx,dy,id){
    var new_longitude = myLng + (dx / 6371000) * (180 / 3.1415926) / Math.cos(myLng * 3.1415926/180);
    var new_latitude  = myLat  + (dy / 6371000) * (180 / 3.1415926);
    var latlng = new google.maps.LatLng(new_latitude, new_longitude);
    markers[id].setPosition(latlng);

  }
  function updateMapCollars(){
    var collarsRef = firebase.database().ref("/Collars/");
    collarsRef.on('value', function(snapshot){
      if(snapshot.hasChildren()){
        snapshot.forEach(function(childSnapshot){
          var data = childSnapshot.val();
          var x = data.pos[0];
          var y = data.pos[1];
          moveMarker(x,y,data.id);
          checkIn(data.id);
        });
      }
    });
  }
  function updateMapFixPoints(){
    var collarsRef = firebase.database().ref("/FixPoint/");
    collarsRef.on('value', function(snapshot){
      if(snapshot.hasChildren()){
      snapshot.forEach(function(childSnapshot){
        var data = childSnapshot.val();
        var x = data.pos[0];
        var y = data.pos[1];
        moveMarker(x,y,data.id);
      });
      }
    });
  }
  function checkForCollars(){
    var collarsRef = firebase.database().ref("/Collars/");
    collarsRef.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var data = childSnapshot.val();
        var x = data.pos[0];
        var y = data.pos[1];
        setMarker(x,y,data.id,2);
      });
      updateMapCollars();
    });
  }
  function checkForFixPoints(){
    var collarsRef = firebase.database().ref("/FixPoint/");
    collarsRef.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var data = childSnapshot.val();
        var x = data.pos[0];
        var y = data.pos[1];
        if(data.id == 0){
          setMarker(x,y,data.id,0);
        }else if(data.id == 1){
          setMarker(x,y,data.id,3);
        }else{
          setMarker(x,y,data.id,1);
        }
      })
      createFence();
    })
    updateMapFixPoints();
  }
  function createFence(){
    var collarsRef = firebase.database().ref("/FixPoint/");
    var fenceLatLng = [];
    collarsRef.once('value', function(snapshot){
      if(snapshot.numChildren() > 2){
        snapshot.forEach(function(childSnapshot){
          var data = childSnapshot.val();
          if(data.fence == true){
            pos = markers[data.id].getPosition();
            fenceLatLng.push(pos);
          }
        });
        fenceEdge = new google.maps.Polygon({
          paths: fenceLatLng,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 0.9,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
        fenceEdge.setMap(map);
      }
      checkAll();
    })
  }
  function showFence(status){
    if(status == 1){
      fenceEdge.setVisible(true);
    }else if(status == 0){
      fenceEdge.setVisible(false);
    }
  }
  function checkAll(){
    var collarsRef = firebase.database().ref("/Collars/");
    collarsRef.once('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          var data = childSnapshot.val();
          var pos = markers[data.id].getPosition();
          if(google.maps.geometry.poly.containsLocation(pos, fenceEdge) == false){
            alert('Vaca ' + data.id + ' fora da cerca. Ultima posicao marcada: ' + data.last_pos);
          }
        });
    });
  }
  function checkIn(id){
    var collarsRef = firebase.database().ref("/Collars/" + id);
    collarsRef.once('value', function(snapshot){
      if(snapshot.hasChildren()){
        var data = snapshot.val();
        var pos = markers[data.id].getPosition();
        if(google.maps.geometry.poly.containsLocation(pos, fenceEdge) == false){
          alert('Vaca ' + data.id + ' fora da cerca. Ultima posicao marcada: ' + data.last_pos);
        }
      }
    });
  }
  mapsControl.checkAll = checkAll;
  mapsControl.checkIn = checkIn;
  mapsControl.showFence = showFence;
  mapsControl.createFence = createFence;
  mapsControl.checkForCollars = checkForCollars;
  mapsControl.checkForFixPoints = checkForFixPoints;
  mapsControl.updateMapFixPoints = updateMapFixPoints;
  mapsControl.updateMapCollars = updateMapCollars;
  mapsControl.rmvMarker = rmvMarker;
  mapsControl.setMarker = setMarker;
  mapsControl.createMap = createMap;
  mapsControl.moveMarker = moveMarker;
})()
    