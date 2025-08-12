# Admin Application

A full-stack Admiin application built with Django REST Framework backend and React frontend, featuring user authentication, page management, comments, and permissions.

## Features

- **User Authentication**
  - JWT-based login/logout
  - Password reset via OTP
  - Protected routes

- **Page Management**
  - Create, read, update, and delete wiki pages
  - Rich text content support

- **Comments System**
  - Add comments to pages
  - View comment history

- **Permissions**
  - Control page access levels
  - User role management

- **User Profiles**
  - View and edit personal information
  - Change password

## Technologies Used

### Backend
- Python 3.10+
- Django 4.2
- Django REST Framework 3.14
- SimpleJWT for authentication

### Frontend
- React 18
- React Router 6
- Axios for API calls
- Formik + Yup for forms

## Installation
- pip install -r requirements.txt

## Create and activate virtual environment
- python -m venv venv
- venv\Scripts\activate     

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Johhannn/svg.git
   cd super-admin/backend
