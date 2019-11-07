const cowDatabase = {};
var input01Element = document.getElementById("in01");
var button01Element = document.getElementById("bt01");
var input02Element = document.getElementById("in02");
var button02Element = document.getElementById("bt02");
var tableElement = document.getElementById("table");

(function(){
    function newCollar(id,x,y){
        const collar = {
            id : id,
            pos: [x,y],
            last_pos: [0,0],
            open : false,
            time: firebase.database.ServerValue.TIMESTAMP,
        };
        mapsControl.setMarker(0,0,id,2);
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
            open : false,   
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
            fence : true,
            time: firebase.database.ServerValue.TIMESTAMP,
        };

        if(id = 0){
          mapsControl.setMarker(0,0,0,0);
        }
        if(id = 1){
          mapsControl.setMarker(x,y,1,3);
        }
        if(id = 2){
          mapsControl.setMarker(x,y,2,1);
        }
        
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
        mapsControl.rmvMarker(id);
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
        mapsControl.rmvMarker(id);
        collarRef.remove()
            .then(function(){
                return {success : true, msg: 'Collar removed'};
            })
            .catch(function(error){
                return {success : false, msg: `Error to remove collar = ${error.message}`};
            })     
    }
    function shwCollar(id){
        var collarIdRef = firebase.database().ref('/Collars/' + id);
        collarIdRef.on('value', function(snapshot) {
            var data = snapshot.val();
            console.log(data.id);
            alert('Posição: ' + data.pos);
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
    function warnCollar(){
        var collarIdRef = firebase.database().ref('/Request/');
        collarIdRef.on('value', function(snapshot){
          snapshot.forEach(function(childSnapshot){
            var data = childSnapshot.val();
            console.log(data);
            if(data.open == true)
              alert('Coleira ' + data.id + ' desbloqueada.');
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
    
    cowDatabase.warnCollar = warnCollar;
    cowDatabase.updateTable = updateTable;
    cowDatabase.rmvFixPoint = rmvFixPoint;
    cowDatabase.newFixPoint = newFixPoint;
    cowDatabase.newRequest = newRequest;
    cowDatabase.newCollar = newCollar;
    cowDatabase.rmvCollar = rmvCollar;
    cowDatabase.shwCollar = shwCollar;

    //new_latitude  = latitude  + (dy / r_earth) * (180 / pi);
    //new_longitude = longitude + (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);
})();






