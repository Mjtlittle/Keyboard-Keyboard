var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var keyOrder = 'qazwsxedcrfvtgbyhnujmik,ol.p;/[';
var shiftKeyOrder = 'QAZWSXEDCRFVTGBYHNUJMIK<OL>P:?{"';
var keyNames = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
var waveTypes = ['square','sine','sawtooth','triangle']
var waveSelected = 0;
var rootFreq = 440.0;
var duration = 100;
var shiftOffset = 11;

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
    document.getElementById('durationRead').innerText = duration;
    document.getElementById('waveTypeRead').innerText = waveTypes[waveSelected];
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

function logKey(text, octive){
    document.getElementById('noteLog').innerHTML += ('<span class="note">' + text + '</span>');
    window.scrollTo(0,document.body.scrollHeight);
}

function runKey(key){
    
    console.log(key);

    if (keyOrder.indexOf(key.key) > -1){
        
        num = keyOrder.indexOf(key.key);
        frequency = rootFreq * Math.pow(Math.pow(2,1/12),num);
        
        playNote(Math.floor(frequency),duration);
        logKey(' ' + keyNames[num%keyNames.length],  Math.floor(num/keyNames.length));
    
    } else if (shiftKeyOrder.indexOf(key.key) > -1){
       
        num = shiftKeyOrder.indexOf(key.key);
        frequency = rootFreq * Math.pow(Math.pow(2,1/12),num+shiftOffset);
        
        playNote(Math.floor(frequency),duration);
        logKey(' ' + keyNames[num % keyNames.length],  Math.floor(num/keyNames.length));
    
    } else {
        if (key.key == 'Backspace'){ 
            document.getElementById('noteLog').innerHTML = '';
        }
        else if('1234'.indexOf(key.key) > -1){
            waveSelected = parseInt(key.key)-1;
        }
        else if(key.key == '\\'){
            controlsHidden = document.getElementById('controls').hidden;
            document.getElementById('controls').hidden = !controlsHidden;
            if(!controlsHidden){
                window.scrollTo(0,document.body.scrollHeight);
            }else{
                window.scrollTo(0,0);
            }
        }

        else if (key.key == 'ArrowUp'){ duration += 10; duration = Math.abs(duration);}
        else if (key.key == 'ArrowDown'){ duration -= 10;  duration = Math.abs(duration);}
        updateInfo();
    }
}

document.onkeyup = runKey;

addEventListener("load", function(event) {
    updateInfo();

    mobileIn = document.getElementById('mobileIn');
    mobileIn.hidden = !detectMobile();
    
});

