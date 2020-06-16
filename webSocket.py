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

def machin(predict_col):
    x = pd.concat([shower_data['s_weather'], shower_data['s_age'], shower_data['s_gender'], pd.get_dummies(shower_data['s_job'], prefix='직업')], axis=1)
    y = shower_data[predict_col]

    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=44)
    # print("x_train : {}, x_test : {}, y_train : {}, y_test : {}".format(x_train.shape, x_test.shape, y_train.shape, y_test.shape))
    model = RandomForestClassifier()
    model.fit(x_train, y_train)

    # print("train socre : {}".format(model.score(x_train, y_train)))
    # print("test socre : {}".format(model.score(x_test, y_test)))
    # print("컬럼들의 중요도 : {}".format(model.feature_importances_.sort()))

    # 정밀도, 재현율, f1 스코어, 서포트를 알려준다.
    if (predict_col == 's_temp'):
        result = str(model.predict(x_test.iloc[39:40,]))[2:-2]
    else:
        result = str(model.predict(x_test.iloc[39:40,]))[1:-1]

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

start = machin('s_start')
during = machin('s_during')
temp = machin('s_temp')

print(str(start+'/'+during+'/'+temp))

# data = {}
# headers = {}
# url = 'http://i-tub.herokuapp.com/py'

# res = requests.post(url, json=data, headers=headers)

# # HTTP CODE
# print(res.status_code)

# # HTTP 응답 원문
# print(res.text)

# # HTTP 요청 값
# print(res.request, res.request.body, res.content)\

# try:
#     result = res.json()
#     print(result)
#     tmp = machin('s_temp')
#     print(json.dumps(tmp))

# except Exception as e:
#     result = { success : false, msg : "no good" }
