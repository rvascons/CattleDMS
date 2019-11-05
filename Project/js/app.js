const cowDatabase = {};
var input01Element = document.getElementById("in01");
var button01Element = document.getElementById("bt01");
var input02Element = document.getElementById("in02");
var button02Element = document.getElementById("bt02");
var tableElement = document.getElementById("table");
var map;
var markers = [];
var markersCount = 0;
var labels = ['Gateway','FixPoint','Cow','EVAL'];

(function(){
    function newCollar(id,x,y){
        const collar = {
            id : id,
            pos: [x,y],
            last_pos: [0,0],
            open : false,
            time: firebase.database.ServerValue.TIMESTAMP,
        };
        let changes = {};
        changes['/Collars/' + collar.id] = collar;
        let collarRef = firebase.database().ref();
        collarRef.update(changes)
            .then(function(){
                return {success : true, msg : 'New collar registered'};
            })
            .catch(function(error){
                return {success : false, msg : `Error to register new collar = ${error.message}`};
            })
    }   
    function newRequest(id){
        const request = {
            id : id,
            state : false,   
        }
        let collarRef = firebase.database().ref();
        let requests = {};
        requests['/Request/' + id] = request;
        collarRef.update(requests)
            .then(function(){
                return {success : true, msg : 'Collar Requested'};
            })
            .catch(function(error){
                return {success : false, msg : `${error.message}`};
            })
    }
    function newFixPoint(id, x, y){
        const fixPoint = {
            id : id,
            pos: [x,y],
            fence : false,
            time: firebase.database.ServerValue.TIMESTAMP,
        };
        let changes = {};
        changes['/FixPoint/' + fixPoint.id] = fixPoint;
        let fixPointRef = firebase.database().ref();
        fixPointRef.update(changes)
            .then(function(){
                return {success : true, msg : 'New collar registered'};
            })
            .catch(function(error){
                return {success : false, msg : `Error to register new collar = ${error.message}`};
            })
    }
    function rmvFixPoint(id){
        let collarRef = firebase.database().ref('/Request/' + id);
        collarRef.remove()
            .then(function(){
                return {success : true, msg: 'FixPoint removed'};
            })
            .catch(function(error){
                return {success : false, msg: `Error to remove FixPoint = ${error.message}`};
            })     
    }
    function rmvCollar(id){
        let collarRef = firebase.database().ref('/Collars/' + id);
        collarRef.remove()
            .then(function(){
                return {success : true, msg: 'Collar removed'};
            })
            .catch(function(error){
                return {success : false, msg: `Error to remove collar = ${error.message}`};
            })     
    }
    function shwCollar(id){
        var collarIdRef = firebase.database().ref('/Collars/' + id + 'pos');
        collarIdRef.on('value', function(snapshot) {
                var data = childSnapshot.val();
                console.log(data.id);
                alert('Posição: ' + data.id);
        });
    }
    function updateTable(){
        var table = document.getElementById('myTable').getElementsByTagName('tbody')[0];
        var collarsRef = firebase.database().ref("/Collars/");
        collarsRef.on('value', function(snapshot){
            table.innerHTML = '';
            snapshot.forEach(function(childSnapshot){
                var data = childSnapshot.val();
                var index = data.id;
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = data.id;
                cell2.innerHTML = data.open;
                cell3.innerHTML = data.pos;
                cell4.innerHTML = data.last_pos;
            });     
        });
    }
    button01Element.onclick = function unlockCow(){
        console.log('botao 1 clicado');
        var id = input01Element.value;
        input01Element.value = '';
        newRequest(id);
    }
    button02Element.onclick = function findCow(){
        console.log('botao 1 clicado');
        var id = input02Element.value;
        input02Element.value = '';
        shwCollar(id);
    }
    function createMap(){
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -12.77, lng: -47.92},
            zoom: 4,
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
        markers[index] = new google.maps.Marker({
          position: {lat: x, lng: y},
          map: map,
          label: labels[kind] 
        });
        markersCount++;
    }
    function rmvMarker(index){
        markers[index].setMap(null);
    }

    cowDatabase.updateTable = updateTable;
    cowDatabase.rmvFixPoint = rmvFixPoint;
    cowDatabase.newFixPoint = newFixPoint;
    cowDatabase.newRequest = newRequest;
    cowDatabase.newCollar = newCollar;
    cowDatabase.rmvCollar = rmvCollar;
    cowDatabase.shwCollar = shwCollar;
    cowDatabase.rmvMarker = rmvMarker;
    cowDatabase.setMarker = setMarker;
    cowDatabase.createMap = createMap;


    //new_latitude  = latitude  + (dy / r_earth) * (180 / pi);
    //new_longitude = longitude + (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);
})();






