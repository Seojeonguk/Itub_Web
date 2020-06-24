import csv
import sys

f= open('./public/survey_data.csv','a',newline='')
wr = csv.writer(f)

wr.writerow([sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6],sys.argv[7],sys.argv[8],sys.argv[9],sys.argv[10]])
            
f.close()
