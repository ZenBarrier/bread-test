from flask import Flask, request, send_from_directory, jsonify
from settings import BREAD_SECRET

application = Flask(__name__, static_folder="static")


@application.route('/', defaults={'path': 'index.html'})
@application.route("/<path:path>")
def static_files(path):
    return send_from_directory('static',path)

@application.route("/hello")
def hello():
    return "Hello World"

@application.route("/tax", methods=['POST'])
def getTax():
    taxes = dict()
    taxes["NY"] = .05
    request_json = request.get_json()
    state = request_json["shippingAddress"]["state"]
    price = request_json["total"]
    tax_amount = price * taxes.get(state, 0)
    return jsonify(tax_amount)

@application.route("/shipping", methods=['POST'])
def getShipping():
    shipping = [
        {"typeId":"2day", "cost":2500, "type":"Two Day Shipping"},
        {"typeId":"1day", "cost":7500, "type":"Overnight Shipping"}
    ]
    return jsonify(shipping)

if __name__ == "__main__":
    application.run()