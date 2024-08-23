from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

api_key = app.config['API_KEY']



client = Groq(
    api_key=api_key
)


@app.route('/generateAiAdvice', methods=['POST'])
def generateAiAdvice():
    prompt = request.get_json()['prompt']

    chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": f"I will give you a collection of journal entries which describe my days using decision trees. Give me some advice on how to make better choices in the future based on the choices I have already made:  {prompt}",
        }
    ],
    model="llama3-70b-8192",
    )

    response = {"response": chat_completion.choices[0].message.content}
    
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)