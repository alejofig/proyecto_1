import random
import string

def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

def generate_random_user():
    username = generate_random_string(5)
    email = f"{generate_random_string(5)}@example.com"
    password = "135.Uniandes24"

    user_data = {
        "username": username,
        "email": email,
        "password": password
    }

    return user_data