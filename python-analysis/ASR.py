from vosk import Model, KaldiRecognizer, SetLogLevel
import os
import subprocess
import json
import enchant

SetLogLevel(-1)


def transcribe(word, s2):
    if not os.path.exists("model"):
        print("ERROR!! Cannot load VOSK model")
        exit(1)

    sample_rate = 16000
    model = Model("model")
    rec = KaldiRecognizer(model, sample_rate)
    rec.SetWords(True)

    process = subprocess.Popen(['ffmpeg', '-loglevel', 'quiet', '-i', s2,
                                '-ar', str(sample_rate), '-ac', '1', '-f', 's16le', '-'],
                               stdout=subprocess.PIPE)

    WORDS_PER_LINE = 7
    results = []
    lst = []
    while True:
        data = process.stdout.read(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            results.append(rec.Result())
    results.append(rec.FinalResult())

    for i, res in enumerate(results):
        jres = json.loads(res)
        if not 'result' in jres:
            continue
        words = jres['result']
        for j in range(0, len(words), WORDS_PER_LINE):
            line = words[j: j + WORDS_PER_LINE]
            content = " ".join([l['word'] for l in line])
            lst.append(content)
    if len(lst) == 0:
        print("lst index 0")
        return 0
    acc_score = round((len(word) - enchant.utils.levenshtein(word, " ".join(lst))) / len(word) * 100, 2)
    if acc_score < 30:
        acc_score = 0
    return acc_score, " ".join(lst)
