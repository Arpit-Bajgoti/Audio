# audio-analize

## Steps
1. ASR using VOSK model given in link, JSON file created is trimmed to extract the transcript.
2. Transcribe function takes two arguments namely the base file and the derired transcript and returns a levenshtein distance score between the two strings
   converted to percentage and rounded to precision of two decimal places.
3. Compare function takes two arguments, the base file and the comparing audio file and returns the percentage score of similarity between the two as follows:
   1. base and compare file are converted to pitch based f0 frequency series using praat-parselmouth library.
   2. np.diff function is used to construct a vector of difference between adjacent values in pitches to capture the change in f0 frequency.
   3. the two files are matched using dynamic time wrapping algorithm to get a euclidian distance.
   4. the l2 norm is passed to a exponential function to get a non-linear distribution which is converted to percentage according to a threshold that is an
      experimental hyperparameter.
4. main.py imports these two afforesaid functions from ASR.py and pronounciation_score.py to calculate a total score in composition of 3:7 from the two scores 
   and returns a dictionary consisting of accuracy_score, diction_score and total_score.


## Usage
The main.py file is parsed to use the arguments as commands:
1. --word  ( takes the derised word to pronounce)
2. --s1 ( sound file of the base file)
3. --s2 ( sounf file to compare)
4. returns or prints dictionay containing accuracy_score, diction_score and total_score.

## link to model: 
https://alphacephei.com/vosk/models/vosk-model-en-us-daanzu-20200905.zip
