// Chat engine — renders the `flow` state machine (defined in journey.js) into
// the WhatsApp-style chat UI. Nothing journey-specific lives here, so this file
// can be reused as-is for other brand demos; only journey.js changes.

const chat = document.getElementById('chat');
const statusEl = document.getElementById('status');
const filepick = document.getElementById('filepick');

// How long the "typing…" dots show before each bot message appears (ms).
const TYPING_MS = 800;

// Preload every journey image up front so it's cached before its state renders.
// (Late-loading images were reflowing the option lists off-screen.)
Object.keys(IMG).forEach(function (k) { var i = new Image(); i.src = IMG[k]; });

function time() {
  var d = new Date();
  return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}

// All scrolling is instant + pinned to the bottom. Smooth scrolling caused
// competing animations that left option lists cut off mid-scroll.
function scrollBottom() { chat.scrollTop = chat.scrollHeight; }

function bot(html) {
  var d = document.createElement('div');
  d.className = 'b in';
  d.innerHTML = html + '<div class="t">' + time() + '</div>';
  chat.appendChild(d);
  scrollBottom();
}

function user(label) {
  var d = document.createElement('div');
  d.className = 'b out';
  d.innerHTML = label + '<div class="t">' + time() + ' <span class="tick">&#10003;&#10003;</span></div>';
  chat.appendChild(d);
  scrollBottom();
}

function opts(list) {
  var c = document.createElement('div');
  c.className = 'opts';
  c.innerHTML = list.map(function (o) {
    var label = o[0], target = o[1], url = o[2];
    // [label, nextState, url]  -> opens the link in a new tab AND advances the flow
    if (url) {
      return '<a class="qr" href="' + url + '" target="_blank" rel="noopener" data-next="' + target + '" data-label="' + label + '">' + label + '</a>';
    }
    // [label, url]            -> external link only
    if (/^https?:\/\//.test(target)) {
      return '<a class="qr" href="' + target + '" target="_blank" rel="noopener">' + label + '</a>';
    }
    // [label, nextState]      -> advance the flow (target 'upload' opens the photo picker)
    return '<div class="qr" data-next="' + target + '" data-label="' + label + '">' + label + '</div>';
  }).join('');
  chat.appendChild(c);
  c.scrollIntoView({ block: 'end' });        // guarantee the card itself is visible
  setTimeout(function () { c.scrollIntoView({ block: 'end' }); scrollBottom(); }, 80);
}

function typing() {
  var d = document.createElement('div');
  d.className = 'typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  chat.appendChild(d);
  scrollBottom();
  return d;
}

// Render a state: optional date divider, messages, options, then auto-advance.
function render(key) {
  var f = flow[key];
  if (f.day) {
    var p = document.createElement('div');
    p.className = 'day';
    p.textContent = f.day;
    chat.appendChild(p);
  }
  f.m.forEach(bot);
  if (f.o) opts(f.o);
  if (f.auto) {
    var t = typing();
    statusEl.textContent = 'typing…';
    setTimeout(function () {
      t.remove();
      statusEl.textContent = 'online';
      render(f.auto);
    }, f.delay || TYPING_MS);  // a state can set `delay` to hold the dots longer
  }
}

// Re-pin to the bottom whenever any chat image finishes loading.
chat.addEventListener('load', function (e) {
  if (e.target && e.target.tagName === 'IMG') scrollBottom();
}, true);

// Show the typing indicator, then render the next state.
function advance(next) {
  var t = typing();
  statusEl.textContent = 'typing…';
  setTimeout(function () {
    t.remove();
    statusEl.textContent = 'online';
    render(next);
  }, TYPING_MS);
}

// Tapping an option: echo it as the user's reply, show typing, then advance.
// (A 'upload' target opens the photo picker instead — the flow continues once a file is chosen.)
chat.addEventListener('click', function (e) {
  var b = e.target.closest('[data-next]');
  if (!b) return;
  if (b.dataset.next === 'upload') { filepick.click(); return; }
  var card = b.closest('.opts');
  if (card) card.remove();
  user(b.dataset.label);
  advance(b.dataset.next);
});

// Photo upload: show the chosen image as the user's message, then continue.
filepick.addEventListener('change', function () {
  var f = filepick.files && filepick.files[0];
  if (!f) return;
  var cards = chat.querySelectorAll('.opts');
  if (cards.length) cards[cards.length - 1].remove();
  var reader = new FileReader();
  reader.onload = function () {
    user('<img class="prod" src="' + reader.result + '" alt="Your photo">');
    advance('working');
  };
  reader.readAsDataURL(f);
  filepick.value = '';
});

document.getElementById('reset').addEventListener('click', function () {
  chat.innerHTML = '';
  advance('start');
});

// Open with the typing dots, then post the first message.
advance('start');
