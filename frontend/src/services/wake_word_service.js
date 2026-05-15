let recognition = null

// -----------------------------------
// START WAKE WORD LISTENER
// -----------------------------------
export const startWakeWordListener = (

  onWakeWordDetected

) => {

  // -----------------------------------
  // CHECK SUPPORT
  // -----------------------------------
  const SpeechRecognition =

    window.SpeechRecognition ||

    window.webkitSpeechRecognition

  if (!SpeechRecognition) {

    console.error(
      "Speech Recognition Not Supported"
    )

    return
  }

  // -----------------------------------
  // CREATE RECOGNITION
  // -----------------------------------
  recognition = new SpeechRecognition()

  recognition.continuous = true

  recognition.interimResults = true

  recognition.lang = "en-US"

  // -----------------------------------
  // LISTEN RESULTS
  // -----------------------------------
  recognition.onresult = (event) => {

    const transcript = Array.from(

      event.results

    )

      .map(
        result => result[0].transcript
      )

      .join(' ')
      
      .toLowerCase()

    console.log(
      "Wake Listener:",
      transcript
    )

    // -----------------------------------
    // DETECT WAKE WORD
    // -----------------------------------
    if (

      transcript.includes(
        "friday"
      )

    ) {

      console.log(
        "Wake Word Detected"
      )

      speechSynthesis.cancel()

      if (onWakeWordDetected) {

        onWakeWordDetected()
      }
    }
  }

  // -----------------------------------
  // AUTO RESTART
  // -----------------------------------
  recognition.onend = () => {
    console.log(
        "Wake Listener Restarting..."
    )
    try {
        recognition.start()
    } catch (error) {
        console.log(
        "Recognition Already Running"
        )
    }
    }

  // -----------------------------------
  // START LISTENING
  // -----------------------------------
  recognition.start()

  console.log(
    "Wake Word Listener Started"
  )
}

// -----------------------------------
// STOP LISTENER
// -----------------------------------
export const stopWakeWordListener = () => {

  if (recognition) {

    recognition.stop()
  }
}