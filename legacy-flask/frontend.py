from pickle import GET
import flask
from flask import Flask , render_template , request , redirect, url_for
from datetime import timedelta, date, datetime
import os
from flask_cors import CORS


app_front = Flask(__name__)
CORS(app_front)



@app_front.route("/")        
def informationpage():
    return render_template('landing.html' )

  
    # if request.method == "GET":
        # user_data = request.form
        # status_code = user_data['status']
        # print(status_code)
        # if status_code == 'ok':
        #     print(status_code)
    # return redirect(url_for('mat'))
    
# @app_front.route("/mat" )        
# def mat():
    # if request.method == "GET":
        # user_data = request.form
        # status_code = user_data['status']
        # print(status_code)
        # if status_code == 'ok':
        #     print(status_code)
     
    
# @app_front.after_request
# def after_request(response):
#     header = response.headers
#     header['Access-Control-Allow-Origin'] = '*'
#     header['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
#     header['Access-Control-Allow-Methods'] = 'OPTIONS, HEAD, GET, POST, DELETE, PUT'
#     return response



if __name__ == '__main__':
    app_front.run( port=8000, debug=True)