from subprocess import call
import sys
import os


def extract_messages():
    try:
        retcode = call(["pybabel extract ../dsn -o locale.pot -F ../babel.cfg"],
                       cwd=os.path.dirname(os.path.abspath(__file__)))
        if retcode < 0:
            print >>sys.stderr, "Process was terminated by signal", -retcode
        else:
            print >>sys.stderr, "Process returned", retcode
    except OSError as e:
        print >>sys.stderr, "Execution failed:", e


def init_catalog(languagecode):
    try:
        retcode = call(["pybabel init -l "+languagecode+" -d . -i locale.pot -D django"],
                       cwd=os.path.dirname(os.path.abspath(__file__)))
        if retcode < 0:
            print >>sys.stderr, "Process was terminated by signal", -retcode
        else:
            print >>sys.stderr, "Process returned", retcode
    except OSError as e:
        print >>sys.stderr, "Execution failed:", e


def update_catalogs():
    try:
        retcode = call(["pybabel update -d . -i locale.pot -D django"],
                       cwd=os.path.dirname(os.path.abspath(__file__)))
        if retcode < 0:
            print >>sys.stderr, "Process was terminated by signal", -retcode
        else:
            print >>sys.stderr, "Process returned", retcode
    except OSError as e:
        print >>sys.stderr, "Execution failed:", e


def compile_catalogs():
    try:
        retcode = call(["pybabel compile -d . -D django"],
                       cwd=os.path.dirname(os.path.abspath(__file__)))
        if retcode < 0:
            print >>sys.stderr, "Process was terminated by signal", -retcode
        else:
            print >>sys.stderr, "Process returned", retcode
    except OSError as e:
        print >>sys.stderr, "Execution failed:", e


def generate_alljson():
    d='.'
    dirs = [os.path.join(d,o) for o in os.listdir(d) if os.path.isdir(os.path.join(d,o))]
    for name in dirs:
        if not name.__contains__("angular"):
            languagecode = name.replace(".","")
            languagecode = languagecode.replace("/","")
            print("Generating angular-"+languagecode.split("_")[0]+".json...")
            generate_json(languagecode)


def generate_json(languagecode):
    ids = []
    strs = []
    tmp = None
    init = True
    po = open(languagecode+"/LC_MESSAGES/django.po", "rb")
    json = open("angular/angular-"+languagecode.split("_")[0]+".json", "wb")

    for line in po:
        line.rstrip('\n')
        if line.__contains__("msgid"):
            if not init:
                strs.append(tmp)
            init = False
            tmp = None
            ids.append(str(line.split('"')[1::2][0]))
        elif line.__contains__("msgstr"):
            tmp = str(line.split('"')[1::2][0])
        elif tmp is not None and not line.__contains__("#") and line.__contains__("\""):
            tmp += str(line.split('"')[1::2][0])

    strs.append(tmp)

    if len(ids) is not len(strs):
        print >>sys.stderr, "Execution failed"
        print(ids)
        print(strs)
    else:
        json.write("{\n")
        for key, value in zip(ids,strs):
            if key == ids[-1]:
                json.write("    \""+key+"\" : \""+value+"\"\n")
            else:
                json.write("    \""+key+"\" : \""+value+"\",\n")
        json.write("}")

    po.close()
    json.close()


if len(sys.argv) > 1:
    arg = sys.argv[1]
    if arg == "extract":
        extract_messages()
    elif arg == "init":
        if len(sys.argv) > 2:
            init_catalog(sys.argv[2])
        else:
            print >>sys.stderr, "Insufficient arguments specified. Exiting."
    elif arg == "update":
        update_catalogs()
    elif arg == "compile":
        compile_catalogs()
    elif arg == "tojson":
        generate_alljson()
    else:
        print >>sys.stderr, "Invalid argument specified. Exiting."
else:
    print >>sys.stderr, "No arguments specified. Exiting."