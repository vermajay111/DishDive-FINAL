import ollama


ners = []
usin = input("Enter your ingrident: ")
while usin != "!q":
    ners.append(usin)
    usin = input("Enter your ingrident: ")


instruct = """the output must be in JSON format without any addiontal content 
so that javascript can parse the json. the format of the output should be like
so:  {title: [the title of the dish as a string], steps: [an array of strings each string should be a step to make that dish in sequanital order], ing: [an array of strings each string should be a precise mesaurement of how much ingrident of that is needed] }"""
message = f"""
Generate a recipe using only these ingridents, {ners} if a recipe cannot be generated output an empty JSON
"""
query = message + instruct

response = ollama.chat(model='llama3', messages=[
  {
    'role': 'user',
    'content': query,
  },
])
print(response['message']['content'])