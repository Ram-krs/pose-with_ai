import os

from flask import Flask, flash, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

import database as db
from database import create_user, get_user_by_email

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "pose-with-ai-secret")

db.init_app(app)


@app.route("/")
def home():
    if "user_id" not in session and "guest" not in session:
        return redirect(url_for("login"))

    return render_template("index.html", user_name=session.get("user_name", "Guest"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")

        user = get_user_by_email(email)
        if user and check_password_hash(user["password"], password):
            session.clear()
            session["user_id"] = user["id"]
            session["user_name"] = user["name"]
            session["is_guest"] = False
            return redirect(url_for("home"))

        flash("Invalid email or password.", "error")

    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")

        if not name or not email or not password:
            flash("Please fill in all fields.", "error")
        elif password != confirm_password:
            flash("Passwords do not match.", "error")
        elif get_user_by_email(email):
            flash("An account with this email already exists.", "error")
        else:
            hashed_password = generate_password_hash(password)
            create_user(name, email, hashed_password)
            flash("Account created successfully. Please log in.", "success")
            return redirect(url_for("login"))

    return render_template("register.html")


@app.route("/guest")
def guest_mode():
    session.clear()
    session["guest"] = True
    session["user_name"] = "Guest"
    session["is_guest"] = True
    return redirect(url_for("home"))


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )