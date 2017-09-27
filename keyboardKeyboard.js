var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var keyOrder = 'qazwsxedcrfvtgbyhnujmik,ol.p;/[';
var keyNames = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
var waveTypes = ['square','sine','sawtooth','triangle']
var waveSelected = 0;
var rootFreq = 440.0;
var duration = 100;
var offsetOctave = 0;

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
    document.getElementById('offsetOctaveRead').innerText = offsetOctave;
    document.getElementById('waveTypeRead').innerText = waveTypes[waveSelected];

}

function log(text){
    document.getElementById('log').innerHTML += ('<span class="mono">' + text + '</span>');
    window.scrollTo(0,document.body.scrollHeight);
}

function runKey(key){
    console.log(key);

    var num = keyOrder.indexOf(key.key);
    if (num > -1){
        freq = rootFreq * Math.pow(Math.pow(2,1/12),num+offsetOctave*11);
        playNote(Math.floor(freq),duration);
        //log('' + Math.floor(num/keyNames.length) + keyNames[num%keyNames.length] + '  ');
        log(' ' + keyNames[num%keyNames.length]);
    } else {
        if (key.key == 'Backspace'){ document.getElementById('log').innerHTML = '';}
        else if('1234'.indexOf(key.key) > -1){waveSelected = parseInt(key.key)-1;}
        else if(key.key == '\\'){
            isHid = document.getElementById('controls').hidden;
            document.getElementById('controls').hidden = !isHid;
            if(!isHid){
                window.scrollTo(0,document.body.scrollHeight);
            }else{
                window.scrollTo(0,0);
            }
        }

        else if (key.key == 'ArrowLeft'){ offsetOctave -= 1;}
        else if (key.key == 'ArrowRight'){ offsetOctave += 1;}

        else if (key.key == 'ArrowUp'){ duration += 10; duration = Math.abs(duration);}
        else if (key.key == 'ArrowDown'){ duration -= 10;  duration = Math.abs(duration);}
        updateInfo();
    }
}

function unhideTextbox(){
    document.getElementById('mobileIn').hidden = false;
}

document.onkeyup = runKey;
document.onload = updateInfo;
