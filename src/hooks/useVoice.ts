import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function useVoice(
  onResult: (text: string) => void,
  onComplete?: (text: string) => void
) {
  const recognition = useRef<any>(null);

  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const speech = new SpeechRecognition();

    speech.lang = "en-US";
    speech.continuous = false;
    speech.interimResults = false;

    speech.onstart = () => {
      setListening(true);
    };

    speech.onend = () => {
      setListening(false);
    };

    speech.onerror = (event: any) => {
      console.log("Speech Error:", event.error);
      setListening(false);
    };

    speech.onresult = (event: any) => {
      const text = event.results[0][0].transcript;

      onResult(text);

      if (onComplete) {
        onComplete(text);
      }
    };

    recognition.current = speech;

    return () => {
      recognition.current?.stop();
    };
  }, []);

  function startListening() {
    if (!recognition.current) {
      alert("Speech Recognition is not supported.");
      return;
    }

    if (listening) {
      return;
    }

    try {
      recognition.current.start();
    } catch (err) {
      console.log(err);
    }
  }

  return {
    listening,
    startListening,
  };
}