// Journey definition for the Crocs WhatsApp delivery demo.
// State shape:
//   m    - array of bot message HTML strings, rendered in order
//   o    - array of [label, nextStateKey] options the user can tap
//   auto - after rendering, auto-advance to this state (with a typing indicator)
//   day  - optional date divider shown above the messages
//
// To build a new demo: point IMG at new assets and edit the states below.

const IMG = {
  product: 'assets/crocs-clogs.gif', // "your Crocs are on the way" hero (animated clogs)
  map:     'assets/map.png',      // pick-up points map
  qr:      'assets/qr.png',          // collection QR code
  wiggle:  'assets/wiggle-crocs.gif', // delivered Crocs (animated)
  sale:    'assets/sale.jpg',         // 30% off flash-sale banner
  customcroc: 'assets/custom-croc.gif', // customise-your-Crocs promo
  charmcrocs: 'assets/charm-crocs.png'  // result: Crocs with charms added
};

const flow={
  start:{day:'Today',m:['<img class="prod" src="'+IMG.product+'" alt="Crocs"><b>Your Crocs are on the way, Aisha!</b><br><br> Want to change your delivery?'],
    o:[['Deliver to Pick-up Point','pickup'],['Leave with Neighbour','neighbour'],['Change Delivery Day','changeday']]},
  pickup:{m:['<img class="prod" src="'+IMG.map+'" alt="Pick-up points map">Here are pick-up points near you: 📍'],
    o:[['Costcutter, Norwood Rd','costcutter'],['Tesco, Brockwell St','tesco'],['Wine &amp; Beer, Gin Ln','wineandbeer']]},
  costcutter:{m:['We&#39;ll deliver to <b>Costcutter, Norwood Rd</b>.<br><br>📍 12 Norwood Rd, London SE24 9AA<br><br><b>Opening times</b><br>Mon–Sat&nbsp;&nbsp;7:00am – 10:00pm<br>Sun&nbsp;&nbsp;8:00am – 8:00pm'],
    o:[['Back to Main Menu','start'],['Continue','qrcode']]},
  tesco:{m:['We&#39;ll deliver to <b>Tesco, Brockwell St</b>.<br><br>📍 5 Brockwell St, London SE24 0EB<br><br><b>Opening times</b><br>Mon–Sat&nbsp;&nbsp;6:00am – 11:00pm<br>Sun&nbsp;&nbsp;10:00am – 4:00pm'],
    o:[['Back to Main Menu','start'],['Continue','qrcode']]},
  wineandbeer:{m:['Ok, we&#39;ll deliver to <b>Wine &amp; Beer, Gin Ln</b>.<br><br>📍 9 Gin Lane, London SE24 9JR<br><br><b>Opening times</b><br>Mon–Sat&nbsp;&nbsp;10:00am – 10:00pm<br>Sun&nbsp;&nbsp;12:00pm – 6:00pm'],
    o:[['Back to Main Menu','start'],['Continue','qrcode']]},
  qrcode:{m:['<img class="prod" src="'+IMG.qr+'" alt="Collection QR code" style="width:170px;display:block;margin:2px auto 8px">Show this QR code at the till to collect your Crocs.'],
    o:[['Collected','delivered']]},
  delivered:{m:['<img class="prod" src="'+IMG.wiggle+'" alt="Crocs">How are your Crocs, Aisha? Looking snazzy? 😎'],
    o:[["They&#39;re great! Leave Review 😍",'review'],['Not Quite Right — Return','returnflow']]},
  returnflow:{m:['No problem — we&#39;ll arrange a return. A free returns label is on its way to your WhatsApp and email.'],auto:'sale'},
  review:{m:['Amazing — thank you! ⭐⭐⭐⭐⭐<br>Your review helps other shoppers.'],auto:'sale'},
  sale:{m:['<img class="prod" src="'+IMG.sale+'" alt="30% off sale">🎉 Flash sale! For the next <b>24 hours only</b>, enjoy <b>30% off</b> your next order.'],
    o:[['Shop Sale','customise','https://www.crocs.co.uk/'],['Opt Out','optout']]},
  optout:{m:['Ok, you&#39;ve been taken off our marketing list.'],o:[['Restart Demo','start']]},
  customise:{m:['<img class="prod" src="'+IMG.customcroc+'" alt="Custom Crocs">Want us to customise your Crocs for you?? 🎨<br><br>Upload an image and we&#39;ll add charms!'],
    o:[['📷 Upload a Photo','upload']]},
  working:{m:['We&#39;re working our magic… ✨'],
    auto:'charming', delay:2000},
  charming:{m:['<img class="prod" src="'+IMG.charmcrocs+'" alt="Your charmed Crocs">Don&#39;t they look amazing???? 🤩'],
    o:[['Get Charms','https://www.crocs.co.uk/c/jibbitz-charms?msockid=3adc51d2c0476dde164d468cc12c6cf4']]},
  neighbour:{m:['No problem — which neighbour should we try?'],
    o:[['No. 23 · Sam','n23'],['No. 27 · Priya','n27'],['Go Back','start']]},
  n23:{m:["Got it — we'll leave it with <b>Sam at No. 23</b> and post a card through your door."],o:[['Track My Parcel','track'],["That's Everything",'end']]},
  n27:{m:["Got it — we'll leave it with <b>Priya at No. 27</b> and post a card through your door."],o:[['Track My Parcel','track'],["That's Everything",'end']]},
  changeday:{m:['Sure — pick a new delivery day:'],
    o:[['Tomorrow · Tue','dtue'],['Saturday','dsat'],['Go Back','start']]},
  dtue:{m:["Updated to <b>tomorrow</b>. You'll get a 1-hour window the morning of."],o:[['Track My Parcel','track'],["That's Everything",'end']]},
  dsat:{m:["Updated to <b>Saturday</b>. You'll get a 1-hour window the morning of."],o:[['Track My Parcel','track'],["That's Everything",'end']]},
  track:{m:['Your driver is 4 stops away, arriving around <b>2:15pm</b>. I\'ll send a live link 10 minutes before.'],o:[['Great','end'],['Make Another Change','start']]},
  end:{m:['Brilliant — enjoy your new Crocs.'],o:[['Restart Demo','start']]}
};
