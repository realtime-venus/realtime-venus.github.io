const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const context = vm.createContext({window:{}});
for (const file of ['demos.js','demo-engine.js']) vm.runInContext(fs.readFileSync(path.join(__dirname,'../dist/assets',file),'utf8'),context);
const scenes = Object.fromEntries(context.window.VENUS_DEMOS.map(scene => [scene.id,scene]));
const frame = (id,t) => JSON.parse(JSON.stringify(context.window.VenusScene.frame(scenes[id],t)));

test('The recorded microwave reply and captions use playback timestamps', () => {
  const recording=scenes.proactive;
  assert.equal(recording.type,'video');
  assert.equal(recording.duration,45);
  assert.equal(recording.events.length,1);
  assert.equal(recording.events[0].time,30);
  assert.equal(recording.events[0].end,34.28);
  assert.equal(recording.events[0].text,'The microwave just beeped — the heating cycle is complete.');
  for (const key of ['src','poster','captions']) assert.ok(fs.existsSync(path.join(__dirname,'../dist',recording[key])));
  const captions=fs.readFileSync(path.join(__dirname,'../dist',recording.captions),'utf8');
  assert.ok(captions.includes('00:00:30.000 --> 00:00:34.280'));
  assert.ok(captions.includes(recording.events[0].text));
});
test('Delegation overlaps with input, then returns to speech', () => {
  assert.deepEqual(frame('delegation',9).channels,['listen','speak']);
  assert.deepEqual(frame('delegation',10).channels,['listen','delegate']);
  assert.deepEqual(frame('delegation',14.9).visible,[0,1,2]);
  assert.deepEqual(frame('delegation',15).channels,['listen','speak']);
  assert.deepEqual(frame('delegation',15).visible,[0,1,2,3]);
});
test('The recorded scene reveals its reply only during the playback interval and rewinds cleanly', () => {
  assert.deepEqual(frame('proactive',29.99).visible,[]);
  assert.deepEqual(frame('proactive',30).channels,['listen','speak']);
  assert.deepEqual(frame('proactive',30).active,[0]);
  assert.deepEqual(frame('proactive',34.28).channels,['listen']);
  assert.deepEqual(frame('proactive',34.28).active,[]);
  assert.deepEqual(frame('proactive',34.28).visible,[0]);
  assert.equal(frame('proactive',45).complete,true);
  assert.deepEqual(frame('proactive',45).channels,[]);
  assert.deepEqual(frame('proactive',0).visible,[]);
  assert.equal(frame('proactive',0).complete,false);
});
test('The stereo recording preserves overlap and follows the new dialogue cues', () => {
  const recording=scenes.interruption;
  assert.equal(recording.type,'audio');assert.equal(recording.duration,37);
  assert.ok(fs.existsSync(path.join(__dirname,'../dist',recording.src)));
  assert.ok(fs.existsSync(path.join(__dirname,'../dist',recording.waveform)));
  assert.deepEqual(frame('interruption',0).active,[0]);
  assert.deepEqual(frame('interruption',3.5).active,[1]);
  assert.deepEqual(frame('interruption',15.1).channels,['listen','speak']);
  assert.deepEqual(frame('interruption',15.1).active,[1,2]);
  assert.deepEqual(frame('interruption',15.7).channels,['listen']);
  assert.deepEqual(frame('interruption',17).active,[2]);
  assert.deepEqual(frame('interruption',18.3).active,[3]);
  assert.deepEqual(frame('interruption',35.52).active,[]);
  assert.deepEqual(frame('interruption',35.52).channels,[]);
  assert.equal(frame('interruption',36).complete,false);
  assert.match(recording.events[1].text,/starting city/);
  assert.match(recording.events[3].text,/overnight stays/);
});
test('Film position follows the paper’s 40 s axis, not the playback endpoint', () => {
  assert.equal(frame('delegation',20).filmProgress,.5);
});
test('Rewinding hides future dialogue and completion does not stick', () => {
  assert.equal(frame('interruption',37).complete,true);
  assert.equal(frame('interruption',13).complete,false);
  assert.deepEqual(frame('interruption',15.1).visible,[0,1,2]);
  assert.deepEqual(frame('interruption',0).visible,[0]);
});
test('Out-of-range positions clamp and a completed scene has no active channels', () => {
  assert.equal(frame('delegation',-5).time,0);
  const end=frame('delegation',100);
  assert.equal(end.time,22);
  assert.equal(end.complete,true);
  assert.deepEqual(end.channels,[]);
  assert.deepEqual(end.active,[]);
});
