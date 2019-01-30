var player = document.querySelector('.player');
player.crossOrigin = 'anonymus';
var playButton = document.querySelector('.play');

var progress = document.querySelector('.progress');
var progressBar = document.querySelector('.progress_filled');
let bool = false;

var loop = document.querySelector('.loop');
var loopInt = 0;
var random = document.querySelector(' .random');
var randInt = 0;

var ranges = document.querySelectorAll('.player_range');

var file = document.getElementById('fileFinder');

addEventListeners();

var reader = new FileReader();
var readArray = [];
var tableArray = [];
var playlistInt = 0;


function musicControl(){
    if(player.paused){
        player.play();
        playButton.innerHTML = '&#10074 &#10074';
    }else{
        player.pause();
        playButton.innerHTML = '&#9654';

    }
}

function updateProgress(){
   if(bool == false){
       var procent = (player.currentTime /player.duration)*100;
       progressBar.style.width = `${procent}%`;

   }
}

function changeProgress(e){
    var procent = (e.offsetX /progress.offsetWidth)*player.duration;
    progressBar.style.width = `${procent}%`;
    player.currentTime = procent;
}

function rangeControl(){
    console.log("test");
    if(this.classList.contains('vol')){
        player.volume = this.value;
    }
}

function loopControl(){
    if(loopInt ==  0){
        loopInt++;
        loop.style.color = '#1D49FF';
        player.loop = true;
    }else{
        loopInt = 0;
        loop.style.color = '#000000'
        player.loop = false;
    }
}
function randomControl(){
    if(randInt ==  0){
        randInt++;
        random.style.color = '#1D49FF';
    }else{
        randInt = 0;
        random.style.color = '#000000'
    }
}
console.log(document.getElementById('playlistTable').length)
reader.onload = function(e){
    console.log(e.target.result);
    readArray.push(e.target.result);
};
 function addtoPlaylist(){
    if(file.files.lenght > 10){
        alert('To Many Files limit yourself to 10 at a time');
        return;
    } 
    for(x = 0; x < file.files.length; x++){

            reader.readAsDataURL(file.files[x]);

            console.log(file.files[x].name);
            console.log(file.files[x]);
            var mp3Split = file.files[x].name.split('\.mp3');
            var flacSplit = file.files[x].name.split('\.flac');
            console.log(mp3Split);
            if(mp3Split.length > 1 || flacSplit.length > 1 ){
                var name = file.files[x].name;

                var filename = name; 
                var table = document.getElementById('playlistTable');
                var el = document.createElement('td');
                
                el.innerHTML = filename;
                console.log(table.length);
                var row = table.insertRow(table.rows.length);
                var cell0 = row.insertCell(0);
                var cell = row.insertCell(1);
                var cell2 = row.insertCell(2);

                cell0.innerHTML = playlistInt;
                cell.innerHTML = filename;
                cell.className = `clickable ${playlistInt}`;
                playlistInt++;
                cell2.innerHTML = 'X';
                cell2.className = 'delete';
                addEventListeners();
            }
        }
 }
 function loadSong(){
     if(this.classList.contains("clickable")){
        console.log('hi');
             for(var x = 0; x < readArray.length; x++){
                
                var ts = x.toString()
                if(this.classList.contains(x)){
                    console.log('hi');
                    player.src = readArray[x];
                    player.load();
                    player.play();
                }

                }
    
        } 
    }

    function songEnded(){
        readArray.forEach(song => {
            if(song == player.src){
                var songID = readArray.indexOf(song)
                if(songID+1 == readArray.length){
                    player.pause();
                    if(loopInt>0){
                        player.src = readArray[0];
                        musicControl();
                        loopControl();
                    }
                }else{
                    player.src = readArray[songID+1];

                }
            }
        });
    }


function addEventListeners(){
    var tableElement= document.querySelectorAll('.clickable');
    tableElement.forEach(el => el.addEventListener('click',loadSong));
}

player.addEventListener('timeupdate',updateProgress);
player.addEventListener('ended',songEnded);
playButton.addEventListener('click',musicControl);

loop.addEventListener('click',loopControl)
random.addEventListener('click',randomControl)

ranges.forEach(range => range.addEventListener('change',rangeControl));
ranges.forEach(range => range.addEventListener('mousemove',rangeControl));

progress.addEventListener('click', changeProgress);
progress.addEventListener('mousemove',(e) => bool && changeProgress(e));
progress.addEventListener('mousedown',() => changeProgress, bool = true);
progress.addEventListener('mouseup',() => changeProgress, bool = false);

file.addEventListener('change',addtoPlaylist)