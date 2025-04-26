import json
import os
import re

inputfile = "src/constellations_name_table.txt"
outputfile = "src/constellations_name_table.json"

constellations = []

with open(inputfile,"r",encoding="UTF-8") as f:
    lines = f.readlines()
    num_skip = 0
    num = 0
    for line in lines:
        num += 1
        parts = line.split("	")[:3]
        idx = 0
        for part in parts:
            parts[idx] = re.sub(r"\（.*?\）", "", part).replace("＊","")
            idx += 1
        constellations.append({
            parts[2]:{
                "JaName":parts[0],
                "Abbreviations":parts[1],
            }
        })
        #print(parts)

with open(outputfile, "w", encoding="utf-8") as f_out:
    json.dump(constellations, f_out, indent=2,ensure_ascii=False)