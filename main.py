from pynput import keyboard
import winsound
import math

key_order = 'qazwsxedcrfvtgbyhnujmik,ol.p;/['
key_names = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
duration = 50
lowest_frequency = 440
offset = 0
offset_interval = 11

def on_press(key):
    global duration, offset, offset_interval
    try:
        if key.char in key_order:
            # play note
            num = key_order.find(key.char)
            freq = lowest_frequency * math.pow(math.pow(2,1/12),num+offset)
            winsound.Beep(int(freq),duration)
            print(str(int(num/len(key_names))) + key_names[num%len(key_names)])
        else:
            # system sounds (for win32)
            if key.char == '1':
                winsound.PlaySound('SystemAsterisk', winsound.SND_ALIAS|winsound.SND_ASYNC)
            elif key.char == '2':
                winsound.PlaySound('SystemExclamation', winsound.SND_ALIAS|winsound.SND_ASYNC)
            elif key.char == '3':
                winsound.PlaySound('SystemExit', winsound.SND_ALIAS|winsound.SND_ASYNC)
            elif key.char == '4':
                winsound.PlaySound('SystemHand', winsound.SND_ALIAS|winsound.SND_ASYNC)
            elif key.char == '5':
                winsound.PlaySound('SystemQuestion', winsound.SND_ALIAS|winsound.SND_ASYNC)
            
    except AttributeError:
        # tone length
        if key == keyboard.Key.up:
            duration = 100
            print('** normal mode **')
        if key == keyboard.Key.down:
            duration = 50
            print('** dot mode **')

        # offset settings
        if key == keyboard.Key.left:
            offset -= offset_interval
            print('* offset: ' + str(offset) + ' half steps *')
        if key == keyboard.Key.right:
            offset += offset_interval
            print('* offset: ' + str(offset) + ' half steps *')
        pass

def on_release(key):
    if key == keyboard.Key.esc:
        return False

with keyboard.Listener(on_press=on_press,on_release=on_release) as listener:
    listener.join()

