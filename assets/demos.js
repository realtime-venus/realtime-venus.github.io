// Real recordings use type: 'audio' or 'video' and a source media file.
// Recorded demos use playback-aligned transcripts; other scenes remain manuscript walkthroughs.
window.VENUS_DEMOS = [
  {
    "id": "proactive",
    "type": "video",
    "model": "Realtime-Venus-Omni",
    "category": "Proactive audio–visual perception",
    "title": "The microwave beeps. Realtime-Venus responds.",
    "takeaway": "At 30 s, Realtime-Venus identifies the microwave’s beep and explains that the heating cycle is complete.",
    "summary": "Ask Realtime-Venus to listen for the microwave, then watch it respond when heating finishes.",
    "source": "Recorded video · Synchronized dialogue.",
    "src": "./assets/demos/microwave.mp4",
    "playbackSrc": "./assets/demos/microwave.mp4?v=23",
    "poster": "./assets/demos/microwave-poster.jpg",
    "captions": "./assets/demos/microwave.en.vtt?v=25",
    "captionLabel": "English dialogue",
    "language": "en",
    "duration": 45,
    "width": 960,
    "height": 544,
    "input": "Audio + video input",
    "spotlight": {
      "time": 30,
      "label": "Watch the response"
    },
    "opening": "You ask Realtime-Venus to let you know when the microwave beeps.",
    "phases": [
      {"time": 0, "title": "You set the task", "detail": "You ask to be notified when the microwave beeps.", "channels": ["listen"]},
      {"time": 4.64, "title": "Listening for the beep", "detail": "The microwave runs while Realtime-Venus watches and listens.", "channels": ["listen"]},
      {"time": 30, "title": "Realtime-Venus responds", "detail": "Realtime-Venus identifies the beep and explains what it means.", "channels": ["listen", "speak"], "accent": "response"},
      {"time": 34.28, "title": "The reply finishes", "detail": "The recording continues after Realtime-Venus finishes speaking.", "channels": ["listen"]}
    ],
    "marks": [{"time": 0, "label": "Hear the request"}, {"time": 30, "label": "The response begins"}, {"time": 34.28, "label": "After the response"}],
    "events": [
      {
        "time": 1.74,
        "end": 4.64,
        "role": "You",
        "text": "Let me know when the microwave beeps the signal is done.",
        "note": "Automatic transcription"
      },
      {
        "time": 30,
        "end": 34.28,
        "role": "Realtime-Venus",
        "text": "The microwave just beeped — the heating cycle is complete."
      }
    ],
    "note": "The opening request is automatically transcribed from the video; words near the end are less clear. Its timing is approximate. The model reply follows the supplied transcript and recorded playback interval. Activity indicators guide playback."
  },
  {
    "id": "delegation",
    "type": "video",
    "model": "Realtime-Venus-Omni",
    "format": "Video + dialogue demo",
    "mediaLabel": "Video + dialogue",
    "category": "Asynchronous delegation",
    "title": "See the city. Find a flight.",
    "summary": "See how a view of Shanghai leads to a delegated flight search while the video continues.",
    "takeaway": "The demo follows a Beijing–Shanghai flight request from city recognition to delegation and a spoken result at 24 s. The video continues throughout.",
    "source": "Video and speech clips assembled to illustrate delegation.",
    "src": "./assets/demos/shanghai-flights.mp4",
    "playbackSrc": "./assets/demos/shanghai-flights.mp4?v=23",
    "poster": "./assets/demos/shanghai-flights-poster.jpg",
    "captions": "./assets/demos/shanghai-flights.en.vtt?v=26",
    "captionLabel": "English dialogue",
    "language": "en",
    "width": 1280,
    "height": 720,
    "duration": 35.28,
    "input": "Audio + video input",
    "opening": "A view of Shanghai leads to a request for a flight from Beijing.",
    "spotlight": {
      "time": 14.052333,
      "label": "Follow the flight search"
    },
    "phases": [
      {
        "time": 0,
        "title": "A city comes into view",
        "detail": "Watch the Shanghai skyline before the question begins.",
        "channels": [
          "listen"
        ]
      },
      {
        "time": 4,
        "title": "A view becomes a request",
        "detail": "You ask which city is in view and request a flight there from Beijing.",
        "channels": [
          "listen"
        ]
      },
      {
        "time": 10,
        "title": "The city is recognized",
        "detail": "Realtime-Venus names Shanghai and acknowledges the flight request.",
        "channels": [
          "listen",
          "speak"
        ]
      },
      {
        "time": 14.052333,
        "title": "The search runs. The scene continues.",
        "detail": "The storyboard shows the flight search being delegated to the harness.",
        "channels": [
          "listen",
          "delegate"
        ],
        "accent": "delegation"
      },
      {
        "time": 24,
        "title": "The result returns to the conversation",
        "detail": "Realtime-Venus shares the example search results and recommends a flight.",
        "channels": [
          "listen",
          "speak"
        ],
        "accent": "response"
      },
      {
        "time": 33.926833,
        "title": "The response finishes",
        "detail": "The city view continues after the spoken result.",
        "channels": [
          "listen"
        ]
      }
    ],
    "marks": [
      {
        "time": 4,
        "label": "Ask about the view"
      },
      {
        "time": 14.052333,
        "label": "Delegate the search"
      },
      {
        "time": 24,
        "label": "Hear the result"
      }
    ],
    "events": [
      {
        "time": 4,
        "end": 10.452245,
        "role": "You",
        "text": "This view is beautiful! Where is this? Can you find me a flight from Beijing to that city today?"
      },
      {
        "time": 10,
        "end": 14.052333,
        "role": "Realtime-Venus",
        "text": "That’s Shanghai. I will find today’s flight from Beijing."
      },
      {
        "time": 14.052333,
        "end": 24,
        "role": "Harness",
        "text": "Find suitable flights from Beijing to Shanghai today.",
        "kind": "event"
      },
      {
        "time": 24,
        "end": 33.926833,
        "role": "Realtime-Venus",
        "text": "I found twelve flights. I’d recommend the 3:00 PM flight from Beijing Capital to Shanghai Hongqiao, arriving at 5:20 PM."
      }
    ],
    "note": "Assembled from the supplied video and speech clips. Delegation states follow the storyboard; they are not a live search or a latency measurement. Flight details are part of the demonstration."
  },
  {
    "id": "interruption",
    "type": "audio",
    "model": "Realtime-Venus-Audio",
    "category": "Full-duplex conversation",
    "title": "A new question. A new direction.",
    "summary": "Hear a road-trip conversation shift from planning the route to arranging daily breaks and meals.",
    "takeaway": "Around 15 s, you ask a follow-up while Realtime-Venus is still speaking. Its next response addresses breaks and meals.",
    "source": "Recorded stereo conversation · Synchronized transcript.",
    "src": "./assets/demos/road-trip.wav",
    "playbackSrc": "./assets/demos/road-trip.m4a",
    "playbackType": "audio/mp4; codecs=\"mp4a.40.2\"",
    "waveform": "./assets/demos/road-trip-waveform.svg",
    "duration": 37,
    "input": "Audio input",
    "opening": "Plan a three-day road trip, then ask about daily breaks and meals.",
    "spotlight": {
      "time": 15.1,
      "label": "Hear the follow-up"
    },
    "phases": [
      {
        "time": 0,
        "title": "You set the task",
        "detail": "You ask for a three-day road trip with safe pacing.",
        "channels": [
          "listen"
        ]
      },
      {
        "time": 3.5,
        "title": "Speaking while listening",
        "detail": "Realtime-Venus asks about the starting city, region, and interests.",
        "channels": [
          "listen",
          "speak"
        ]
      },
      {
        "time": 15.1,
        "title": "A follow-up arrives",
        "detail": "You ask about breaks and meals while Realtime-Venus is still speaking.",
        "channels": [
          "listen",
          "speak"
        ],
        "accent": "interruption"
      },
      {
        "time": 15.7,
        "title": "Your follow-up continues",
        "detail": "The first response ends while you continue your question.",
        "channels": [
          "listen"
        ],
        "accent": "interruption"
      },
      {
        "time": 18.3,
        "title": "Answering your follow-up",
        "detail": "Realtime-Venus discusses stops, meals, overnight stays, and extra time for delays.",
        "channels": [
          "listen",
          "speak"
        ],
        "accent": "response"
      },
      {
        "time": 35.52,
        "title": "The response finishes",
        "detail": "The conversation ends with a short pause.",
        "channels": []
      }
    ],
    "marks": [
      {
        "time": 0,
        "label": "Plan the trip"
      },
      {
        "time": 15.1,
        "label": "Ask a follow-up"
      },
      {
        "time": 18.3,
        "label": "Hear the answer"
      }
    ],
    "events": [
      {
        "time": 0,
        "end": 3,
        "role": "You",
        "text": "Help me plan a three-day road trip with safe pacing."
      },
      {
        "time": 3.5,
        "end": 15.7,
        "role": "Realtime-Venus",
        "text": "Got it. Let me break this down. I’ll start by asking for your starting city, the region you want to visit, your main interests, and the type of places you want to visit?",
        "note": "Your follow-up overlaps this response",
        "noteAt": 15.1
      },
      {
        "time": 15.1,
        "end": 18,
        "role": "You",
        "text": "What should each day look like for breaks and meals?",
        "kind": "interruption"
      },
      {
        "time": 18.3,
        "end": 35.52,
        "role": "Realtime-Venus",
        "text": "For breaks and meals, we’ll include one major stop per day with lunch and a short visit. I’ll also include two overnight stays, one at each end of the route, plus a buffer for weather or traffic. Now, could you tell me where you’re starting from?"
      }
    ],
    "note": "Original stereo recording with the accompanying transcript. Dialogue cues are approximate and aligned with the audio. Activity indicators guide playback."
  }
];
