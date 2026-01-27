---

# 🎓 Automatic Attendance System (Face Recognition)

An end-to-end automatic attendance system using face detection and recognition. It combines a Node.js + MongoDB backend, two React frontends (Admin and Teacher/Student), and a Python vision server leveraging YOLO-based face detection and dlib embeddings for recognition. The system supports enrollment workflows, course scheduling, real-time class runs, and PDF attendance reports.

![Node.js](https://img.shields.io/badge/Node.js-18+-brightgreen?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4+-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.10+-yellow?style=for-the-badge&logo=python)

---

## ✨ Features
- **Automated attendance** per class via face recognition
- **Enrollment workflow** with admin review; automatic credential dispatch (email-optional)
- **Role-based access**: Admin, Teacher, Student
- **Course management** with scheduling and conflict checks
- **Live class runs**: start/end a class per room and capture presence over time
- **Student photo ingestion** and model updates to improve recognition
- **Attendance analytics** and **exportable PDF reports**

---

## 🧭 Project Structure (key parts)
```
C:\Attendance\
  Backend\            # Express API + Mongo (Mongoose)
    index.js          # App entry with routes + health + diagnostics
    config\db.js      # DB helper (env-driven)
    models\           # User, Teacher, Course, Schedule, etc.
    routes\           # users, courses, teachers, student-photos, enrollment
    services\         # email service(s) for credentials and resets
    reports\          # generated attendance PDFs (served at /reports)

  Frontend\
    admin\            # Admin React app (Vite)
    teacher-student\  # Teacher/Student React app (Vite)

  Server\             # Python vision server and utilities
    runner.py         # Captures frames, detects faces, classifies, posts results
    server.py         # CLI/entry helper (runtime loop)
    config.py         # Model paths and camera endpoints
    util.py           # Vision utilities (embeddings, API calls, IO)
    yolov9-face-detection\  # YOLO inference scripts + weights

  Model\, Weights\    # Pretrained recognition files & dlib shape/model weights
```

---

## ⚙️ Requirements
- Node.js 18+
- Python 3.10+ (with dlib-compatible toolchain)
- MongoDB 6+ (Atlas or local)
- Windows (paths in some scripts use Windows-style separators)

---

## 🔐 Environment Variables
Create a `.env` in `Backend/`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
URL=http://localhost:5000              # Public base URL for backend; used in services/routes

# Optional email (Gmail SMTP - App Password recommended)
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
```

Python vision configuration: edit `Server/config.py` for model/weight paths and camera URLs.

---

## 🚀 Setup & Run
### 1) Install dependencies
```bash
# Backend
cd Backend
npm install

# Frontends
cd ../Frontend/admin && npm install
cd ../teacher-student && npm install
```

For Python:
```bash
cd ../../Server
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r yolov9-face-detection/requirements.txt
# Also ensure dlib, numpy, Pillow, requests are available
pip install dlib numpy Pillow requests
```

### 2) Start services
- Backend API
```bash
cd Backend
npm run dev  # or npm start
```

- Admin frontend (Vite)
```bash
cd Frontend/admin
npm run dev
```

- Teacher/Student frontend (Vite)
```bash
cd Frontend/teacher-student
npm run dev
```

- Vision server (continuous loop capture + detect + post)
```bash
cd Server
python server.py  # or: python runner.py
```


---

## 📡 Backend Overview
Base URL defaults to `http://localhost:5000`.

- Diagnostics
  - `GET /api/test` – basic API check with Mongo status
  - `GET /health` – health info (uptime, Mongo)
  - `GET /` – lists available endpoint groups

- Enrollment (`/api/enrollment`)
  - `POST /submit` – submit enrollment request (name, registrationNumber, email, role, idCardImage)
  - `GET /all|/pending|/approved|/rejected` – request lists
  - `PUT /:id/review` – approve/reject a request
  - `POST /:id/send-credentials` – generates password, creates/updates user, optionally emails credentials

- Users (`/api/users`)
  - `POST /add` – create student
  - `POST /login` – login with `uni_id` and password
  - `GET /:student_id` – student overview with enrolled courses
  - `GET /upcoming/:studentId` – upcoming classes for a student
  - `POST /upload-image` – base64 image upload; processed by Python `Server/upload_img.py`
  - `POST /reset-password` – reset with new password (email optional)

- Teachers (`/api/teachers`)
  - `POST /add`, `POST /login`
  - `GET /:teacher_id` – profile + assigned courses
  - `GET /schedules/upcoming` – all upcoming schedules
  - `GET /schedules/:teacherId` – upcoming schedules for teacher’s courses

- Courses (`/api/courses`)
  - `POST /create` – create course and link students/teacher
  - `GET /` – list
  - `POST /addSchedule` – add class; prevents time conflicts
  - `GET /get_attendance/:course_id` – attendance matrix
  - Class lifecycle per room: `POST /start-class`, `POST /end-class`, `GET /rooms`
  - Reports: `GET /generate_attendance_report/:courseId?requiredMinutes=60` → saves to `Backend/reports/*.pdf` and returns path

- Student Photos (`/api/student-photos`)
  - `POST /upload` – bulk photo ingest by registration number
  - `GET /photo_count/:studentId` – tracked photo count per student
  - Maintenance helpers: `GET /all`, `GET /:registrationNumber` – fetch then delete stored photo records

Reports are served statically at `/reports`.

---

## 🧠 Vision Pipeline (Python)
1. Capture frame(s) from configured cameras or local webcam.
2. Detect faces via YOLOv9 script: `Server/yolov9-face-detection/yolov9/detect.py`.
3. Convert detections to dlib rectangles; compute embeddings; classify against stored descriptors in `Model/`.
4. Post results back to the backend to update attendance for the room/class in progress.

Key entry points:
- `Server/runner.py` – main loop invoking detection and posting results
- `Server/config.py` – edit model/weights and camera endpoints
- `Server/runner.py` → `yolo_detect()` uses a subprocess to run `detect.py` with `best.pt`

Ensure the following exist (paths in `Server/config.py`):
- `Model/face_descriptors_final.npy`, `Model/mp_final.pkl`
- `Weights/shape_predictor_68_face_landmarks.dat`, `Weights/dlib_face_recognition_resnet_model_v1.dat`
- `Server/yolov9-face-detection/yolov9/best.pt`

---



## 🧪 Local Development Tips
- Use `npm run dev` in `Backend/` for auto-reload via nodemon.
- Vite frontends run on random ports; configure frontend API base URL to point to the backend `URL`.
- Test health at `GET /health` and smoke test at `GET /api/test`.
- Generated reports appear under `Backend/reports/` and can be downloaded via the path returned.

---


## 🤝 Contributing
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-change`
3. Commit: `git commit -m "feat: your summary"`
4. Push: `git push origin feat/your-change`
5. Open a PR

---

## 📄 License
MIT

---
