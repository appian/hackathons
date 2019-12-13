from http.server import HTTPServer, BaseHTTPRequestHandler

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write("<html><h1>Kubernetes (and Appian) is pretty cool.</h1></html>".encode())

if __name__ == '__main__':
    server_address = ('', 8080)
    print('Listening on {}'.format(server_address))
    server = HTTPServer(server_address, RequestHandler)
    server.serve_forever()
