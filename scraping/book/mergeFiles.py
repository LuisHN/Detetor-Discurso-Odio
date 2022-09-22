import os
import glob
os.chdir("imgTotext")

extension = 'txt'
all_filenames = [i for i in glob.glob('*.{}'.format(extension))]

with open("output_file.txt", "w") as outfile:
    for filename in all_filenames:
        with open(filename, mode="r", encoding="utf-8") as infile:
            contents = infile.read()
            contents = contents + ";1\n"
            outfile.write(contents)