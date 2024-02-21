from flask import Flask, request, jsonify
app = Flask(__name__)
import joblib
from flask_cors import CORS

CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/predict", methods=['POST'])
def predict():
    try:
        valid_models = ['tesla', 'netflix', 'amazon', 'samsung', 'apple', 'meta']
        user_input = request.get_json(force=True)['model_name']

        if user_input not in valid_models:
            raise ValueError(f"Invalid model name '{user_input}'. Choose from: {', '.join(valid_models)}.")

        model, df = joblib.load(f'pkl/{user_input.lower()}.pkl')

        dataf={}
        for i in range(0,len(df.index)):
            dataf[df.index[i]]=df.values[i][3]

        closes=[]
        for i in model.index:
            closes.append(dataf[i])
        response=[]
        for i in range(0,len(closes)):
            response.append({
            'close': closes[i],
            'date': model.index[i].strftime('%Y-%m-%d'),
            'predicted': round(model.values[i], 4)
            })

        return jsonify(response)

    except ValueError as e:
        return jsonify({'error': str(e), 'message': 'Invalid model name.'})



if __name__ == "__main__":
    app.run(debug=True)