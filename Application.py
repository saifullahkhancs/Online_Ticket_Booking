
from pickle import GET
import flask
from flask import Flask , render_template , request, url_for , redirect
from datetime import timedelta, date, datetime
import os
from flask_cors import CORS
from flask_mysqldb import MySQL




app = Flask(__name__)
CORS(app)

app.config["MYSQL_HOST"] = 'localhost'        # connecting to the database
app.config["MYSQL_USER"] = 'root'
app.config["MYSQL_PASSWORD"] = '7117755.'
app.config["MYSQL_DB"] = 'travel'
mysql = MySQL(app)

@app.route("/" , methods = ['GET', 'POST'])        
def index():
    if request.method == "POST":
        print("yes")
        return render_template('thank.html')
    return render_template('landing.html' )
    
        

@app.route("/signup" , methods = ['GET', 'POST'])        
def signup():
        if request.method == "POST":
            user_data = request.form
            first_name = user_data['first_name']
            last_name = user_data['last_name']
            name = first_name + last_name
            user_name = user_data['sig_username']
            email = user_data['email']
            sig_password = user_data["sign_pass"]
            phone = user_data['phone']
            
            
            cur = mysql.connection.cursor()            # make the pointer so we apply the database opertaions
            cur.execute('select * from signup where user_name=%s', [user_name])   # check users exist or not
            result = cur.fetchall() 
            
             #       ---    check wether the username exists  if  exists we remain on the same page  ---
        if len(result) != 0:
            return {'status': 'not_ok'}
        else:
            cur.execute('insert into signup(id, U_name , user_name , passwords , email  , phone ) \
            values (NULL,%s,%s,%s,%s,%s)', (name, user_name , sig_password , email , phone ))
            cur.connection.commit()
            cur.close()
            return {'status': 'ok'}
        
@app.route("/login", methods=['POST', 'GET'])
def login():
    if request.method == "POST":
        login_data = request.form
        name = login_data["username"]
        password = login_data["password"]
        cur = mysql.connection.cursor()
        cur.execute("select * from signup where user_name=%s and passwords = %s", (name, password))
        user = cur.fetchall()
        
          # -----  check the correct login --------
        if len(user) != 0:
            return {'status': 'ok'}
        else:
            return {'status': 'not_ok'}
            
                       

@app.route("/dashboard" , methods = ['GET', 'POST'])        
def dashboard():
    if request.method == 'POST':
        return  {'status': 'ok'}    
    return render_template("dashboard.html")



@app.route("/ticket" , methods = ['GET', 'POST'])        
def ticket():
    print("ticket called called")
    return render_template("ticket.html")


"how to create a requiremnt file of your project write this command in the terminal  "

"------------------- pip freeze > req.txt ----------------------"

"pip freeze :- elist the requiremnt of the file needed "
" > req.txt :-  ''>'' save the info into the file name ''req.txt''   "



if __name__ == '__main__':
    app.run( debug=True)