import subprocess
import os

def run_tsc():
    cwd = r"c:\Users\نجم التقنية\Desktop\Hoodtrading\SaaS-Boilerplate"
    process = subprocess.Popen(['npm', 'run', 'check-types'], cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
    stdout, _ = process.communicate()
    print(stdout.decode('utf-8', errors='ignore'))

run_tsc()
