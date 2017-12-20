from openalpr import Alpr
import json;

alpr = Alpr("eu", "", "")
if not alpr.is_loaded():
    print("Error loading OpenALPR")
    sys.exit(1)

alpr.set_top_n(20)

filename= raw_input()

results = alpr.recognize_file(str(filename));

x = json.dumps(results['results'])
print(x) #sending output to nodejs

# Call when completely done to release memory
alpr.unload()