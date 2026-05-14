import requests
import json

def get_weather(api_key, city):
    base_url = "http://api.openweathermap.org/data/2.5/weather?"
    complete_url = f"{base_url}appid={api_key}&q={city}"
    response = requests.get(complete_url)
    data = response.json()

    if data["cod"] != "404":
        main = data["main"]
        temperature = main["temp"]
        humidity = main["humidity"]
        weather_description = data["weather"][0]["description"]

        print(f"Weather in {city}:")
        print(f"Temperature: {temperature}K")
        print(f"Humidity: {humidity}%")
        print(f"Description: {weather_description}")
    else:
        print("City not found.")

if __name__ == "__main__":
    api_key = "YOUR_API_KEY"  # Replace with your actual API key
    city = input("Enter city name: ")
    get_weather(api_key, city)