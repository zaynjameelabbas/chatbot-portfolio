from flask import Flask, render_template, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)

# Initialize model and tokenizer
model_name = "microsoft/DialoGPT-small"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json['message']
    
    # Encode the input text and create attention mask
    inputs = tokenizer.encode_plus(
        user_message,
        return_tensors='pt',
        add_special_tokens=True,
        return_attention_mask=True
    )
    
    # Generate response with attention mask
    chat_response = model.generate(
        inputs['input_ids'],
        attention_mask=inputs['attention_mask'],
        max_length=1000,
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=3,
        do_sample=True,
        top_k=100,
        top_p=0.7,
        temperature=0.8
    )
    
    # Decode the response
    response = tokenizer.decode(chat_response[0], skip_special_tokens=True)
    print("User Message: ", user_message)
    print("Response: ", response)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(debug=True)