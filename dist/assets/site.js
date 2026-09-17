(() => {
  const copyButton = document.getElementById('copy-citation');
  const copyStatus = document.getElementById('copy-status');
  const citation = document.getElementById('bibtex');
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(citation.textContent);
      copyStatus.textContent = 'Citation copied to clipboard.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(citation);
      selection.removeAllRanges(); selection.addRange(range);
      copyStatus.textContent = 'Citation selected. Press Ctrl+C or ⌘C to copy.';
    }
  });

  const demoOrder = ['interruption', 'proactive', 'delegation'];
  const demos = [...(window.VENUS_DEMOS || [])].sort((a, b) => demoOrder.indexOf(a.id) - demoOrder.indexOf(b.id));
  const tabs = Array.from(document.querySelectorAll('.demo-tab'));
  const panel = document.getElementById('demo-panel');
  const media = document.getElementById('demo-media');
  const controls = document.getElementById('demo-controls');
  const spotlight = document.getElementById('demo-spotlight');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current, time = 0, playing = false, animation = 0, previous = null, speed = 1;
  let ui = {}, lastPhase = '', lastVisible = '';
  const timestamp = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  const cueTimestamp = value => timestamp(value) + (Number.isInteger(value) ? '' : (value % 1).toFixed(2).slice(1));
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function button(className, text, action) {
    const el = node('button', className, text); el.type = 'button'; el.addEventListener('click', action); return el;
  }
  function stop() {
    playing = false; cancelAnimationFrame(animation); previous = null;
    panel.dataset.playing = 'false';
    if (ui.video) ui.playRequest++;
    ui.video?.pause();
  }
  function showVideoError(message) {
    ui.playError.replaceChildren(node('span', '', message + ' '));
    const link = node('a', '', 'Open the video directly');
    link.href = current.src; link.target = '_blank'; link.rel = 'noopener';
    ui.playError.append(link); ui.playError.hidden = false;
  }
  function setVideoTime(value) {
    time = Math.max(0, Math.min(current.duration, value));
    if (ui.video.readyState < 1) ui.pendingSeek = time;
    else { ui.pendingSeek = null; ui.video.currentTime = time; }
  }
  function seek(value) {
    stop();
    if (ui.video) setVideoTime(value); else time = value;
    update();
  }
  function start(value) {
    if (ui.video) {
      if (ui.video.error) { const resume = time; ui.video.load(); setVideoTime(resume); }
      if (Number.isFinite(value)) setVideoTime(value);
      else if (ui.video.ended || time >= current.duration) setVideoTime(0);
      const selectedUI = ui;
      const request = ++ui.playRequest;
      ui.playError.hidden = true;
      ui.video.play()?.catch(error => {
        if (ui !== selectedUI || request !== ui.playRequest || error.name === 'AbortError') return;
        playing = false; ui.buffering = false; update();
        showVideoError('Playback could not start. Press Play scene to retry.');
      });
      return;
    }
    if (Number.isFinite(value)) time = value;
    if (time >= current.duration) time = 0;
    stop(); playing = true; previous = null;
    update(); animation = requestAnimationFrame(tick);
  }
  function toggle() {
    if (ui.video ? !ui.video.paused : playing) { stop(); update(); } else start();
  }
  function tick(now) {
    if (!playing) return;
    if (previous !== null) time += (now - previous) / 1000 * speed;
    previous = now; update();
    if (playing) animation = requestAnimationFrame(tick);
  }
  function update() {
    if (!current) return;
    const state = window.VenusScene.frame(current, time);
    time = state.time;
    if (state.complete && playing) stop();
    panel.dataset.playing = String(playing);
    panel.dataset.accent = state.phase.accent || 'default';
    panel.dataset.complete = String(state.complete);
    ui.play.textContent = state.complete ? '↻ Replay scene' : playing ? 'Ⅱ Pause scene' : '▶ Play scene';
    ui.play.setAttribute('aria-pressed', String(playing));
    ui.status.textContent = state.complete ? 'Complete' : ui.buffering && playing ? 'Loading video…' : playing ? 'Playing' : time === 0 ? 'Ready to play' : 'Paused';
    ui.counter.textContent = `${state.phaseIndex + 1} / ${current.phases.length}`;
    ui.scrubber.value = String(time);
    ui.scrubber.setAttribute('aria-valuetext', `${timestamp(time)} of ${timestamp(current.duration)}`);
    ui.time.textContent = `${timestamp(time)} / ${timestamp(current.duration)}`;
    if (ui.filmCursor) {
      const progress = reducedMotion.matches ? state.phase.time / current.filmstripDuration : state.filmProgress;
      ui.filmCursor.style.left = `${progress * 100}%`;
    }
    const phaseKey = `${state.phaseIndex}:${state.complete}`;
    if (phaseKey !== lastPhase) {
      ui.heading.textContent = state.phase.title;
      ui.detail.textContent = state.phase.detail;
      ui.announcement.textContent = state.complete ? 'Scene complete. Replay it or choose the next scene.' : state.phase.title;
      lastPhase = phaseKey;
    }
    Object.entries(ui.channels).forEach(([channel, el]) => {
      const active = state.channels.includes(channel);
      el.dataset.active = String(active);
      el.querySelector('.channel-state').textContent = active ? 'Active' : 'Idle';
    });
    ui.empty.hidden = state.visible.length > 0;
    ui.chat.hidden = !state.visible.length;
    current.events.forEach((event, i) => {
      const el = ui.chat.children[i];
      const visible = state.visible.includes(i), active = state.active.includes(i);
      el.hidden = !visible;
      el.classList.toggle('is-active', active);
      el.classList.toggle('has-played', visible);
      el.classList.toggle('was-interrupted', !!event.interrupted && time >= event.end);
      if (active) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
      const interrupted = el.querySelector('.transcript-note');
      if (interrupted) interrupted.hidden = time < event.end;
    });
    const visibleKey = state.visible.join(',');
    if (visibleKey !== lastVisible) {
      // Scroll only the conversation viewport, never the visitor's page.
      ui.viewport.scrollTop = ui.viewport.scrollHeight;
      lastVisible = visibleKey;
    }
    ui.chapters.forEach((el, i) => {
      if (state.chapter === i) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    ui.next.hidden = !state.complete;
  }
  function makeTranscript(interactive) {
    const list = node('ol', interactive ? 'walkthrough-transcript scene-chat' : 'walkthrough-transcript');
    list.setAttribute('aria-label', interactive ? 'Conversation at this point in the scene' : 'Full scene transcript');
    current.events.forEach(event => {
      const item = node('li', 'transcript-item' + (event.role === 'Realtime-Venus' ? ' from-venus' : '') + (event.kind ? ' ' + event.kind : ''));
      const head = node('div', 'transcript-head');
      const cueTime = current.type === 'video' ? `${cueTimestamp(event.time)}–${cueTimestamp(event.end)}` : timestamp(event.time);
      head.append(node('strong', '', event.role), node('span', '', cueTime));
      item.append(head, node('p', '', event.text));
      if (event.interrupted) item.append(node('span', 'transcript-note', 'Interrupted · Realtime-Venus yields to your follow-up'));
      list.append(item);
    });
    return list;
  }
  function appendTranscript() {
    const details = node('details', 'scene-transcript');
    const summary = node('summary', 'disclosure-summary');
    const action = node('span', 'disclosure-action'); action.setAttribute('aria-hidden', 'true');
    action.append(node('span', 'disclosure-expand', 'Expand'), node('span', 'disclosure-collapse', 'Collapse'), node('span', 'disclosure-icon'));
    summary.append(node('span', 'disclosure-copy', 'Read the full transcript'), action);
    const transcript = makeTranscript(false);
    details.append(summary, transcript);
    controls.append(details);
    if (current.note) controls.append(node('p', 'playback-note', current.note));
    return transcript;
  }
  function showScene() {
    const isVideo = current.type === 'video';
    const stage = node('div', 'scene-stage' + (isVideo ? ' scene-recording' : ''));
    const header = node('div', 'scene-topline');
    ui.status = node('span', 'scene-status'); ui.counter = node('span', 'scene-counter');
    header.append(ui.status, ui.counter); stage.append(header);
    const phase = node('div', 'scene-phase');
    ui.heading = node('h4'); ui.detail = node('p'); phase.append(ui.heading, ui.detail); stage.append(phase);
    ui.announcement = node('p', 'sr-only'); ui.announcement.setAttribute('role', 'status'); ui.announcement.setAttribute('aria-live', 'polite');
    stage.append(ui.announcement);
    if (isVideo) appendVideo(stage);
    if (current.filmstrip) {
      const film = node('div', 'scene-film');
      const label = node('div', 'scene-film-label'); label.append(node('span', '', 'Original paper frames'), node('span', '', 'Illustrated timeline'));
      const frame = node('div', 'scene-film-frame');
      const strip = node('img', 'filmstrip'); strip.src = current.filmstrip; strip.alt = current.filmstripAlt;
      ui.filmCursor = node('span', 'film-cursor'); ui.filmCursor.setAttribute('aria-hidden', 'true');
      frame.append(strip, ui.filmCursor);
      const axis = node('div', 'scene-film-axis'); axis.setAttribute('aria-hidden', 'true');
      [0,10,20,30,40].forEach(t => axis.append(node('span', '', `${t} s`)));
      film.append(label, frame, axis); stage.append(film);
    }
    const channelBox = node('div', 'scene-channels');
    channelBox.setAttribute('aria-label', 'Illustrated model activity');
    ui.channels = {};
    [['listen', 'Listen', 'Input stream'], ['speak', 'Speak', 'Realtime-Venus response'], ['delegate', 'Delegate', 'Background task']].forEach(([key, title, subtitle]) => {
      const channel = node('div', 'scene-channel ' + key);
      const row = node('div', 'channel-heading'); row.append(node('strong', '', title), node('span', 'channel-state', 'Idle'));
      const meter = node('div', 'channel-meter'); meter.setAttribute('aria-hidden', 'true'); meter.append(node('span'));
      channel.append(row, node('span', 'channel-description', subtitle), meter);
      ui.channels[key] = channel; channelBox.append(channel);
    });
    stage.append(channelBox);
    ui.viewport = node('div', 'scene-conversation');
    ui.viewport.setAttribute('role', 'region');
    ui.viewport.setAttribute('aria-label', isVideo ? 'Model response in the recorded scene' : 'Scene conversation. Scroll to review earlier messages.');
    if (!isVideo) ui.viewport.tabIndex = 0;
    ui.empty = node('div', 'scene-opening');
    ui.empty.append(node('span', 'scene-opening-label', 'The scene'), node('p', '', current.opening), button('scene-start', '▶ Play this scene', () => start()));
    ui.chat = makeTranscript(true); ui.viewport.append(ui.empty, ui.chat); stage.append(ui.viewport);
    media.append(stage);

    const bar = node('div', 'playback-bar');
    ui.play = button('walkthrough-play', '▶ Play scene', toggle); ui.play.setAttribute('aria-pressed', 'false');
    ui.time = node('span', 'playback-time'); ui.time.setAttribute('aria-hidden', 'true');
    const speedLabel = node('label', 'playback-speed', 'Playback speed');
    const speedSelect = node('select');
    [1,1.5,2].forEach(rate => { const option = node('option', '', `${rate}×`); option.value = String(rate); speedSelect.append(option); });
    ui.speed = speedSelect;
    speedSelect.value = String(speed); speedSelect.addEventListener('change', () => { speed = Number(speedSelect.value); previous = null; if (ui.video) ui.video.playbackRate = speed; }); speedLabel.append(speedSelect);
    ui.scrubber = node('input', 'timeline-slider'); ui.scrubber.type = 'range'; ui.scrubber.min = '0'; ui.scrubber.max = String(current.duration); ui.scrubber.step = '.1'; ui.scrubber.setAttribute('aria-label', 'Scene timeline');
    ui.scrubber.addEventListener('input', () => seek(Number(ui.scrubber.value)));
    bar.append(ui.play, ui.time, speedLabel, ui.scrubber); controls.append(bar);
    const chapters = node('div', 'walkthrough-chapters'); chapters.setAttribute('aria-label', 'Jump to a scene chapter');
    ui.chapters = current.marks.map(mark => {
      const el = button('', `${mark.time} s · ${mark.label}`, () => seek(mark.time)); chapters.append(el); return el;
    });
    ui.next = button('scene-next', 'Next scene →', () => {
      const index = demos.findIndex(demo => demo.id === current.id);
      select(demos[(index + 1) % demos.length].id);
      panel.focus({preventScroll: true});
    });
    chapters.append(ui.next); controls.append(chapters);
    if (isVideo) appendVideoTools();
    ui.transcript = appendTranscript();
    update();
  }
  function appendVideo(stage) {
    const recording = current, selectedUI = ui;
    const frame = node('div', 'scene-film scene-video');
    const label = node('div', 'scene-film-label');
    label.append(node('span', '', 'Recorded scene'), node('span', '', 'Audio + video'));
    const video = node('video', 'recorded-demo');
    ui.video = video; ui.pendingSeek = null; ui.buffering = false; ui.playRequest = 0;
    video.controls = false; video.playsInline = true; video.preload = 'metadata'; video.src = current.src;
    video.playbackRate = speed; video.setAttribute('aria-label', current.title);
    if (current.width && current.height) { video.width = current.width; video.height = current.height; video.style.aspectRatio = `${current.width} / ${current.height}`; }
    if (current.poster) video.poster = current.poster;
    if (current.captions) {
      const track = node('track'); track.kind = 'subtitles'; track.src = current.captions;
      track.srclang = current.language || 'en'; track.label = 'Model response (English)'; track.default = true;
      video.append(track); ui.captionTrack = track;
    }
    video.append(node('p', '', 'Your browser does not support this video.'));
    const sync = () => {
      if (ui !== selectedUI) return;
      time = ui.pendingSeek ?? (Number.isFinite(video.currentTime) ? video.currentTime : 0);
      playing = !video.paused && !video.ended;
      update();
      if (ui.transcript) recording.events.forEach((event, i) => {
        const item = ui.transcript.children[i], active = time >= event.time && time < event.end;
        item.classList.toggle('is-active', active);
        if (active) item.setAttribute('aria-current', 'step'); else item.removeAttribute('aria-current');
      });
    };
    ['timeupdate', 'seeked', 'play', 'pause', 'ended'].forEach(event => video.addEventListener(event, sync));
    video.addEventListener('loadedmetadata', () => {
      if (ui !== selectedUI) return;
      if (Number.isFinite(video.duration) && video.duration > 0) { current.duration = video.duration; ui.scrubber.max = String(video.duration); }
      if (ui.pendingSeek !== null) setVideoTime(ui.pendingSeek);
      sync();
    });
    video.addEventListener('waiting', () => { if (ui === selectedUI) { ui.buffering = true; sync(); } });
    ['playing', 'canplay'].forEach(event => video.addEventListener(event, () => { if (ui === selectedUI) { ui.buffering = false; sync(); } }));
    video.addEventListener('ratechange', () => { if (ui === selectedUI) { speed = video.playbackRate; ui.speed.value = String(speed); } });
    video.addEventListener('error', () => {
      if (ui !== selectedUI) return;
      ui.playRequest++;
      playing = false; ui.buffering = false; update();
      showVideoError('The recording could not be loaded.');
    });
    frame.append(label, video); stage.append(frame);
  }
  function appendVideoTools() {
    const video = ui.video, selectedUI = ui;
    const tools = node('div', 'video-tools'); tools.setAttribute('aria-label', 'Video sound and display controls');
    const mute = button('video-tool', 'Mute', () => {
      if (video.muted || video.volume === 0) { video.muted = false; if (video.volume === 0) video.volume = 1; }
      else video.muted = true;
    });
    mute.setAttribute('aria-pressed', 'false');
    const volumeLabel = node('label', 'video-volume');
    volumeLabel.append(node('span', 'sr-only', 'Video volume'));
    const volume = node('input'); volume.type = 'range'; volume.min = '0'; volume.max = '1'; volume.step = '.05'; volume.value = '1';
    volume.setAttribute('aria-label', 'Video volume');
    volume.addEventListener('input', () => { video.volume = Number(volume.value); video.muted = video.volume === 0; });
    volumeLabel.append(volume);
    video.addEventListener('volumechange', () => {
      const muted = video.muted || video.volume === 0;
      mute.textContent = muted ? 'Unmute' : 'Mute'; mute.setAttribute('aria-pressed', String(muted)); volume.value = String(muted ? 0 : video.volume);
    });
    tools.append(mute, volumeLabel);
    if (ui.captionTrack) {
      const captionTrack = ui.captionTrack;
      const applyCaptions = () => { if (captionTrack.track) captionTrack.track.mode = captions.getAttribute('aria-pressed') === 'true' ? 'showing' : 'disabled'; };
      const captions = button('video-tool', 'Captions', () => {
        const enabled = captions.getAttribute('aria-pressed') !== 'true';
        captions.setAttribute('aria-pressed', String(enabled));
        applyCaptions();
      });
      captionTrack.addEventListener('load', applyCaptions);
      video.textTracks?.addEventListener('change', () => {
        if (captionTrack.track) captions.setAttribute('aria-pressed', String(captionTrack.track.mode === 'showing'));
      });
      captions.setAttribute('aria-pressed', 'true'); tools.append(captions);
    }
    const fullscreen = button('video-tool', 'Full screen', () => {
      video.controls = true;
      try {
        if (video.requestFullscreen) video.requestFullscreen()?.catch(() => { video.controls = false; });
        else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      } catch { video.controls = false; }
    });
    fullscreen.hidden = !video.requestFullscreen && !video.webkitEnterFullscreen;
    const restoreControls = () => { if (ui === selectedUI && !document.fullscreenElement && !video.webkitDisplayingFullscreen) video.controls = false; };
    video.addEventListener('fullscreenchange', restoreControls);
    video.addEventListener('webkitendfullscreen', restoreControls);
    tools.append(fullscreen); controls.append(tools);
    ui.playError = node('p', 'video-error'); ui.playError.setAttribute('role', 'status'); ui.playError.hidden = true;
    controls.append(ui.playError);
  }
  function select(id, focus = false) {
    const match = demos.find(demo => demo.id === id);
    if (!match) return;
    stop(); current = match; time = 0;
    media.replaceChildren(); controls.replaceChildren(); ui = {}; lastPhase = ''; lastVisible = '';
    panel.dataset.complete = 'false'; panel.dataset.accent = 'default';
    tabs.forEach(tab => { const active = tab.dataset.demo === id; tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1; if (active && focus) tab.focus(); });
    panel.setAttribute('aria-labelledby', 'tab-' + id);
    document.getElementById('demo-model').textContent = current.model;
    document.getElementById('demo-format').textContent = current.type === 'video' ? 'Recorded demo' : 'Animated research example';
    document.getElementById('demo-category').textContent = current.category;
    document.getElementById('demo-title').textContent = current.title;
    document.getElementById('demo-summary').textContent = current.summary;
    document.getElementById('demo-takeaway').textContent = current.takeaway || current.summary;
    document.getElementById('demo-source').textContent = current.source;
    const figureLink = document.getElementById('demo-figure-link'); figureLink.hidden = !current.figure;
    if (current.figure) figureLink.href = current.figure;
    spotlight.hidden = !current.spotlight;
    if (!spotlight.hidden) spotlight.textContent = current.spotlight.label + ' ↗';
    showScene();
  }
  spotlight.addEventListener('click', () => {
    if (!current.spotlight) return;
    start(Math.max(0, current.spotlight.time - 2));
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      select(tab.dataset.demo);
      panel.scrollIntoView?.({behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start'});
      panel.focus({preventScroll: true});
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); select(tabs[next].dataset.demo, true); }
    });
  });
  document.querySelectorAll('[data-open-demo]').forEach(link => {
    link.addEventListener('click', () => select(link.dataset.openDemo));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stop(); update(); }
  });
  if (demos.length) select(demos[0].id);
})();
