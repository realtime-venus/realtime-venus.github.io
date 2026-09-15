// Real recordings can be added with type: 'video', src and optional poster/captions.
// The supplied examples are explicitly presented as manuscript walkthroughs.
window.VENUS_DEMOS = [
  {
    id: 'proactive', type: 'walkthrough', model: 'Realtime-Venus-Omni',
    category: 'Proactive perception', title: 'Notice the moment that matters',
    summary: 'Venus keeps watching and listening after the request, then responds when the relevant event happens.',
    source: 'Illustrated from Figure 4. No recorded model audio or video. Timeline markers come from the paper.',
    figure: './assets/proactive-example.png?v=7', filmstrip: './assets/proactive-filmstrip.jpg',
    filmstripAlt: 'Original football-match frames from the manuscript example.',
    duration: 20, input: 'Audio + video input', filmstripDuration: 40,
    opening: 'You are watching a football match. Ask Venus to catch the opening whistle.',
    spotlight: {time:16, label:'See the whistle response'},
    phases: [
      {time:0, title:'Follow the match', detail:'Continuous perception keeps the scene in context.', channels:['listen']},
      {time:3, title:'The reminder is set', detail:'Venus keeps watching for the requested event.', channels:['listen']},
      {time:16, title:'The whistle blows. Venus responds.', detail:'The event triggers a spoken reminder.', channels:['listen','speak'], accent:'response'}
    ],
    marks: [{time:3,label:'Set a reminder'},{time:16,label:'The whistle blows'}],
    events: [
      {time:3, end:16, role:'You', text:'When the referee blows the whistle, please remind me.'},
      {time:16, end:20, role:'Scene event', text:'The referee blows the whistle.', kind:'event'},
      {time:16, end:20, role:'Venus', text:'The referee has blown the whistle! The game has started.'}
    ],
    note: 'The figure marks the reminder at 16 s; it does not report its speech duration. The walkthrough ends at 20 s for presentation.'
  },
  {
    id:'delegation', type:'walkthrough', model:'Realtime-Venus-Omni',
    category:'Asynchronous delegation',title:'Get answers while life keeps moving',
    summary:'The frontend acknowledges a request while the harness looks up external information. The audio–visual stream continues throughout.',
    source:'Illustrated from Figure 4. English translation of the paper’s Chinese dialogue; the traffic information belongs to that example.',
    figure:'./assets/delegation-example.png?v=7',filmstrip:'./assets/delegation-filmstrip.jpg',
    filmstripAlt:'Original driving-scene frames from the manuscript example.',
    duration:22,input:'Audio + video input',filmstripDuration:40,
    opening:'You are on the road. Ask Venus to check the day’s driving restrictions.',
    spotlight:{time:10,label:'See the background lookup'},
    phases:[
      {time:0,title:'Follow the road',detail:'The audio–visual context stays available.',channels:['listen']},
      {time:3,title:'You ask. Venus listens.',detail:'A question needs information from an external service.',channels:['listen']},
      {time:8,title:'Acknowledge the request',detail:'A short reply keeps the conversation moving.',channels:['listen','speak']},
      {time:10,title:'The lookup runs. Input stays active.',detail:'The harness works in parallel with the interaction loop.',channels:['listen','delegate'],accent:'delegation'},
      {time:15,title:'The answer rejoins the conversation',detail:'The harness prepares a reply; the frontend brings it into the conversation.',channels:['listen','speak'],accent:'response'}
    ],
    marks:[{time:3,label:'Ask a question'},{time:10,label:'Delegate the lookup'},{time:15,label:'Bring the answer back'}],
    events:[
      {time:3,end:8,role:'You',text:'Please check which license-plate endings are restricted in Beijing today.'},
      {time:8,end:10,role:'Venus',text:'Sure, I’ll check.'},
      {time:10,end:15,role:'Harness',text:'Querying the external service while the input stream continues.',kind:'event'},
      {time:15,end:22,role:'Venus',text:'Today, vehicles with license plates ending in 3 or 8 are restricted in Beijing, from 7:00 to 20:00.'}
    ],
    note:'Traffic information is quoted from the paper example, not current guidance. The five-second query interval is an example timeline, not a latency benchmark.'
  },
  {
    id:'interruption',type:'walkthrough',model:'Realtime-Venus-Audio',
    category:'Full-duplex conversation',title:'Change direction mid-conversation',
    summary:'Venus listens during its own response, yields to the follow-up, and answers the revised question.',
    source:'Illustrated from Figure 4. Original English dialogue; no recorded speech or live model connection.',
    figure:'./assets/interruption-example.png?v=7',duration:30,input:'Audio input',
    opening:'You are planning a road trip. Start with a request, then change direction while Venus speaks.',
    spotlight:{time:13,label:'See the interruption'},
    phases:[
      {time:0,title:'Ready to listen',detail:'A conversation can change direction at any moment.',channels:['listen']},
      {time:1,title:'You set the task',detail:'Venus receives the road-trip request.',channels:['listen']},
      {time:5,title:'Speaking, still listening',detail:'The response begins while incoming speech remains available.',channels:['listen','speak']},
      {time:13,title:'You interrupt. Venus yields.',detail:'The earlier response stops so the follow-up can take the floor.',channels:['listen'],accent:'interruption'},
      {time:15,title:'A new answer follows your question',detail:'Venus addresses the revised request.',channels:['listen','speak'],accent:'response'}
    ],
    marks:[{time:5,label:'Venus speaks'},{time:13,label:'You interrupt'},{time:15,label:'The response adapts'}],
    events:[
      {time:1,end:5,role:'You',text:'Help me plan a three-day road trip with safe pacing.'},
      {time:5,end:13,role:'Venus',text:'Aim for 5–7 driving hours daily, take a break every two hours, plus lunch and an…',interrupted:true},
      {time:13,end:15,role:'You',text:'What should each day look like for breaks and meals?',kind:'interruption'},
      {time:15,end:30,role:'Venus',text:'Start after breakfast, drive two hours, then take a short break. Drive two more hours, stop for lunch, and continue one to three hours before dinner and overnight rest.'}
    ],
    note:'The initial response is truncated in the original figure. Event times illustrate the conversational sequence and are not response-latency measurements.'
  }
];
