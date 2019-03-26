var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var rootFreq = 440.0;
var cutoff_duration = 50;
var current_wave = 'sine';
var mono_mode = false

var note_names = ['A', 'A\u266F', 'B', 'C', 'C\u266F', 'D', 'D\u266F', 'E', 'F', 'F\u266F', 'G', 'G\u266F'];
var note_order_lowercase = 'qazwsxedcrfvtgbyhnujmik,ol.p;/[\']';
var note_order_uppercase = 'QAZWSXEDCRFVTGBYHNUJMIK<L>P:?{"}';
var activated_keys = {}


var key_mapping = {
    ' ': ()=>{deactivate_all_keys();}, // panic
    
    '1': ()=>{current_wave = 'sine';}, // change waves
    '2': ()=>{current_wave = 'square';},
    '3': ()=>{current_wave = 'sawtooth';},
    '4': ()=>{current_wave = 'triangle';},

    '-': ()=>{cutoff_duration -= 5; cutoff_duration = Math.abs(cutoff_duration);},
    '=': ()=>{cutoff_duration += 5; cutoff_duration = Math.abs(cutoff_duration);},
    
    '0': ()=>{key_history_links_enabled = !key_history_links_enabled; clear_key_history();},
    '9': ()=>{mono_mode = !mono_mode;}
}

var color_schemes = [
    ['#b8d8d8','#7a9e9f','#4f6367'],
    ['#ece9e5','#8b8984','#2c2929'],
    ['#fcddbc','#ef959d','#69585f'],
    ['#ead2ac','#9cafb7','#4281a4'],
    ['#ead2ac','#e6b89c','#fe938c']
]


////////////////
// HISTORY LINKS
////////////////
var key_history = [];
var key_history_limit = 50;
var key_history_links_enabled = true;
var key_history_links = {
    'dzwxwzq':() => {window.open('https://youtu.be/NmCCQxVBfyM');},      // tetris
    'qzezrrd':()=>{window.open('https://youtu.be/dQw4w9WgXcQ');},        // rick
    'xcnxcn':()=>{window.open('https://youtu.be/TkYEJXN2QWk?t=7');},     // storms
    'yk.iyk.i':()=>{window.open('https://youtu.be/-sOadAaGiq4');},           // lavender
    'dxwxdddxxxddddxwxdddxxdxw':()=>{alert('anyone can play that...');}, // mary
    'landdownunder':()=>{
        var node = document.createElement('style');
        node.innerHTML = '* {transform: rotate(180deg);}';
        document.body.appendChild(node);
    },
    'color':random_color
}

function clear_key_history(){
    key_history = [key_history[key_history.length-1]];
}

function key_history_push(key){

    key_history.push(key)

    // limit length
    if (key_history.length > key_history_limit){
        key_history = key_history.slice(-key_history_limit);
    }

    // check links if enabled
    if (key_history_links_enabled){
        check_for_link();
    }
}


function check_for_link(){

    history_string = key_history.join('');
    for (var trigger in key_history_links) {
        if (key_history_links.hasOwnProperty(trigger)) {
            
            // if pattern is triggered
            if (history_string.includes(trigger)){
                deactivate_all_keys();
                key_history_links[trigger]();
                clear_key_history();
                
            }
    
        }}

}


////////////////
// NOTE PLAYING
////////////////

// helper functions
function interpret_key(key){

    shifted = false;
    upper_location = note_order_uppercase.indexOf(key);
    if (upper_location > -1) {
        key = note_order_lowercase[upper_location];
        shifted = true;
    }
    return {
        key: key,
        shifted: shifted
    };
}

function get_key_number(key){
    return note_order_lowercase.indexOf(key)
}

// key activation handling
function activate_keyboard_key(key){

    // return if already activated
    if (activated_keys.hasOwnProperty(key)){
        return;
    }

    // only one channel allowed
    if (mono_mode){
        deactivate_all_keys();
    }

    // calculate frequency
    frequency = Math.floor(rootFreq * Math.pow(Math.pow(2, 1 / 12), get_key_number(key)));
    
    // create oscillator
    var oscillator = audioCtx.createOscillator();
    oscillator.type = current_wave;
    oscillator.frequency.value = frequency;
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    // set object
    activated_keys[key] = oscillator;

}

function deactivate_keyboard_key(key){
    
    // if key is activated => deactivate
    if (activated_keys.hasOwnProperty(key)){
        
        // delayed cutoff
        setTimeout(function(){
            if (activated_keys.hasOwnProperty(key)){
                activated_keys[key].stop();
                delete activated_keys[key];
            }
        }, cutoff_duration);
    }

}

function deactivate_all_keys(){
    for (var key in activated_keys) {
        if (activated_keys.hasOwnProperty(key)) {
            activated_keys[key].stop();
            delete activated_keys[key];
        }
    }
}

////////////////
// HANDLE KEYPRESSES
////////////////

function on_key_down(event) {
    
    //
    audioCtx.resume()
    
    // get event key
    digest = interpret_key(event.key);
    key = digest.key;
    shifted = digest.shifted;
    
    // if key is a keyboard key
    if (get_key_number(key) > -1) {
        activate_keyboard_key(key)
    }

    // if mapped key, then run
    if (key_mapping.hasOwnProperty(key)){
        key_mapping[key]();
    }

    
}

function on_key_up(event) {

    // get event key
    digest = interpret_key(event.key);
    key = digest.key;
    shifted = digest.shifted;

    // if key is a keyboard key
    if (get_key_number(key) > -1) {
        deactivate_keyboard_key(key)   
        
        // update key history
        key_history_push(key)
    }

    update_info();

}

////////////////
// INIT
////////////////

// get note name
function get_key_name(key){
    loops = Math.floor(get_key_number(key) / note_names.length) + 4;
    return note_names[get_key_number(key) % note_names.length] + loops.toString();
}

// detects if on mobile
function is_mobile() {
    return (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i));
}

// random color
function random_color() {
    
    choosen_scheme = color_schemes[Math.floor(Math.random()*color_schemes.length)]
    
    root_style = $("body").get(0).style;
    root_style.setProperty('--primary-color', choosen_scheme[0]);
    root_style.setProperty('--secondary-color', choosen_scheme[1]);
    root_style.setProperty('--background-color', choosen_scheme[2]);

}

// updates information
function update_info() {

    // last note
    if (key_history.length > 0){
        last_key = key_history[key_history.length-1];
        $('#last_note_info').text(get_key_name(last_key) + ' [' + last_key + ']');
    } else {
        $('#last_note_info').text('--')
    }
    
    // mono
    if (mono_mode){
        $('#mono_mode_info').text('Enabled');
    }else{
        $('#mono_mode_info').text('Disabled');
    }

    // wave type
    $('#wave_type_info').text(current_wave);
    
    // cutoff
    $('#cutoff_info').text(cutoff_duration);

    // secrets enabled
    if (key_history_links_enabled){
        $('#secrets_enabled_info').text('Enabled');
    }else{
        $('#secrets_enabled_info').text('Disabled');
    }

}

// register keypress events
$(document).keypress(on_key_down);
$(document).keyup(on_key_up);

addEventListener("load", function (event) {

    // update information displayed
    update_info();

    // enable textbox if on mobile
    $('#mobileIn').attr('hidden', !is_mobile());

});