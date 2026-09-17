// Real recordings can be added with type: 'video', src and optional poster/captions.
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
    "events": [
      {
        "time": 30,
        "end": 34.28,
        "role": "Realtime-Venus",
        "text": "The microwave just beeped — the heating cycle is complete."
      }
    ],
    "note": "The model transcript is synchronized to the video from 30.00 to 34.28 s."
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
    id:'interruption',type:'walkthrough',model:'Realtime-Venus-Audio',
    category:'Full-duplex conversation',title:'A new question. A new direction.',
    takeaway:'The first answer stops at 13 s. Your follow-up takes the floor, and the revised answer begins at 15 s.',
    summary:'Realtime-Venus keeps listening during its own response. When you ask a follow-up, it yields and answers the revised question.',
    source:'Figure 4 · Original English dialogue from the report.',
    figure:'./assets/interruption-example.png?v=7',duration:30,input:'Audio input',
    opening:'You are planning a road trip. Start with a request, then change direction while Realtime-Venus speaks.',
    spotlight:{time:13,label:'Watch the interruption · 13 s'},
    phases:[
      {time:0,title:'Ready to listen',detail:'A conversation can change direction at any moment.',channels:['listen']},
      {time:1,title:'You set the task',detail:'Realtime-Venus receives the road-trip request.',channels:['listen']},
      {time:5,title:'Speaking, still listening',detail:'The response begins while incoming speech remains available.',channels:['listen','speak']},
      {time:13,title:'You interrupt. Realtime-Venus yields.',detail:'The earlier response stops so the follow-up can take the floor.',channels:['listen'],accent:'interruption'},
      {time:15,title:'A new answer follows your question',detail:'Realtime-Venus addresses the revised request.',channels:['listen','speak'],accent:'response'}
    ],
    marks:[{time:5,label:'Realtime-Venus speaks'},{time:13,label:'You interrupt'},{time:15,label:'The response adapts'}],
    events:[
      {time:1,end:5,role:'You',text:'Help me plan a three-day road trip with safe pacing.'},
      {time:5,end:13,role:'Realtime-Venus',text:"Got it. I'll plan a three-day road trip, with daily limits and stops. I'll also include meals and...",interrupted:true},
      {time:13,end:15,role:'You',text:'What should each day look like for breaks and meals?',kind:'interruption'},
      {time:15,end:30,role:'Realtime-Venus',text:"Start with a breakfast rich in protein and fiber. Then, eat balanced lunches and dinners with vegetables, lean proteins, and whole grains."}
    ],
    note:'The initial response is truncated in the original figure. Event times illustrate the conversational sequence and are not response-latency measurements.'
  }
];
