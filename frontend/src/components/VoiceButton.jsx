// import { useState, useRef, useEffect } from 'react';
// import { BsMicFill, BsMicMuteFill, BsStopFill } from 'react-icons/bs';
// import './VoiceButton.css';

// /**
//  * VoiceButton — Animated microphone / recording toggle
//  * Shows a waveform animation while recording
//  * Calls onRecordingStart / onRecordingStop callbacks
//  */
// export default function VoiceButton({ onRecordingStart, onRecordingStop, disabled }) {
//   const [state, setState] = useState('idle'); // 'idle' | 'recording' | 'processing'
//   const timerRef = useRef(null);

//   // Cleanup on unmount
//   useEffect(() => () => clearTimeout(timerRef.current), []);

//   const handleClick = () => {
//     if (disabled) return;

//     if (state === 'idle') {
//       setState('recording');
//       onRecordingStart?.();
//     } else if (state === 'recording') {
//       setState('processing');
//       onRecordingStop?.();
//       // Simulate processing time before returning to idle
//       timerRef.current = setTimeout(() => setState('idle'), 1800);
//     }
//   };

//   const isRecording  = state === 'recording';
//   const isProcessing = state === 'processing';

//   return (
//     <div className={`voice-btn-wrap ${isRecording ? 'voice-btn-wrap--recording' : ''}`}>
//       {/* Waveform bars (visible while recording) */}
//       {isRecording && (
//         <div className="voice-waveform" aria-hidden="true">
//           {Array.from({ length: 7 }).map((_, i) => (
//             <span
//               key={i}
//               className="voice-waveform__bar"
//               style={{ animationDelay: `${i * 0.1}s` }}
//             />
//           ))}
//         </div>
//       )}

//       {/* Main button */}
//       <button
//         className={`voice-btn voice-btn--${state}`}
//         onClick={handleClick}
//         disabled={disabled || isProcessing}
//         title={
//           isRecording  ? 'Stop recording'  :
//           isProcessing ? 'Processing…'     :
//           'Start voice input'
//         }
//         aria-label={
//           isRecording  ? 'Stop recording'  :
//           isProcessing ? 'Processing audio' :
//           'Start voice input'
//         }
//       >
//         {/* Pulse rings (while recording) */}
//         {isRecording && (
//           <>
//             <span className="voice-pulse voice-pulse--1" />
//             <span className="voice-pulse voice-pulse--2" />
//           </>
//         )}

//         {/* Icon */}
//         <span className="voice-btn__icon">
//           {isRecording
//             ? <BsStopFill size={18} />
//             : isProcessing
//             ? <span className="voice-btn__spinner" />
//             : <BsMicFill size={18} />
//           }
//         </span>
//       </button>

//       {/* Label beneath */}
//       <span className="voice-btn__label">
//         {isRecording  ? 'Recording…' :
//          isProcessing ? 'Processing' :
//          'Voice'}
//       </span>
//     </div>
//   );
// }

import React, {
  useRef,
  useState,
  useEffect
} from "react"

import {

  startWakeWordListener,

  stopWakeWordListener

} from "../services/wake_word_service"

const VoiceButton = ({
  onTranscript
}) => {

  const mediaRecorderRef = useRef(null)

  const audioChunksRef = useRef([])

  const [recording, setRecording] = useState(false)

  const [processing, setProcessing] = useState(false)

  const [transcript, setTranscript] = useState("")

  useEffect(() => {

  startWakeWordListener(

    () => {

      console.log(
        "Wake Word Detected"
      )

      // -----------------------------------
      // STOP WAKE LISTENER
      // -----------------------------------
      stopWakeWordListener()

      // -----------------------------------
      // START REAL RECORDING
      // -----------------------------------
      startRecording()
    }
  )

}, [])

  // -----------------------------------
  // START RECORDING
  // -----------------------------------
  const startRecording = async () => {
    speechSynthesis.cancel()

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true
        })

      const mediaRecorder =
        new MediaRecorder(stream)

      mediaRecorderRef.current =
        mediaRecorder

      audioChunksRef.current = []

      mediaRecorder.ondataavailable =
        (event) => {

          audioChunksRef.current.push(
            event.data
          )
        }

      mediaRecorder.onstop =
        async () => {

          setProcessing(true)

          const audioBlob = new Blob(

            audioChunksRef.current,

            {
              type: "audio/wav"
            }
          )

          const formData = new FormData()

          formData.append(
            "audio",
            audioBlob,
            "voice.wav"
          )

          try {

            const response = await fetch(

              "http://localhost:5000/api/voice",

              {
                method: "POST",
                body: formData
              }
            )

            const data =
              await response.json()

            console.log(data)

            if (

              data.transcript &&

              onTranscript

            ) {

              onTranscript(
                data.transcript
              )
            }

          } catch (error) {

            console.error(error)
          }

          setProcessing(false)

          startWakeWordListener(

            () => {

              console.log(
                "Wake Word Detected"
              )

              stopWakeWordListener()

              startRecording()
            }
          )
        }

      mediaRecorder.start()

      setRecording(true)

    } catch (error) {

      console.error(error)
    }
  }

  // -----------------------------------
  // STOP RECORDING
  // -----------------------------------
  const stopRecording = () => {

    mediaRecorderRef.current.stop()

    setRecording(false)
  }

  return (

    <div className="flex items-center gap-3">

      <button

        onClick={
          recording
            ? stopRecording
            : startRecording
        }

        className="
          px-4
          py-2
          rounded-lg
          bg-blue-600
          text-white
        "
      >

        {
          recording
            ? "Stop Recording"
            : processing
              ? "Processing..."
              : "Start Voice"
        }

      </button>

      {/* {
        transcript && (

          <p className="text-sm text-gray-300">

            {transcript}

          </p>
        )
      } */}

    </div>
  )
}

export default VoiceButton