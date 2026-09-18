const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {parseHTML} = require('linkedom');

function setup(hostname = 'localhost') {
  const root = path.join(__dirname, '../dist');
  const {document, window: dom} = parseHTML(fs.readFileSync(path.join(root, 'index.html'), 'utf8'));
  document.querySelectorAll('noscript').forEach(el => el.remove());
  const create = document.createElement.bind(document), players = [];
  // Linkedom bubbles these events to exercise the document media coordinator.
  const fire = (el, type) => el.dispatchEvent(new dom.Event(type, {bubbles: true}));
  document.createElement = tag => {
    const el = create(tag);
    if (tag === 'video' || tag === 'audio') {
      Object.assign(el, {paused: true, plays: 0, loads: 0, error: null});
      el.play = () => {el.plays++; el.paused = false; fire(el, 'play'); return Promise.resolve();};
      el.pause = () => {el.paused = true;};
      el.load = () => {el.loads++; el.error = null;};
      players.push(el);
    }
    return el;
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'assets/team-work.js'), 'utf8'), {document, window: {location: {hostname}}, URL});
  return {document, players, fire, cards: [...document.querySelectorAll('.team-work-card')]};
}

test('Team videos stay unloaded until selected and retain native controls and the full source', () => {
  const p = setup('venus-realtime.huoge2006.chatgpt.site');
  assert.equal(p.players.length, 0);
  assert.equal(p.document.querySelectorAll('#team-work video').length, 0);
  const card = p.cards[0], link = card.querySelector('.team-work-play');
  const source = link.getAttribute('href');
  link.click();
  const player = p.players[0];
  assert.equal(p.players.length, 1);
  assert.equal(player.src, new URL(source, 'https://realtime-venus.github.io/').href);
  assert.equal(player.crossOrigin, 'anonymous');
  assert.equal(player.controls, true);
  assert.equal(player.playsInline, true);
  assert.equal(player.hasAttribute('autoplay'), false);
  assert.equal(player.plays, 1);
  assert.equal(link.hidden, true, 'The initial play overlay disappears once native controls take over');
  assert.equal(card.querySelector('.team-work-error a').href, player.src);
});

test('Starting another recording pauses previous audio, and hiding the page pauses the gallery', () => {
  const p = setup(), first = p.cards[0].querySelector('.team-work-play'), second = p.cards[1].querySelector('.team-work-play');
  const demo = p.document.createElement('audio'); p.document.body.append(demo); demo.play();
  first.click();
  assert.equal(demo.paused, true);
  const one = p.players[1]; assert.equal(one.paused, false);
  second.click();
  const two = p.players[2]; assert.equal(one.paused, true); assert.equal(two.paused, false);
  demo.play(); assert.equal(two.paused, true);
  two.play(); Object.defineProperty(p.document, 'hidden', {value: true}); p.fire(p.document, 'visibilitychange');
  assert.equal(two.paused, true);
});

test('A media error restores the play action and retries the same player', () => {
  const p = setup(), card = p.cards[0], link = card.querySelector('.team-work-play');
  link.click(); const player = p.players[0];
  player.error = {code: 2}; p.fire(player, 'error');
  assert.equal(link.hidden, false); assert.equal(player.hidden, true);
  assert.equal(card.querySelector('.team-work-error').hidden, false);
  link.click();
  assert.equal(p.players.length, 1); assert.equal(player.loads, 1); assert.equal(player.plays, 2);
  assert.equal(card.querySelector('.team-work-error').hidden, true);
  assert.equal(player.src, link.getAttribute('href'));
});
