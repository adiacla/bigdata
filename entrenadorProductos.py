# -*- coding: utf-8 -*-
""" train.py

Automatically generated by Colaboratory.

"""

from tflite_model_maker import image_classifier
from tflite_model_maker.image_classifier import DataLoader

import tensorflow as tf
assert tf.__version__.startswith('2')

import matplotlib.pyplot as plt
import numpy as np

data = DataLoader.from_folder('/content/drive/MyDrive/Colab Notebooks/imagenes/')


model = image_classifier.create(data)

loss, accuracy = model.evaluate(data)


model.export(export_dir='.')

