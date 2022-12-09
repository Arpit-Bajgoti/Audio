from parselmouth.praat import call, run_file


def parameters(sound, praat_path):
    path = 'grid_files/'
    objects = run_file(praat_path, -20, 2, 0.3, "yes", sound, path, 80, 400, 0.01, capture_output=True)
    z1 = str(objects[1])
    z2 = z1.strip().split()
    return int(z2[0]), int(z2[1]), int(z2[2]), int(z2[3])
