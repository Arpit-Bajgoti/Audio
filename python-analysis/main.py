import argparse
import json
from ASR import transcribe
from pronounciation_score import compare

parser = argparse.ArgumentParser()
parser.add_argument("--word", type=str, required=True)
parser.add_argument("--s1", type=str, required=True)
parser.add_argument("--s2", type=str, required=True)
args = parser.parse_args()


def scores():
    score_accuracy, transcript = transcribe(args.word, args.s2)
    score_diction = 0
    total_score = 0
    if score_accuracy != 0:
        score_diction = compare(args.s1, args.s2)
        total_score = round((score_accuracy / 100 * 30) + (score_diction / 100 * 70), 2)
    return json.dumps({"transcript": transcript, "accuracy_score": score_accuracy, "diction_score": score_diction, "total_score": total_score})


print(scores())
