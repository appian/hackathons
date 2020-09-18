from http.server import HTTPServer, BaseHTTPRequestHandler
from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/fizzbuzz/<int:max_int>')
def get_fizzbuzz(max_int):
    return fizzbuzz(max_int)

def fizzbuzz(max_int):
    ans = str()
    for i in range(max_int+1):
        if i % 3 == 0 and i % 5 == 0:
            ans = ans + "fizzbuzz"
            continue
        elif i % 3 == 0:
            ans = ans + "fizz"
            continue
        elif i % 5 == 0:
            ans = ans + "buzz"
            continue
        ans = ans + str(i)
    return ans

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0',port=8080)
