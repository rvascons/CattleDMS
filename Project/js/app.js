const cowDatabase = {};
var cowCount = 0;
var inputElement = document.getElementById("in01");
var buttonElement = document.getElementById("bt01");

(function(){
    function newCollar(id,x,y){
        const collar = {
            id : id,
            pos: [0,0],
            last_pos: [0,0],
            open : false,
            time: firebase.database.ServerValue.TIMESTAMP,
        };
        cowCount ++;
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
        const collar = {
            id : id,
            pos: [x,y],
            time: firebase.database.ServerValue.TIMESTAMP,
        };
    }
    function rmvFixPoint(id){
        let collarRef = firebase.database().ref('/Request/' + id);
        collarRef.remove()
            .then(function(){
                cowCount --;
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
                cowCount --;
                return {success : true, msg: 'Collar removed'};
            })
            .catch(function(error){
                return {success : false, msg: `Error to remove collar = ${error.message}`};
            })     
    }
    function shwCollar(id){
        var collarIdRef = firebase.database().ref('/Collars/' + id +'/pos');
        collarIdRef.on('value', function(snapshot) {
            console.log(snapshot.val());
        });
    }
    cowDatabase.newRequest = newRequest;
    cowDatabase.newCollar = newCollar;
    cowDatabase.rmvCollar = rmvCollar;
    cowDatabase.shwCollar = shwCollar;
})()



