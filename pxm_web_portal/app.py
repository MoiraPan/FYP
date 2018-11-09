import numpy as np
import pandas
from pandas import DataFrame
from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route("/")
def chart():
    df = pandas.read_csv('data/data_pxm.csv')
    allValues = {}
    hour = df['hour']
    values_sensor = df['SENSOR']
    allValues = [values_sensor, hour]
    return render_template('charts.html', values=allValues)

if __name__ == "__main__":
    app.run()
