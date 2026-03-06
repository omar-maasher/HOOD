import os
def read_and_print(path):
    if os.path.exists(path):
        with open(path, 'rb') as f:
            content = f.read()
            try:
                print(f"--- {path} ---")
                print(content.decode('utf-16le'))
            except:
                print(content.decode('utf-8', errors='ignore'))

read_and_print(r"c:\Users\نجم التقنية\Desktop\Hoodtrading\SaaS-Boilerplate\tmp\eslint.log")
read_and_print(r"c:\Users\نجم التقنية\Desktop\Hoodtrading\SaaS-Boilerplate\tmp\check-types.log")
