const grid=document.querySelector('#photo-grid');
const descriptions={1:'The formal arrival',2:'The entrance gates',3:'The private approach',9:'The grand foyer',17:'The wood-paneled salon',20:'The glass atrium',25:'The chef’s kitchen',31:'Light-filled living',35:'The primary retreat',46:'Custom dressing room',48:'The upper gallery',54:'A private bedroom suite',65:'Guest bedroom',78:'The private office',83:'The private theater',85:'Recreation lounge',93:'The billiards room',111:'Pool and gardens',114:'The pool pavilion',117:'The covered terrace',120:'The outdoor kitchen',124:'Poolside living',127:'The outdoor fireplace',131:'Outdoor recreation',133:'A garden path',135:'The motor court',138:'The kitchen garden',139:'The fitness pavilion',147:'The front courtyard',150:'The formal garden from above',153:'The estate from above',154:'An aerial perspective',157:'The rear elevation',160:'The lake setting',164:'The estate at twilight',165:'An evening arrival'};
const category=n=>n>=150?'Aerial':n>=111?'Grounds':n<=8?'Residence':'Interiors';
const photos=Array.from({length:165},(_,i)=>({id:i+1,category:category(i+1),label:descriptions[i+1]||`${category(i+1)} · View ${String(i+1).padStart(3,'0')}`,src:`assets/${String(i+1).padStart(3,'0')}.jpg`}));
const preferred=[1,9,25,31,35,124,83,93,117,138,153,165,17,20,46,48,54,65,78,85,111,114,120,127,131,133,135,139,147,150,154,157,160,164];
const ordered=[...preferred.map(n=>photos[n-1]),...photos.filter(p=>!preferred.includes(p.id))];
let filter='All',shown=12;
function render(){const selected=ordered.filter(p=>filter==='All'||p.category===filter);grid.replaceChildren(...selected.slice(0,shown).map(p=>{const b=document.createElement('button');b.className='photo-tile';b.setAttribute('aria-label',`Open photograph: ${p.label}`);const img=document.createElement('img');img.src=p.src;img.alt=p.label;img.loading='lazy';const caption=document.createElement('span');caption.className='tile-label';const name=document.createElement('span');name.textContent=p.label;const arrow=document.createElement('span');arrow.textContent='↗';caption.append(name,arrow);b.append(img,caption);b.addEventListener('click',()=>openViewer(p.id,selected,false));return b}));document.querySelector('#photo-count').textContent=`${Math.min(shown,selected.length)} of ${selected.length} photographs`;document.querySelector('#load-more').hidden=shown>=selected.length;}
function setFilter(value){filter=value;shown=12;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});render()}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>setFilter(a.dataset.filterLink)));
document.querySelector('#load-more').addEventListener('click',()=>{shown+=18;render()});render();
const dialog=document.querySelector('#lightbox'),viewer=document.querySelector('#viewer-image'),playButton=document.querySelector('#autoplay');
let currentSet=[],index=0,timer=null,lastFocus=null;
function paint(){const p=currentSet[index];viewer.src=p.src;viewer.alt=p.label;document.querySelector('#viewer-caption').textContent=p.label;document.querySelector('#viewer-count').textContent=`${String(index+1).padStart(2,'0')} / ${currentSet.length}`;document.querySelector('#story-progress').style.width=`${((index+1)/currentSet.length)*100}%`;}
function move(delta){index=(index+delta+currentSet.length)%currentSet.length;paint()}
function stop(){clearInterval(timer);timer=null;playButton.textContent='Play story ▶';playButton.setAttribute('aria-label','Play slideshow')}
function play(){stop();timer=setInterval(()=>move(1),4800);playButton.textContent='Pause Ⅱ';playButton.setAttribute('aria-label','Pause slideshow')}
function openViewer(id,set=ordered,autoplay=false){lastFocus=document.activeElement;currentSet=set;index=Math.max(0,set.findIndex(p=>p.id===id));paint();dialog.showModal();document.body.classList.add('viewer-open');if(autoplay)play();else stop();}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openViewer(Number(b.dataset.open),ordered.filter(p=>p.category==='Interiors'))));
document.querySelector('[data-story]').addEventListener('click',()=>openViewer(165,[165,2,1,9,17,25,31,35,83,124,153,164].map(n=>photos[n-1]),true));
document.querySelector('#close-viewer').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{stop();document.body.classList.remove('viewer-open');lastFocus?.focus()});
document.querySelector('#previous').addEventListener('click',()=>{stop();move(-1)});document.querySelector('#next').addEventListener('click',()=>{stop();move(1)});
playButton.addEventListener('click',()=>timer?stop():play());
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();stop();move(1)}if(e.key==='ArrowLeft'){e.preventDefault();stop();move(-1)}});
document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>d.querySelector('b').textContent=d.open?'−':'+'));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.intro-grid,.stats,.editorial,.detail-row figure,.details>div,.gallery-heading').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
