import speech_recognition as sr

# Initialize recognizer
recognizer = sr.Recognizer()

# Use the default system microphone
with sr.Microphone() as source:
    print("Adjusting for ambient noise... Please wait.")
    recognizer.adjust_for_ambient_noise(source)

    print("Ready! Start speaking...\n")

    try:
        while True:
            print("Listening...")
            audio = recognizer.listen(source)

            try:
                # Recognize speech using Google Web Speech API
                text = recognizer.recognize_google(audio)
                print(f"👉 You said: {text}")
            except sr.UnknownValueError:
                print("❌ Could not understand audio")
            except sr.RequestError as e:
                print(f"❌ Request failed; {e}")

    except KeyboardInterrupt:
        print("\n🛑 Exiting program.")
