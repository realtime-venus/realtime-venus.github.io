# Realtime-Venus

Project website for **Realtime-Venus: A full-duplex interaction system with asynchronous delegation**.

**Public website:** https://realtime-venus.github.io/

## Website content

A demo-led presentation of proactive audio–visual interaction, full-duplex speech and asynchronous delegation. Two animated paper-example scenes reveal dialogue at each event and show the listening, speaking and delegation state. The second card plays a recorded microwave scene with its synchronized model transcript and English subtitles. All three scenes share the phase header, activity indicators, blue response bubbles and playback controls. Visitors can play, pause, scrub, choose 1×/1.5×/2× playback, jump to chapters, watch a key moment, replay, and expand the complete transcript. The recording also provides volume, captions and full-screen controls; its native media clock drives the shared interface. Research highlights, expandable system and evaluation details, and a copyable citation follow the demos.

The method explains how the harness prepares a delegated reply and the frontend chooses speech timing, with the revised harness diagram and a concise description of the shared post-training recipe.

The reading order is overview → demos → how it works → results → report. The centered introduction leads to three scene cards, ordered interruption → proactive perception → delegation. Activating a card reveals its player; keyboard arrows browse the cards without scrolling. Each example pairs playback with a key-moment explanation; the animated examples also link to their source figures. The dual-loop architecture is visible in the main story, with implementation, detailed benchmarks and BibTeX available on demand.

Scenes 01 and 03 are **illustrations reconstructed from Figure 4**, not real model recordings or a live service. Scene 02 uses the supplied `test2_microwave.mp4` and the reply in `test2_microwave_io.jsonl`. The MP4 is 45 seconds; the log’s `played` interval, 30–34.28 seconds, supplies the transcript and subtitle timing. The generation interval is not used as subtitle timing. Only the model dialogue is published; internal paths and run metadata are omitted. Research scores remain from the September 9, 2026 manuscript. The delegation transcript is translated from Chinese and its example traffic information is not current guidance.

The filmstrip cursor uses the original figure’s 0–40 s axis, independently of the shorter authored playback endpoints. Dialogue appears as complete messages at the reported events; no word-level speech timing or generated audio is implied. Playback starts only on visitor action. Reduced-motion preferences disable message entrances and activity motion, and make the filmstrip cursor step between phases.

## Local preview

The complete static site is in `dist/`. There are no dependencies or build steps.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Run the timeline regression checks with `node --test tests/demo-timeline.test.cjs`. They cover overlapping delegation/input, interruption handling, the recorded microwave subtitle interval, the original filmstrip time axis, rewinding and completion.

## Add recorded demos

Edit `dist/assets/demos.js`. For an existing scene, set `type` to `video` and add a direct video URL or a path to a file inside `dist/`. Native video playback drives the shared, keyboard-accessible controls and never autoplays. Update the scene title, summary, source, duration, opening, phases, chapter marks and timed events to describe the real recording. Activity indicators illustrate the scene rather than reporting live model telemetry. Use a preview server with byte-range support to check video seeking.

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

`poster`, `captions` and `language` are optional. Use owned or authorized footage and captions. Never add API keys or credentials to the static website. The manuscript provides no public Venus model/code download URL, so none has been invented.

## Files

- `dist/index.html`: page content and navigation.
- `dist/assets/site.css`: responsive styling.
- `dist/assets/site.js`: walkthroughs, video playback and citation copying.
- `dist/assets/demos.js`: demo content and media settings.
- `dist/assets/demo-engine.js`: shared, deterministic timeline state for animation and navigation.
- `dist/assets/demos/microwave.mp4`: supplied recording, remuxed for fast-start playback without re-encoding.
- `dist/assets/demos/microwave-poster.jpg`: cover frame extracted from the recording.
- `dist/assets/demos/microwave.en.vtt`: English model-response subtitles aligned to the JSONL playback interval.
- `dist/assets/*example.png`: Figure 4 examples extracted from the revised report.
- `dist/assets/harness-architecture.png`: Figure 7, task capture, dispatch, reply preparation and delivery.
- `dist/assets/system-overview.png`, `model-memory.png`, `benchmark-radars.png`: updated report figures. The radar export’s browser print header, footer and whitespace are excluded.
- `dist/assets/*filmstrip.jpg`: original manuscript image strips.
- `dist/assets/fonts/InterVariable.woff2`: self-hosted Inter variable font.

## Typography and editorial style

The interface uses white, pale blue-gray and brand-tinted surfaces. The `#1677FF` brand accent follows the [official Ant Design color specification](https://ant-design.antgroup.com/docs/spec/colors-cn); its darker `#0958D9` shade keeps small links and button labels readable. Brand blue unifies the centered hero, scene-card selection, activity indicators and metrics. White space, compact pill buttons and larger headings distinguish introduction, examples and evidence. Channel labels distinguish listening, speech and delegation; interruption notes use a restrained text accent. Demo controls share the same column as the scene. A broad 6-of-8 comparison sits above three capability-focused metric cards.

Inter is bundled from the [official Inter distribution](https://rsms.me/inter/) with its SIL Open Font License in `dist/assets/fonts/OFL.txt`. It is served locally; visitors do not need to contact an external font provider. The layout uses 400, 500 and 600 weights, a 16 px body size, and a 13 px minimum for supporting labels. Heading sizes adapt to viewport width. Code uses a system monospace face; metrics and timestamps use tabular numerals.

Use sentence case for headings and interface labels. Preserve official names (`Realtime-Venus-Omni`, `Realtime-Venus-Audio`, `Realtime-Venus-Harness`), benchmark names and acronyms. Use `BibTeX`, `Figure 4` and `13 s` rather than all-caps labels or zero-padded figure numbers. Keep dynamic demo labels consistent with the initial HTML.

## Presentation references

The information design draws on the English [SeedRealtime page](https://seed.bytedance.com/en/SeedRealtime) and [GPT-Live introduction](https://openai.com/index/introducing-gpt-live/): spacious introductions, concrete situations next to their examples, and a clear path from behavior to mechanism and evidence. All product copy, demonstrations, figures and scores remain grounded in the Realtime-Venus report; no reference-site media or product claims are reused.

## Deployment

The `main` branch holds source; the `gh-pages` branch publishes the contents of `dist/` at the site root. The private Sites preview at `https://venus-realtime.huoge2006.chatgpt.site` is a separate deployment of the same static output. Workspace-only downloads and notes in `work/` and packaged deliverables in `outputs/` are excluded from Git.
