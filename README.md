# CTF

# 🔐 CTF Platform (Capture The Flag)

A fully functional **Capture The Flag (CTF)** web application built using **HTML, CSS, JavaScript, PHP, and MySQL (XAMPP)**.  
This project allows players to register, log in, view challenges, and submit flags.  
An **admin panel** is included to monitor player activities, manage challenges, and analyze performance.

## 🧭 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Guide](#-setup-guide)
- [Database Setup](#-database-setup)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [Future Improvements](#-future-improvements)
- [License](#-license)

## 🚀 Overview
This CTF platform simulates a cybersecurity competition environment where participants solve security-related challenges to earn points.  
Players can:
- Register and log in.
- View and attempt challenges.
- Submit flags for verification.
- View their score and rank.

Admins can:
- Add, edit, or delete challenges.
- Monitor user activity.
- View submission statistics and leaderboard.

## ⚙️ Features

### 👨‍💻 Player Features
- Register / Login system.
- Challenge list loaded dynamically from the database.
- Flag submission with instant feedback.
- Points tracking and leaderboard.
- Responsive UI for all devices.

### 🧑‍💼 Admin Features
- Secure login system.
- Dashboard overview (total users, solved challenges, etc.).
- Add, update, and delete challenges.
- Manage user activity.
- Real-time submission logs.

## 🧰 Tech Stack
| Category | Technology |
|-----------|-------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | PHP (XAMPP) |
| Database | MySQL |
| Server | Apache (via XAMPP) |
| Styling | Custom CSS / Bootstrap (optional) |


---

## 🛠️ Setup Guide

### Step 1: Install XAMPP
- Download and install [XAMPP](https://www.apachefriends.org/index.html).
- Start **Apache** and **MySQL** modules in the control panel.

### Step 2: Place Project Files
- Copy the entire project folder (`CTF-Platform/`) into:

### Step 3: Configure Database
- Open **phpMyAdmin** from XAMPP.
- Create a new database named `ctf_db`.
- Import the file located at:

