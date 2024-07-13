from flask import Flask, render_template, send_from_directory,request ,jsonify

from PIL import Image
import numpy as np
import os

import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import custom_object_scope
from tensorflow.keras.layers import Layer


# ? model ====================================
class GrayscaleToRGB(Layer):
    def __init__(self, **kwargs):
        super(GrayscaleToRGB, self).__init__(**kwargs)

    def call(self, inputs):
        return tf.image.grayscale_to_rgb(inputs)

    def get_config(self):
        base_config = super(GrayscaleToRGB, self).get_config()
        return base_config

with custom_object_scope({'GrayscaleToRGB': GrayscaleToRGB}):
    model = load_model('../model/model.h5')


# ? Flask ============================================


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)



@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Allow JPEG formats
    if file and (file.filename.endswith('.jpg') or file.filename.endswith('.jpeg')):
        img = Image.open(file.stream)
        
        # resize the image to 28x28
        img = img.resize((28, 28))
        # Convert to RGB to avoid issues with transparency
        img = img.convert('RGB')
        
        # convert to grayscale
        img = img.convert('L')
        
        # get only the first channel
        img_arr = img.getchannel(0)
        
        # convert it to numpy
        img_arr = np.array(img_arr)

   
        img_arr = img_arr.reshape((1,28, 28)).astype(np.float32) / 255.0
        
        pred = model.predict(img_arr)
        print(pred)

        return jsonify({'message': f"{np.argmax(pred)}"}), 200

    return jsonify({'error': 'Unsupported file format. Only JPEG files are allowed.'}), 400
