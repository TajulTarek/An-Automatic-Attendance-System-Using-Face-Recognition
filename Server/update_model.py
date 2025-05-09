import requests
import os
import numpy as np
import cv2
import dlib
import pickle
import time

from datetime import datetime
from io import BytesIO
from PIL import Image

# Paths
shape_predictor_path = './Weights/shape_predictor_68_face_landmarks.dat'
face_model_path = './Weights/dlib_face_recognition_resnet_model_v1.dat'
descriptors_path = './Model/face_descriptors_final.npy'
mapping_path = './Model/mp_final.pkl'
crop_base_path = "./Attendance/cropped/train/"

baseUrl="https://an-automatic-attendance-system-using.onrender.com"

# Utilities
def load_mp(file_path):
    with open(file_path, 'rb') as f:
        return pickle.load(f)

def save_mp(mp, file_path):
    with open(file_path, 'wb') as f:
        pickle.dump(mp, f)

def download_image(url):
    response = requests.get(url)
    return Image.open(BytesIO(response.content)).convert("RGB")

def process_images_from_api(api_url):
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        data = response.json()["data"]

        # Load models
        detector = dlib.get_frontal_face_detector()
        sp = dlib.shape_predictor(shape_predictor_path)
        facerec = dlib.face_recognition_model_v1(face_model_path)

        # Load existing data
        if os.path.exists(descriptors_path):
            descriptors = np.load(descriptors_path)
        else:
            descriptors = np.empty((0, 128))

        if os.path.exists(mapping_path):
            mp = load_mp(mapping_path)
        else:
            mp = {}
        
        # Dictionary to track images processed per student
        student_image_count = {}

        for student in data:
            reg_num = student["registrationNumber"]
            folder_path = os.path.join(crop_base_path, reg_num)
            os.makedirs(folder_path, exist_ok=True)

            # Initialize image counter for this student
            student_image_count[reg_num] = 0

            for url in student["photos"]:
                image = download_image(url)
                image_np = np.array(image, 'uint8')
                faces = detector(image_np, 1)

                for face in faces:
                    x, y, w, h = face.left(), face.top(), face.width(), face.height()
                    cropped_face = image_np[y:y+h, x:x+w]
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S%f")
                    face_filename = os.path.join(folder_path, f"face_{timestamp}.jpg")
                    cv2.imwrite(face_filename, cv2.cvtColor(cropped_face, cv2.COLOR_RGB2BGR))

                    shape = sp(image_np, face)
                    face_desc = facerec.compute_face_descriptor(image_np, shape)
                    face_desc = np.asarray(face_desc, dtype=np.float64).reshape(1, -1)

                    descriptors = np.concatenate((descriptors, face_desc), axis=0)
                    mp[face_filename] = reg_num

                    # Increment image count for the student
                    student_image_count[reg_num] += 1

        # Save updated files
        np.save(descriptors_path, descriptors)
        save_mp(mp, mapping_path)

        print("Successfully processed and saved all embeddings.")
        
        # Return the image count for each student
        return student_image_count

    except Exception as e:
        print(f"Error: {e}")
        return None

# Usage
api_url = baseUrl+"/student-photos/all"

# Run in a while True loop with a 5-minute delay
while True:
    student_image_count = process_images_from_api(api_url)
    if student_image_count:
        # Make API call to backend with the result
        backend_api_url = baseUrl+"/student-photos/updateImageCount"
        response = requests.post(backend_api_url, json=student_image_count)
        print(response.status_code, response.text)
    else:
        print("No image count to update.")
    
    print("Waiting for 5 minutes before the next cycle...")
    time.sleep(300)  # Delay for 5 minutes (300 seconds)
