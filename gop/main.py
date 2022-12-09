from vosk import Model, KaldiRecognizer, SetLogLevel  # for ASR
import os  # for audio file directory access
import subprocess  # using ffmpeg
import json  # for loading json elements as python lists
from experiment import parameters
import argparse
import json
import numpy as np

SetLogLevel(-1)  # show few logs for vosk

audio_file = 'audio_product_2.wav'
pratt_path = 'myspsolution.praat'


def transcribe(audio, get_prosody):
    # Using vosk model for offline ASR and returning a list of words spoken with timestamps

    if not os.path.exists("model"):
        print("ERROR!! Cannot load VOSK model")
        exit(1)

    sample_rate = 16000
    model = Model('model')
    rec = KaldiRecognizer(model, sample_rate)
    rec.SetWords(True)

    process = subprocess.Popen(['ffmpeg', '-loglevel', 'quiet', '-i', audio,
                                '-ar', str(sample_rate), '-ac', '1', '-f', 's16le', '-'],
                               stdout=subprocess.PIPE)
    results = []
    lst = []

    while True:
        data = process.stdout.read(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            results.append(rec.Result())
    results.append(rec.FinalResult())
    content = ""
    words_per_minute_ = []

    for i, res in enumerate(results):
        jres = json.loads(res)
        if not 'result' in jres:
            continue
        words = jres['result']
        for count, j in enumerate(words):
            content += f"{j['word']} "
            words_per_minute_.append(j['end'])
   
    if len(words_per_minute_) == 0:
       return  json.dumps({'transcript': "", 'words_per_minute': 0,
                    "syllables": 0, "pauses": 0, "speech_rate": 0,
                    "articulation_rate": 0})

    words_per_minute = [int(i) for i in words_per_minute_]
    k = int(len(words_per_minute)/60)

    for interval in range(k):
        try:
            lst.append(words_per_minute.index(60 * (interval+1)))
        except ValueError:
            continue
    lst_ = list(np.diff(lst))

    try:
        lst_.insert(0, lst[0])
        lst_average = int(np.average(lst_))
    except IndexError:  # catch the exception if the audio file is shorter than 1 minute
        lst_average = (int(len(words_per_minute_)/(words_per_minute_[-1] - words_per_minute_[0]))) * 60

    if get_prosody == 'True':
        x1, x2, x3, x4 = parameters(audio, pratt_path)
        return json.dumps({'transcript': content, 'words_per_minute': lst_average,
                "syllables": x1, "pauses": x2, "speech_rate": x3,
                "articulation_rate": x4})
    elif get_prosody == 'False':
        return json.dumps({'transcript': content, 'words_per_minute': lst_average})
    else:
        return 0


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--audio_file_name", type=str, required=True)
    parser.add_argument("--get_prosody", choices=('True', 'False'), default='True')
    args = parser.parse_args()
    print(transcribe(args.audio_file_name, args.get_prosody))
