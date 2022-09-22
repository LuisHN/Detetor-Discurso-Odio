import os
import glob
os.chdir("../files")

with open('class_4_duplicates.txt', mode="r",encoding="utf8") as result:
    lines = result.readlines()
    uniqlines = set(lines)
    with open('class_4_clean.txt', 'w',encoding="utf8") as rmdup:
        for line in uniqlines:
                rmdup.write(line)