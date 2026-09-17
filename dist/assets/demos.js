// Real recordings use type: 'audio' or 'video' and a source media file.
// Recorded demos use playback-aligned transcripts; other scenes remain manuscript walkthroughs.
window.VENUS_DEMOS = [
  {
    "id": "proactive",
    "type": "video",
    "model": "Realtime-Venus-Omni",
    "category": "Proactive audio–visual perception",
    "title": "The microwave beeps. Realtime-Venus responds.",
    "takeaway": "At 30 s, the model response identifies the microwave’s beep and explains that the heating cycle is complete.",
    "summary": "Watch a microwave heating cycle alongside Realtime-Venus’s response when the cycle ends.",
    "source": "Recorded scene · Synchronized model transcript.",
    "src": "./assets/demos/microwave.mp4",
    "poster": "./assets/demos/microwave-poster.jpg",
    "captions": "./assets/demos/microwave.en.vtt",
    "language": "en",
    "duration": 45,
    "width": 960,
    "height": 544,
    "input": "Audio + video input",
    "spotlight": {
      "time": 30,
      "label": "Watch the response"
    },
    "opening": "Watch the microwave scene. The model reply appears at 30 s.",
    "phases": [
      {"time": 0, "title": "Watch and listen", "detail": "Follow the recorded microwave scene before the reply.", "channels": ["listen"]},
      {"time": 30, "title": "Realtime-Venus responds", "detail": "The reply identifies the sound and explains what it means.", "channels": ["listen", "speak"], "accent": "response"},
      {"time": 34.28, "title": "The reply finishes", "detail": "The video continues after the model response.", "channels": ["listen"]}
    ],
    "marks": [{"time": 0, "label": "Watch the scene"}, {"time": 30, "label": "The response begins"}, {"time": 34.28, "label": "After the response"}],
    "events": [
      {
        "time": 30,
        "end": 34.28,
        "role": "Realtime-Venus",
        "text": "The microwave just beeped — the heating cycle is complete."
      }
    ],
    "note": "The state indicators are a playback guide. The model reply is synchronized to the recording."
  },
  {
    "id": "delegation",
    "type": "video",
    "model": "Realtime-Venus-Omni",
    "format": "Video + dialogue demo",
    "mediaLabel": "Video + dialogue",
    "category": "Asynchronous delegation",
    "title": "See the city. Find a flight.",
    "summary": "Recognize Shanghai from the view, then hand off a flight search while the video continues.",
    "takeaway": "After identifying Shanghai, the scene delegates a Beijing–Shanghai flight search. The spoken result returns at 24 s, with the city still in view.",
    "source": "Video and dialogue clips aligned to the supplied storyboard.",
    "src": "./assets/demos/shanghai-flights.mp4",
    "poster": "./assets/demos/shanghai-flights-poster.jpg",
    "captions": "./assets/demos/shanghai-flights.en.vtt",
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
        "detail": "You ask where this is and request a flight from Beijing to that city.",
        "channels": [
          "listen"
        ]
      },
      {
        "time": 10,
        "title": "Identify the city. Acknowledge the task.",
        "detail": "Realtime-Venus names Shanghai and acknowledges the flight request.",
        "channels": [
          "listen",
          "speak"
        ]
      },
      {
        "time": 14.052333,
        "title": "The search runs. The scene continues.",
        "detail": "The storyboard hands the Beijing–Shanghai flight search to the harness.",
        "channels": [
          "listen",
          "delegate"
        ],
        "accent": "delegation"
      },
      {
        "time": 24,
        "title": "The result rejoins the conversation",
        "detail": "Realtime-Venus presents the flight options described in the demo.",
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
        "text": "I found twelve flights. I’d recommend the three p.m. flight from Beijing Capital to Shanghai Hongqiao, arriving at five twenty p.m."
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
    "summary": "Listen to a road-trip conversation as a follow-up shifts the focus to daily breaks and meals.",
    "takeaway": "Around 15 s, you ask a follow-up while the first answer is still playing. Realtime-Venus then responds about breaks and meals.",
    "source": "Recorded stereo conversation · Synchronized transcript.",
    "src": "./assets/demos/road-trip.wav",
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
        "detail": "A three-day road trip, with safe pacing.",
        "channels": [
          "listen"
        ]
      },
      {
        "time": 3.5,
        "title": "Speaking, still listening",
        "detail": "Realtime-Venus asks about the starting city, region, and interests.",
        "channels": [
          "listen",
          "speak"
        ]
      },
      {
        "time": 15.1,
        "title": "A follow-up arrives",
        "detail": "You ask about breaks and meals while the first response is still playing.",
        "channels": [
          "listen",
          "speak"
        ],
        "accent": "interruption"
      },
      {
        "time": 15.7,
        "title": "Your question takes the floor",
        "detail": "The first response ends as you finish the follow-up.",
        "channels": [
          "listen"
        ],
        "accent": "interruption"
      },
      {
        "time": 18.3,
        "title": "The answer follows your question",
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
    "note": "Original stereo recording. Dialogue follows the supplied transcript; cue times are approximate and aligned to the audio. State indicators are a playback guide."
  }
];
