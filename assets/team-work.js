(() => {
  const cards = Array.from(document.querySelectorAll('.team-work-card'));
  if (!cards.length) return;
  const deliveryOrigin = window.location?.hostname === 'venus-realtime.huoge2006.chatgpt.site'
    ? 'https://realtime-venus.github.io/' : null;
  const mediaURL = source => deliveryOrigin ? new URL(source, deliveryOrigin).href : source;
  const players = new Set();

  // Create and load a player only after a visitor chooses a video.
  cards.forEach(card => {
    const link = card.querySelector('.team-work-play');
    const error = card.querySelector('.team-work-error');
    const title = card.querySelector('h3').textContent;
    const source = mediaURL(link.getAttribute('href'));
    card.querySelector('.team-work-error a').href = source;
    let player;
    const showError = () => {
      error.hidden = false;
      link.hidden = false;
      player.hidden = true;
    };
    link.addEventListener('click', event => {
      event.preventDefault();
      if (!player) {
        player = document.createElement('video');
        player.className = 'team-work-video';
        player.controls = true;
        player.playsInline = true;
        player.preload = 'auto';
        player.tabIndex = 0;
        player.setAttribute('aria-label', title);
        player.poster = link.querySelector('img').getAttribute('src');
        if (deliveryOrigin) player.crossOrigin = 'anonymous';
        player.src = source;
        player.addEventListener('error', showError);
        players.add(player);
        card.querySelector('.team-work-media').append(player);
      } else if (player.error) {
        player.load();
      }
      link.hidden = true;
      error.hidden = true;
      player.hidden = false;
      player.focus({preventScroll: true});
      player.play()?.catch(reason => {
        if (reason.name !== 'AbortError') showError();
      });
    });
  });

  // Native play events also cover the existing demos, so audio never overlaps.
  document.addEventListener('play', event => {
    const active = event.target;
    if (!active.matches?.('audio, video') || active.paused) return;
    if (players.has(active)) {
      document.querySelectorAll('audio, video').forEach(other => {
        if (other !== active) other.pause();
      });
    } else {
      players.forEach(player => player.pause());
    }
  }, true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) players.forEach(player => player.pause());
  });
})();
