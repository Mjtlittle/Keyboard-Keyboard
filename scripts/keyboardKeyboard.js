var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var keyOrder = [113, 97, 122, 119, 115, 120, 101, 100, 99, 114, 102, 118, 116, 103, 98, 121, 104, 110, 117, 106, 109, 105, 107, 44, 111, 108, 46, 112, 59, 47, 91, 39];
var switchWaveKeys = [49, 50, 51, 52];
var clearLogKey = 96;
var subNoteDurrKey = 45;
var addNoteDurrKey = 61;

var keyNames = ['A','A\u266F','B','C','C\u266F','D','D\u266F','E','F','F\u266F','G','G\u266F'];
var waveTypes = ['square','sine','sawtooth','triangle'];
var waveSelected = 0;
var rootFreq = 440.0;
var duration = 100;
var shiftOffset = 11;
var isShifted = false;
var onMobile = detectMobile();

function playNote(frequency, duration) {
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();

    oscillator.type = waveTypes[waveSelected];
    oscillator.frequency.value = frequency; // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    setTimeout(
        function(){
            oscillator.stop();
        }, duration);
}

function updateInfo(){
    $('#durationRead').text(duration);
    $('#waveTypeRead').text(waveTypes[waveSelected]);
}

function detectMobile() { 
    return (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
}

function toggleControls (){
    controlsToggle = $('#controlsToggle')
    controls = $('#controls') 
    visible = controls.is(':visible');
    if (visible) {
        controls.hide();
        controlsToggle.text('Show '+controlsToggle.text().split(' ')[1]);
    } else {
        controls.show();
        controlsToggle.text('Hide '+controlsToggle.text().split(' ')[1]);
    }
}

function logKey(num, octive){
    name = keyNames[num%keyNames.length];
    hue = Math.round(num/32*100);

    $note = $('<span>',{'class':'note'});
    $note.html(name)
    $('#noteLog').append($note);
    window.scrollTo(0,document.body.scrollHeight);
}

function runKey(event){
    key = event.keyCode;
    
    if (keyOrder.indexOf(key) > -1){
        num = keyOrder.indexOf(key);
        frequency = rootFreq * Math.pow(Math.pow(2,1/12),num);
        playNote(Math.floor(frequency),duration);
        logKey(num);
    }

    //clear Log
    else if (key == clearLogKey){
        console.log('Cleared key-log');
        $('#noteLog').html(''); 
    }
    
    //switch wave type
    else if(switchWaveKeys.indexOf(key) > -1){
        waveIndex = switchWaveKeys.indexOf(key);
        console.log('Switched wave type to: ' + waveTypes[waveIndex]);
        waveSelected = waveIndex;
    }

    //add duration to note
    else if (key == addNoteDurrKey){ 
        duration += 25; 
        duration = Math.abs(duration);
        console.log('Changed duration of note: '+duration);
    }
    
    //remove duration from note
    else if (key == subNoteDurrKey){ 
        duration -= 25;  
        duration = Math.abs(duration);
        console.log('Changed duration of note: '+duration);
    }
    
    updateInfo();
}

//document.onkeyup = runKey;

$(document).keypress(runKey);

addEventListener("load", function(event) {
    
    updateInfo();
    $('#mobileIn').attr('hidden',!onMobile);
    
});

