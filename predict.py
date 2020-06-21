#-*- coding:utf-8 -*-

import numpy as np
import pandas as pd
import time
import sys
import base64

from sklearn.ensemble import RandomForestClassifier

from sklearn import metrics
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc
from sklearn.model_selection import train_test_split, cross_val_score

import requests, json

col_li = ['s_weather','s_age','s_gender','직업_간호사','직업_건설업','직업_공무원','직업_군인','직업_농업','직업_무직','직업_서비스업','직업_연구원','직업_자영업자','직업_주부','직업_학생','직업_한의사','직업_회계사','직업_회사원']

def machin(py_age, py_gender, py_job, predict_col):
    idx = 0
    new_df = []

    for i in range(0, len(col_li)):
        if (col_li[i] == ('직업_' + py_job)):
            idx = i

    for i in range(0, 17):
        if (i == idx):
            new_df.append(1)
        elif (i == 0):
            new_df.append(20)
        elif (i == 1):
            new_df.append(int(py_age))
        elif (i == 2):
            if (py_gender == '여성'):
                new_df.append(1)
            else:
                new_df.append(0)
        else:
            new_df.append(0)

    x = pd.concat([shower_data['s_weather'], shower_data['s_age'], shower_data['s_gender'], pd.get_dummies(shower_data['s_job'], prefix='직업')], axis=1)
    y = shower_data[predict_col]

    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=44)
    # print("x_train : {}, x_test : {}, y_train : {}, y_test : {}".format(x_train.shape, x_test.shape, y_train.shape, y_test.shape))
    model = RandomForestClassifier()
    model.fit(x_train, y_train)

    # print("train socre : {}".format(model.score(x_train, y_train)))
    # print("test socre : {}".format(model.score(x_test, y_test)))
    # print("컬럼들의 중요도 : {}".format(model.feature_importances_.sort()))

    tmp = pd.DataFrame(data=new_df).T
    tmp.columns = col_li


    # 정밀도, 재현율, f1 스코어, 서포트를 알려준다.
    if (predict_col == 's_temp'):
        result = str(model.predict(tmp))[2:-2]
    else:
        result = str(model.predict(tmp))[1:-1]

    new_df = []

    return result

shower_data = pd.read_csv('./public/survey_data.csv', encoding='utf-8')
shower_data.head()

# 남, 여 각각 0과 1로 변경
shower_data.loc[shower_data['s_gender']=='남', 's_gender'] = 0
shower_data.loc[shower_data['s_gender']=='여', 's_gender'] = 1
#shower_data.head()

# 입욕제 유무를 숫자로 변경
shower_data.loc[shower_data['s_perfume']=='무', 's_perfume'] = 0
shower_data.loc[shower_data['s_perfume']=='유', 's_perfume'] = 1
#shower_data.head()

shower_data['s_gender'] = pd.to_numeric(shower_data['s_gender'])
shower_data['s_perfume'] = pd.to_numeric(shower_data['s_perfume'])
shower_data.drop(['s_end'], axis=1, inplace=True)
shower_data.head()

start = machin(sys.argv[1], sys.argv[2], sys.argv[3], 's_start')
during = machin(sys.argv[1], sys.argv[2], sys.argv[3], 's_during')
temp = machin(sys.argv[1], sys.argv[2], sys.argv[3], 's_temp')

print(str(start+'/'+during+'/'+temp))