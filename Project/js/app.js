const cowDatabase = {};
var set = false;
var input01Element = document.getElementById("in01");
var button01Element = document.getElementById("bt01");
var button03Element = document.getElementById("bt03");
var input02Element = document.getElementById("in02");
var button02Element = document.getElementById("bt02");
var button04Element = document.getElementById("bt04");
var tableElement = document.getElementById("table");

(function(){
    function newCollar(id){
        const collar = {
            id : id,
            pos: [0,0],
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
    function openRequest(id){
        const request = {
            id : id,
            status : 'unlock',   
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
    function lockRequest(id){
        const request = {
            id : id,
            status : 'lock',   
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

        if(id == 0){
          mapsControl.setMarker(0,0,0,0);
        }
        if(id == 1){
          mapsControl.setMarker(x,y,1,3);
        }
        if(id == 2){
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
    function requestReply(){
        var collarReqRef = firebase.database().ref('/Request/');
        collarReqRef.on('value', function(snapshot){
          snapshot.forEach(function(childSnapshot){
            var data = childSnapshot.val();
            if(data.status == 'ok1'){
                alert('Coleira ' + data.id + ' desbloqueada.');
                var collarIdRef = firebase.database().ref('/Collars/' + data.id);
                collarIdRef.child('open').set(true);
            }else if(data.status == 'ok2'){
                alert('Coleira ' + data.id + ' bloqueada.');
                var collarIdRef = firebase.database().ref('/Collars/' + data.id);
                collarIdRef.child('open').set(false);
            }
          });
        });
    }
    button01Element.onclick = function unlockCow(){
        console.log('botao de liberação clicado');
        var id = input01Element.value;
        input01Element.value = '';
        openRequest(id);
    }
    button02Element.onclick = function findCow(){
        console.log('botao de busca clicado');
        var id = input02Element.value;
        input02Element.value = '';
        shwCollar(id);
    }
    button03Element.onclick = function lockCow(){
        console.log('botao de bloquei clicado');
        var id = input01Element.value;
        input01Element.value = '';
        lockRequest(id);
    }
    button04Element.onclick = function Fence(){
        if(set == false){
            set = true;
            mapsControl.showFence(0);
        }else{
            set = false;
            mapsControl.showFence(1);
        }
    }
    
    cowDatabase.requestReply = requestReply;
    cowDatabase.updateTable = updateTable;
    cowDatabase.rmvFixPoint = rmvFixPoint;
    cowDatabase.newFixPoint = newFixPoint;
    cowDatabase.lockRequest = lockRequest;
    cowDatabase.openRequest = openRequest;
    cowDatabase.newCollar = newCollar;
    cowDatabase.rmvCollar = rmvCollar;
    cowDatabase.shwCollar = shwCollar;
})();






