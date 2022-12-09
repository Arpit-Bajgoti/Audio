# Steps to setup the Kaldi Toolkit:
1. Clone the repo https://github.com/kaldi-asr/kaldi.git
2. Clone the repo https://github.com/tbright17/kaldi-dnn-ali-gop.git
3. Put the folders under src into kaldi/src (replace Makefile).
4. cd kaldi/tools  
5. execute extras/check_dependencies.sh  
6. type:  make ( this will take a few minutes to complete)
7. cd kaldi/src
8. ./configure
9. type: make depend
10. type: make ( this will take around 30 minutes to complete )
11. 

## The above steps download the requred files to setup the kaldi toolkit in your environment

# Steps to setup the Project:
1. cd kaldi/egs/gop_speechocean762
2. replace the run.sh file with the file given in th edrive link
3. copy the storage07 folder from drive to the home directory
4. similarly put all the files from the drive file to the kaldi-dnn-ali-gop directory ( this directory contains the script to run the necessary steps involved in our project).
5. pip install kaldiio
