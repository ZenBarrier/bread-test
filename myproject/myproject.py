from flask import Flask, request, send_from_directory

""" try:
    import os
    mongo_uri = os.environ['MONGODB_URI']
except:
    from secrets import mongo_uri """

application = Flask(__name__, static_folder="static")


@application.route('/', defaults={'path': 'index.html'})
@application.route("/<path:path>")
def static_files(path):
    return send_from_directory('static',path)

@application.route("/")
def chat():
    return "Hello World"

if __name__ == "__main__":
    application.run()