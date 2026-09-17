const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {parseHTML} = require('linkedom');
const root = path.join(__dirname, '..');

function setup({saveData = false, effectiveType = '4g', aac = true, hostname = 'localhost'} = {}) {
  const {document, window: dom} = parseHTML(fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8'));
  const fire = (el, type) => el.dispatchEvent(new dom.Event(type));
  const create = document.createElement.bind(document), players = [], frames = new Map();
  let serial = 0, observer;
  document.createElement = tag => {
    const el = create(tag);
    if (tag === 'track') el.track = {mode: 'showing'};
    if (tag === 'audio' || tag === 'video') {
      let time = 0, rate = 1;
      Object.assign(el, {readyState: 0, paused: true, ended: false, seeking: false, duration: 37, volume: 1, muted: false, seeks: [], deferredPlay: false});
      el.canPlayType = () => aac ? 'probably' : '';
      Object.defineProperties(el, {
        currentTime: {get: () => time, set: value => { time = value; el.seeks.push(value); el.seeking = true; fire(el, 'seeking'); }},
        playbackRate: {get: () => rate, set: value => {rate = value; fire(el, 'ratechange');}}
      });
      el.clock = value => {time = value; fire(el, 'timeupdate');};
      el.finishSeek = () => {el.seeking = false; fire(el, 'seeked');};
      el.play = () => {
        el.paused = false; el.ended = false; fire(el, 'play');
        if (el.deferredPlay) return new Promise((resolve, reject) => {el.resolvePlay = resolve; el.rejectPlay = reject;});
        if (el.readyState >= 3) fire(el, 'playing');
        return Promise.resolve();
      };
      el.pause = () => {if (!el.paused) {el.paused = true; fire(el, 'pause');}};
      el.load = () => {el.readyState = 0; el.error = null;};
      players.push(el);
    }
    return el;
  };
  const window = {
    location: {hostname},
    matchMedia: () => ({matches: false}),
    IntersectionObserver: class {
      constructor(callback) {observer = callback;}
      observe() {}
      disconnect() {}
    }
  };
  const context = vm.createContext({window, document, URL, navigator: {connection: {saveData, effectiveType}},
    requestAnimationFrame: callback => {frames.set(++serial, callback); return serial;},
    cancelAnimationFrame: id => frames.delete(id)});
  for (const file of ['demos.js', 'demo-engine.js', 'site.js']) vm.runInContext(fs.readFileSync(path.join(root, 'dist/assets', file), 'utf8'), context);
  const $ = selector => document.querySelector(selector);
  const all = selector => [...document.querySelectorAll(selector)];
  return {document, $, all, fire, frames, players,
    enter: () => observer([{isIntersecting: true}]),
    tick: () => {const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(100000));},
    ready: player => {player.readyState = 4; fire(player, 'loadedmetadata'); player.finishSeek(); fire(player, 'canplay');},
    visible: () => all('.scene-chat .transcript-item').filter(el => !el.hidden).length
  };
}

test('Only the selected scene preloads near the viewport; reduced-data visitors retain metadata loading', () => {
  const page = setup();
  assert.equal(page.players.length, 1);
  assert.equal(page.players[0].preload, 'metadata');
  page.enter();
  assert.equal(page.players[0].preload, 'auto');
  assert.equal(page.players.length, 1, 'No speculative players or downloads');
  assert.equal(page.players[0].src, './assets/demos/road-trip.m4a');
  for (const options of [{saveData: true}, {effectiveType: '2g'}, {effectiveType: 'slow-2g'}]) {
    const reduced = setup(options); reduced.enter();
    assert.equal(reduced.players[0].preload, 'metadata');
    reduced.$('.walkthrough-play').click();
    assert.equal(reduced.players[0].preload, 'auto');
  }
  assert.equal(setup({aac: false}).players[0].src, './assets/demos/road-trip.wav');
});

test('Repeated selection and returning to a scene reuse its player, position and controls without autoplay', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio);
  p.$('.walkthrough-play').click(); audio.clock(12);
  p.$('#tab-interruption').click();
  assert.equal(p.players.length, 1); assert.equal(audio.currentTime, 12); assert.equal(audio.paused, false);
  p.$('#tab-proactive').click();
  assert.equal(audio.paused, true); assert.equal(audio.preload, 'metadata'); assert.equal(p.frames.size, 0);
  p.$('#tab-interruption').click();
  assert.equal(p.$('audio'), audio); assert.equal(audio.currentTime, 12); assert.equal(audio.paused, true);
  assert.equal(p.all('#demo-controls').length, 1); assert.equal(p.$('.timeline-slider').value, '12');
});

test('Scrubbing previews without decoding intermediate positions and resumes only when previously playing', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio); p.$('.walkthrough-play').click();
  const slider = p.$('.timeline-slider');
  for (const value of [6, 11, 19]) {slider.value = String(value); p.fire(slider, 'input');}
  assert.equal(audio.seeks.length, 0); assert.equal(audio.paused, true);
  assert.equal(slider.value, '19'); assert.equal(p.$('.scene-status').textContent, 'Seeking…');
  p.fire(slider, 'change'); assert.deepEqual(audio.seeks, [19]); assert.equal(audio.paused, false);
  audio.finishSeek(); p.$('.walkthrough-play').click();
  slider.value = '8'; p.fire(slider, 'input'); p.fire(slider, 'change');
  assert.deepEqual(audio.seeks, [19, 8]); assert.equal(audio.paused, true);
  assert.equal(p.$('#demo-media').getAttribute('aria-busy'), 'true');
  audio.finishSeek(); assert.equal(p.$('#demo-media').getAttribute('aria-busy'), 'false');
});

test('Animation reads the native clock; unchanged transcript state never measures scroll geometry', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio); p.$('.walkthrough-play').click(); audio.clock(4);
  const viewport = p.$('.scene-conversation'); let reads = 0;
  Object.defineProperties(viewport, {scrollHeight: {get: () => {reads++; return 1000;}}, clientHeight: {get: () => {reads++; return 300;}}});
  for (let i = 0; i < 30; i++) p.tick();
  assert.equal(audio.currentTime, 4); assert.equal(p.$('.timeline-slider').value, '4'); assert.equal(reads, 0);
  viewport.scrollTop = 100; audio.clock(15.1);
  assert.ok(reads > 0); assert.equal(viewport.scrollTop, 100, 'Reading older messages does not jump down');
  p.$('.walkthrough-play').click(); assert.equal(p.frames.size, 0);
});

test('Pending play can be cancelled; late promise failure or inactive media events cannot affect the selected scene', async () => {
  const p = setup(), audio = p.players[0]; audio.deferredPlay = true;
  p.$('.walkthrough-play').click();
  assert.equal(p.$('.scene-status').textContent, 'Loading recording…');
  p.$('.walkthrough-play').click(); audio.rejectPlay(new Error('Cancelled'));
  await Promise.resolve(); assert.equal(p.$('.media-error').hidden, true); assert.equal(audio.paused, true);
  p.$('.walkthrough-play').click();
  p.$('#tab-proactive').click(); audio.rejectPlay(new Error('Old request'));
  p.fire(audio, 'waiting'); p.fire(audio, 'error'); await Promise.resolve();
  assert.equal(p.$('.media-error').hidden, true); assert.equal(p.$('.scene-status').textContent, 'Ready to play');
});

test('Seek before metadata is available is applied exactly once, including after an inactive scene finishes loading', () => {
  const p = setup(), audio = p.players[0];
  p.$('#demo-spotlight').click(); assert.deepEqual(audio.seeks, []);
  p.$('#tab-proactive').click(); p.ready(audio);
  assert.deepEqual(audio.seeks, []);
  p.$('#tab-interruption').click();
  assert.deepEqual(audio.seeks, [13.1]); assert.equal(audio.paused, true);
  audio.finishSeek(); p.$('.walkthrough-play').click(); assert.equal(audio.currentTime, 13.1);
  assert.equal(p.$('.timeline-slider').max, '37', 'Media metadata never shifts authored cue times');
});

test('Buffering stops animation until media can play, and hiding the page cancels playback', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio); p.$('.walkthrough-play').click();
  p.fire(audio, 'waiting'); p.tick();
  assert.equal(p.frames.size, 0); assert.equal(p.$('#demo-panel').getAttribute('data-playing'), 'false');
  p.fire(audio, 'playing'); assert.equal(p.frames.size, 1);
  Object.defineProperty(p.document, 'hidden', {value: true}); p.fire(p.document, 'visibilitychange');
  assert.equal(p.frames.size, 0); assert.equal(audio.paused, true);
});

test('Inactive seek completion is reconciled when returning, and queued play/pause events obey native state', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio);
  const slider = p.$('.timeline-slider'); slider.value = '11'; p.fire(slider, 'input'); p.fire(slider, 'change');
  p.$('#tab-proactive').click(); audio.finishSeek(); p.$('#tab-interruption').click();
  assert.equal(p.$('#demo-media').getAttribute('aria-busy'), 'false');
  p.fire(audio, 'play'); assert.equal(p.$('.walkthrough-play').textContent, '▶ Play scene');
  p.$('.walkthrough-play').click(); p.fire(audio, 'pause');
  assert.equal(p.$('.walkthrough-play').textContent, 'Ⅱ Pause scene');
});

test('Hiding the page during a scrub prevents a later change event from resuming playback', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio); p.$('.walkthrough-play').click();
  const slider = p.$('.timeline-slider'); slider.value = '22'; p.fire(slider, 'input');
  Object.defineProperty(p.document, 'hidden', {value: true}); p.fire(p.document, 'visibilitychange');
  p.fire(slider, 'change'); assert.equal(audio.paused, true); assert.equal(p.frames.size, 0);
});


test('A cancelled pointer scrub commits once, and chapter navigation clears an unfinished preview', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio);
  const slider = p.$('.timeline-slider'); slider.value = '14'; p.fire(slider, 'input'); p.fire(slider, 'pointercancel');
  assert.deepEqual(audio.seeks, [14]); assert.equal(audio.paused, true);
  slider.value = '27'; p.fire(slider, 'input');
  p.$('.walkthrough-chapters button').click();
  assert.equal(audio.currentTime, 0); p.fire(slider, 'change');
  assert.equal(audio.currentTime, 0, 'Abandoned preview cannot override a chapter jump');
});


test('Dragging to the end stays complete instead of automatically replaying', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio); p.$('.walkthrough-play').click();
  const slider = p.$('.timeline-slider'); slider.value = '37'; p.fire(slider, 'input'); p.fire(slider, 'change');
  audio.finishSeek(); assert.equal(audio.currentTime, 37); assert.equal(audio.paused, true);
  assert.equal(p.$('.walkthrough-play').textContent, '↻ Replay scene'); assert.equal(p.frames.size, 0);
});


test('An error during seeking clears busy state and cancels any queued scrub resume', () => {
  const p = setup(), audio = p.players[0]; p.ready(audio);
  const slider = p.$('.timeline-slider'); slider.value = '10'; p.fire(slider, 'input'); p.fire(slider, 'change');
  assert.equal(p.$('#demo-media').getAttribute('aria-busy'), 'true');
  audio.error = {code: 2}; p.fire(audio, 'error');
  assert.equal(p.$('#demo-media').getAttribute('aria-busy'), 'false');
  assert.equal(p.$('#demo-panel').getAttribute('data-loading'), 'false');
  assert.equal(p.$('.media-error').hidden, false); assert.equal(p.frames.size, 0);
  assert.notEqual(p.$('.scene-status').textContent, 'Seeking…');
  p.$('.walkthrough-play').click(); assert.equal(audio.error, null, 'One click retries the failed load');
});


test('The Sites mirror uses the verified range-capable media origin with CORS captions', () => {
  const p = setup({hostname: 'venus-realtime.huoge2006.chatgpt.site'});
  assert.equal(p.players[0].src, 'https://realtime-venus.github.io/assets/demos/road-trip.m4a');
  assert.equal(p.players[0].crossOrigin, 'anonymous');
  p.$('#tab-proactive').click();
  assert.equal(p.$('video').src, 'https://realtime-venus.github.io/assets/demos/microwave.mp4?v=23');
  assert.equal(p.$('track').src, 'https://realtime-venus.github.io/assets/demos/microwave.en.vtt?v=27');
  assert.equal(setup({hostname: 'realtime-venus.github.io'}).players[0].src, './assets/demos/road-trip.m4a');
});

test('Microwave speech appears with playback, stays in the full transcript and rewinds correctly', () => {
  const p = setup(); p.$('#tab-proactive').click();
  const video = p.$('video'); p.ready(video);
  assert.equal(p.visible(), 0);
  assert.equal(p.all('.scene-transcript .transcript-item').length, 2);
  video.clock(3);
  assert.equal(p.visible(), 1);
  assert.match(p.$('.scene-chat .transcript-item').textContent, /Let me know when the microwave beeps/);
  video.clock(29.99); assert.equal(p.visible(), 1);
  video.clock(30); assert.equal(p.visible(), 2);
  assert.match(p.$('.scene-chat [aria-current="step"]').textContent, /heating cycle is complete/);
  video.clock(0); assert.equal(p.visible(), 0);
  video.clock(3); assert.equal(p.visible(), 1);
});
