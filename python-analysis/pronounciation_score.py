import parselmouth
import numpy as np
from fastdtw import fastdtw
from scipy.spatial.distance import euclidean


def compare(ideal_audio, reference, threshold=8000):
    s1 = parselmouth.Sound(ideal_audio)
    s2 = parselmouth.Sound(reference)
    pitch_s1 = s1.to_pitch()
    pitch_s2 = s2.to_pitch()
    pitch_diff_values_s1 = np.diff(np.trim_zeros(pitch_s1.selected_array["frequency"]))
    pitch_diff_values_s2 = np.diff(np.trim_zeros(pitch_s2.selected_array["frequency"]))
    if len(pitch_diff_values_s2) == 0:
        return 0
    dtw_comparision, path = fastdtw(pitch_diff_values_s1, pitch_diff_values_s2, dist=euclidean)
    dtw_comparision = np.exp(((threshold - dtw_comparision)/threshold))
    threshold = np.exp(1)
    score = round(dtw_comparision/threshold * 100, 2)
    # score = round(((threshold - dtw_comparision)/threshold) * 100, 2)
    return score
