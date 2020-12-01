from flask import Flask
from fizzbuzz import fizzbuzz

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/fizzbuzz/<int:max_int>')
def get_fizzbuzz(max_int):
    return fizzbuzz(max_int)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=8080)
