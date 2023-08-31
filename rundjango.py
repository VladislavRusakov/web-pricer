import subprocess
LOCAL_IP = '0.0.0.0'
PORT = '80'

# subprocess.run(["env\scripts\\activate.bat"])
subprocess.run(["python", "manage.py", "runserver", f"{LOCAL_IP}:{PORT}"])
