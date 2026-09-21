# Realtime-Venus

Project website for **Realtime-Venus: A full-duplex interaction system with asynchronous delegation**.

**Public website:** https://realtime-venus.github.io/

**Android beta:** [Realtime-Venus-0918.apk](https://github.com/realtime-venus/realtime-venus.github.io/releases/download/android-beta-0918/Realtime-Venus-0918.apk) (21.2 MB). The homepage download button links to this GitHub prerelease asset.

## Website content

A demo-led presentation of proactive audio–visual interaction, full-duplex speech and asynchronous delegation. The first card plays a real stereo road-trip conversation with synchronized dialogue and a waveform measured from its two audio channels. The second card plays a recorded microwave scene with synchronized user and model dialogue and English subtitles. The third card pairs Shanghai landmark footage with the supplied user and assistant speech clips to illustrate a delegated flight search. All three scenes share a compact two-column layout: media and playback controls on the left, synchronized conversation and model state on the right. The conversation scrolls independently and follows new messages only while the visitor is near the bottom; scene notes and the complete transcript expand on demand. Narrow screens stack the same player and conversation. Visitors can play, pause, scrub, choose 1×/1.5×/2× playback, jump to chapters, watch a key moment, replay, and expand the complete transcript. All three players provide volume controls and use their native media clocks to drive the interface; both videos also provide captions and full-screen controls. Research highlights, expandable system and evaluation details, and a copyable citation follow the demos.

The method explains how the harness prepares a delegated reply and the frontend chooses speech timing, with the revised harness diagram and a concise description of the shared post-training recipe.

The reading order is overview → demos → how it works → results → report → other work and contact. The centered introduction leads to three scene cards, ordered interruption → proactive perception → delegation. Activating a card reveals its player and preserves the position and native buffer when returning to an already opened scene; keyboard arrows browse the cards without scrolling. Each example pairs playback with a key-moment explanation and a synchronized transcript. The dual-loop architecture is visible in the main story, with implementation, detailed benchmarks and BibTeX available on demand.

Scene 01 uses the supplied `case_stereo.wav` and `audio_demo.txt`. The original 37-second stereo PCM recording remains available as a fallback; playback uses a smaller AAC copy with the same stereo channels and timeline. Approximate dialogue cues are aligned to channel activity at 0, 3.5, 15.1 and 18.3 seconds; the first reply continues briefly after the follow-up starts, and the recording retains its silent tail. These cues are not response-latency measurements.

Scene 03 is assembled from the supplied `video.mp4`, `user.mp3`, `assistant_01.wav`, `assistant_02.wav`, and `dialogue.txt`. The video is resized to 1280×720 and encoded for the web; its original soundtrack is reduced to 15% volume under the complete speech clips. User speech begins at 4 s, the acknowledgement at 10 s and the final reply at 24 s. The final clip continues to 33.926833 s, preserving the full recording rather than cutting it at the storyboard’s 32 s endpoint. The video lasts 35.28 s. Delegation states illustrate the storyboard, not measured backend activity; flight details are demonstration content, not live availability.

Scene 02 uses the supplied `test2_microwave.mp4` and the reply in `test2_microwave_io.jsonl`. The web-optimized H.264/AAC copy preserves the original 45-second timeline and audio. The opening request uses the user-confirmed wording with an approximate 1.74–4.64-second cue. No dialogue is inferred from the intervening appliance sounds. The log’s `played` interval, 30–34.28 seconds, supplies the model reply and its subtitle timing. The generation interval is not used as subtitle timing. Only demonstration content is published; internal paths and run metadata are omitted. Research scores remain from the September 9, 2026 manuscript. Scene 03 follows the supplied English dialogue.

Dialogue appears as complete messages at the aligned events; no word-level speech timing is implied. Playback starts only on visitor action. The selected demo preloads when the section approaches the viewport; Save-Data and slow 2G connections keep metadata-only loading until playback is requested. Other demos are not speculatively downloaded. On the Sites mirror, media and caption requests use the public GitHub Pages origin with anonymous CORS, since the Sites static asset proxy returns complete files instead of preserving byte-range requests. Local and GitHub Pages playback keep relative URLs. Dragging previews the timeline, commits one seek on release, and resumes only if playback was active. Animation frames read native media time for smooth progress; transcript DOM and scroll measurements update only when their state changes. Reduced-motion preferences disable message entrances and activity motion, without changing the recording timelines.

## Other team work

The closing gallery presents three supplied recordings: gaze-based museum guidance, menu recognition, and ring-controlled capture. The source files come from the supplied Realtime-Venus directory and its ring-demo subfolder; model-repository sample clips are excluded. Descriptive English labels identify the video content, without claiming that all examples use the Realtime-Venus model.

Each card initially contains only a lazy-loaded poster and a normal video link. The native player is created on the visitor’s first click, so gallery recordings do not download during initial page loading. Full recordings retain their audio, use browser-compatible H.264/AAC and fast-start metadata, and play through the existing range-capable GitHub media origin on the Sites mirror. Only one recording plays at a time across the gallery and main demos. Playback also pauses when the page is hidden, and a failed player exposes a retry action and direct video link.

The gallery ends with clickable contact addresses: `huangyuge.hyg@antgroup.com` and `rex.lj@antgroup.com`.

## Local preview

The complete static site is in `dist/`. There are no runtime dependencies or build steps. The DOM regression tests have a separate development-only dependency in `tests/`.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Run the timeline regression checks with `node --test tests/demo-timeline.test.cjs`. For the complete suite, run `npm ci --prefix tests` and `npm test --prefix tests`; the player tests cover delayed media events, buffering, scene reuse, reduced-data preloading, scrub-and-resume behavior, native-clock rendering, and stale callbacks. They cover overlapping delegation/input, interruption handling, the recorded microwave subtitle interval, the assembled delegation timeline, rewinding and completion.

## Add recorded demos

Edit `dist/assets/demos.js`. For an existing scene, set `type` to `audio` or `video` and add a direct media URL or a path to a file inside `dist/`. Native media playback drives the shared, keyboard-accessible controls and never autoplays. Update the scene title, summary, source, duration, opening, phases, chapter marks and timed events to describe the real recording. Activity indicators illustrate the scene rather than reporting live model telemetry. Use a preview server with byte-range support to check recording seeking.

```js
{
  id: 'proactive',
  type: 'video',
  src: './assets/demos/proactive.mp4',
  poster: './assets/demos/proactive-poster.jpg',
  captions: './assets/demos/proactive.en.vtt',
  language: 'en',
  // Keep and update the existing model, category, title, summary and source.
}
```

`poster`, `captions` and `language` are optional. Use owned or authorized footage and captions. Never add API keys or credentials to the static website. The introduction links to the user-supplied Realtime-Venus repositories on GitHub, Hugging Face, and ModelScope.

## Files

- `dist/index.html`: page content and navigation.
- `dist/assets/site.css`: responsive styling.
- `dist/assets/site.js`: walkthroughs, video playback and citation copying.
- `dist/assets/team-work.js`: click-to-load video gallery and playback coordination.
- `dist/assets/team-work/`: complete team videos optimized for the web and extracted cover frames.
- `dist/assets/demos.js`: demo content and media settings.
- `dist/assets/demo-engine.js`: shared, deterministic timeline state for animation and navigation.
- `dist/assets/demos/shanghai-flights.mp4`: Shanghai footage combined with the three supplied speech clips.
- `dist/assets/demos/shanghai-flights-poster.jpg`: Shanghai skyline cover extracted from the footage.
- `dist/assets/demos/shanghai-flights.en.vtt`: complete user/assistant utterances aligned to the clips.
- `dist/assets/demos/road-trip.wav`: original stereo road-trip recording and compatibility fallback.
- `dist/assets/venus-logo-white.png`: supplied Realtime-Venus brand mark for the header on a light background.
- `dist/assets/demos/road-trip.m4a`: AAC delivery copy with unchanged duration and stereo channels.
- `dist/assets/demos/road-trip-waveform.svg`: measured two-channel amplitude envelope.
- `dist/assets/demos/microwave.mp4`: H.264 delivery copy with fast-start metadata, short keyframe intervals, and the original AAC audio.
- `dist/assets/demos/microwave-poster.jpg`: cover frame extracted from the recording.
- `dist/assets/demos/microwave.en.vtt`: English dialogue subtitles, with the user-confirmed opening request and the model reply aligned to the JSONL playback interval.
- `dist/assets/*example.png`: Figure 4 examples extracted from the revised report.
- `dist/assets/harness-architecture.png`: Figure 7, task capture, dispatch, reply preparation and delivery.
- `dist/assets/system-overview.png`, `model-memory.png`, `benchmark-radars.png`: updated report figures. The radar export’s browser print header, footer and whitespace are excluded.
- `dist/assets/*filmstrip.jpg`: original manuscript image strips.
- `dist/assets/fonts/InterVariable.woff2`: self-hosted Inter variable font.

## Typography and editorial style

The interface uses white, pale blue-gray and brand-tinted surfaces. The `#1677FF` brand accent follows the [official Ant Design color specification](https://ant-design.antgroup.com/docs/spec/colors-cn); its darker `#0958D9` shade keeps small links and button labels readable. Brand blue unifies the centered hero, scene-card selection, activity indicators and metrics. White space, compact pill buttons and larger headings distinguish introduction, examples and evidence. Channel labels distinguish listening, speech and delegation; interruption notes use a restrained text accent. Demo controls sit directly below the media; conversation sits alongside it on desktop. Compact scene selectors keep the active player in focus. A broad 6-of-8 comparison sits above three capability-focused metric cards.

Inter is bundled from the [official Inter distribution](https://rsms.me/inter/) with its SIL Open Font License in `dist/assets/fonts/OFL.txt`. It is served locally; visitors do not need to contact an external font provider. The layout uses 400, 500 and 600 weights, a 16 px body size, and a 13 px minimum for supporting labels. Heading sizes adapt to viewport width. Code uses a system monospace face; metrics and timestamps use tabular numerals. Demo timestamp labels use MM:SS throughout, with complete time ranges kept together on narrow screens. Displayed seconds are truncated; the original fractional cue times still control playback synchronization.

Use sentence case for headings and interface labels. Preserve official names (`Realtime-Venus-Omni`, `Realtime-Venus-Audio`, `Realtime-Venus-Harness`), benchmark names and acronyms. Use `BibTeX`, `Figure 4` and `15 s` rather than all-caps labels or zero-padded figure numbers. Keep dynamic demo labels consistent with the initial HTML.

## Presentation references

The information design draws on the English [SeedRealtime page](https://seed.bytedance.com/en/SeedRealtime) and [GPT-Live introduction](https://openai.com/index/introducing-gpt-live/): spacious introductions, concrete situations next to their examples, and a clear path from behavior to mechanism and evidence. All product copy, demonstrations, figures and scores remain grounded in the Realtime-Venus report; no reference-site media or product claims are reused.

## Deployment

The `main` branch holds source; the `gh-pages` branch publishes the contents of `dist/` at the site root. The private Sites preview at `https://venus-realtime.huoge2006.chatgpt.site` is a separate deployment of the same static output. Workspace-only downloads and notes in `work/` and packaged deliverables in `outputs/` are excluded from Git.
