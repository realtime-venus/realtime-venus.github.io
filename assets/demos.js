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
      "label": "Watch the response · 30 s"
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
    "note": "The state indicators are a playback guide. The model reply follows the recorded 30.00–34.28 s interval."
  },
  {
    id:'delegation', type:'walkthrough', model:'Realtime-Venus-Omni',
    category:'Asynchronous delegation',title:'A task runs. The conversation stays open.',
    takeaway:'During the 10–15 s lookup, audio–visual input stays active. The prepared reply rejoins the conversation at 15 s.',
    summary:'The frontend acknowledges a request while the harness looks up external information. The audio–visual stream continues throughout.',
    source:'Figure 4 · English translation of the paper’s Chinese dialogue.',
    figure:'./assets/delegation-example.png?v=7',filmstrip:'./assets/delegation-filmstrip.jpg',
    filmstripAlt:'Original driving-scene frames from the manuscript example.',
    duration:22,input:'Audio + video input',filmstripDuration:40,
    opening:'You are on the road. Ask Realtime-Venus to check the day’s driving restrictions.',
    spotlight:{time:10,label:'Watch the lookup · 10 s'},
    phases:[
      {time:0,title:'Follow the road',detail:'The audio–visual context stays available.',channels:['listen']},
      {time:3,title:'You ask. Realtime-Venus listens.',detail:'A question needs information from an external service.',channels:['listen']},
      {time:8,title:'Acknowledge the request',detail:'A short reply keeps the conversation moving.',channels:['listen','speak']},
      {time:10,title:'The lookup runs. Input stays active.',detail:'The harness works in parallel with the interaction loop.',channels:['listen','delegate'],accent:'delegation'},
      {time:15,title:'The answer rejoins the conversation',detail:'The harness prepares a reply; the frontend brings it into the conversation.',channels:['listen','speak'],accent:'response'}
    ],
    marks:[{time:3,label:'Ask a question'},{time:10,label:'Delegate the lookup'},{time:15,label:'Bring the answer back'}],
    events:[
      {time:3,end:8,role:'You',text:'Please check which license-plate endings are restricted in Beijing today.'},
      {time:8,end:10,role:'Realtime-Venus',text:'Sure, I’ll check.'},
      {time:10,end:15,role:'Harness',text:'Querying the external service while the input stream continues.',kind:'event'},
      {time:15,end:22,role:'Realtime-Venus',text:'Today, vehicles with license plates ending in 3 or 8 are restricted in Beijing, from 7:00 to 20:00.'}
    ],
    note:'Traffic information is quoted from the paper example, not current guidance. The five-second query interval is an example timeline, not a latency benchmark.'
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
      "label": "Hear the follow-up · 15 s"
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
