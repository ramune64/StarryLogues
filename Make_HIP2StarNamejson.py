import json
import os
import re
import pandas as pd
"""
あるもの:
HR:星の名前
HD:星の名前
HR:HIP
HD:HIP
欲しいもの:

HIP:星の名前
"""



HRHDfile = "src/star_name_japanese.txt"


outputfile = "src/hip2star_name_japanese.json"


print(os.path.exists(HRHDfile))
HRHD_data = []
with open(HRHDfile,"r",encoding="UTF-8") as f:
    lines = f.readlines()
    num_skip = 0
    num = 0
    for line in lines:
        num += 1
        parts = line.split("	")
        parts = [i for i in parts if i != "" ][1:3]
        idx = 0
        for part in parts:
            parts[idx] = re.sub(r"\[.*?\]", "", part).replace("＊","")
            idx += 1
        if not "HD" in parts[1] and not "HR" in parts[1]:
            #print(parts[1])
            num_skip+=1
        else:
            HRHD_data.append({
                "JaName":parts[0],
                "HDHR":parts[1]
            })
#サイトに有用そうな表(Bright Star Catalogue (Rev.4))(くそでか)があったのでスクレイピングで拾う。
url = "https://www.kotenmon.com/star/catalog/hip_4.html"
data = pd.read_html(url, header = 0)
#print(data[1].tail())
BrightStarCatalogueData = data[1].dropna()
HIP2JaName = []
for HRHD in HRHD_data:
    HRDR_num = HRHD["HDHR"]
    JaName = HRHD["JaName"]
    if "HR" in HRDR_num:
        #print(HRDR_num.replace("HR ",""))
        try:
            hip_obj = BrightStarCatalogueData[BrightStarCatalogueData["HR"]==int(HRDR_num.replace("HR ",""))]["HIP"]
            hip_num = hip_obj.item()
            hip_key = hip_obj.keys()
        except ValueError:
            continue
        #print(hip_num)
    elif "HD" in HRDR_num:
        #print(HRDR_num.replace("HD ",""))
        try:
            hip_obj = BrightStarCatalogueData[BrightStarCatalogueData["HD"]==float(HRDR_num.replace("HD ",""))]["HIP"]
            hip_num = hip_obj.item()
            hip_key = hip_obj.keys()
        except ValueError:
            continue
    vmag = BrightStarCatalogueData["Vmag"][hip_key].item()
    if vmag <= 2.5:
        HIP2JaName.append({
            "hip_number":int(hip_num.replace("A","")),#ミザール回避専用
            "name":JaName
        })
print(len(HIP2JaName))
    #print()

with open(outputfile, "w", encoding="utf-8") as f_out:
    json.dump(HIP2JaName, f_out, indent=2,ensure_ascii=False)

#様子見
print(f"エラー数:{num_skip}/{num}")