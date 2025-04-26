import json
import os

inputfile = "src/star_table.txt"
outputfile = "src/star_table.json"


stars = []
print(os.path.exists(inputfile))
with open(inputfile,"r",encoding="UTF-8") as f:
    all_lines = f.readlines()
    indexes,lines = all_lines[0],all_lines[1:]
    indexes = indexes.split("|")[1:-1]
    num_skip = 0
    num = 0
    for line in lines:
        num += 1
        parts = line.split("|")[1:-1]
        if any(p.strip() == "" for p in parts):#どれか1つでも空白だったらスキップ
            num_skip+=1
            print("スキップ")
            continue
        star = {
            indexes[0].strip():float(parts[0].strip()),
            indexes[1].strip():float(parts[1].strip()),
            indexes[2].strip():int(parts[2].strip()),#hip_number
            indexes[3].strip():float(parts[3].strip()),#vmag
            indexes[4].strip():float(parts[4].strip()),#ra_deg
            indexes[5].strip():float(parts[5].strip()),#dec_deg
            indexes[6].strip():float(parts[6].strip())#bv_color
        }
        stars.append(star)
#様子見
print(f"スキップ回数:{num_skip}/{num}")
print(f"スキップ率:{num_skip/num*100}%")

with open(outputfile, "w", encoding="utf-8") as f_out:
    json.dump(stars, f_out, indent=2)