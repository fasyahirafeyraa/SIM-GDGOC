// ===== DATA CONTOH (ganti dengan data asli atau API) =====
const m = (name, division, batch, points, attendance, status, role, photo='') =>
  ({ name, division, batch, points, attendance, status, role, photo });
const seed = {
  members: [
    m('Rafi Aditya Pratama','Machine Learning',2022,1450,95,'Active','Division Lead'),
    m('Siti Nurhaliza Rahman','UI/UX Design',2022,1320,92,'Active','Core Team'),
    m('Bima Sakti Wijaya','Mobile Development',2023,1180,88,'Active','Member'),
    m('Annisa Putri Handayani','Back-End Development',2023,1095,90,'Active','Core Team'),
    m('Dimas Fauzan Hakim','Cyber Security',2022,980,85,'Active','Division Lead'),
    m('Larasati Dewi Kusuma','Community Dev',2023,870,82,'Active','Secretary'),
    m('Rizky Firmansyah','Front-End Development',2024,720,78,'Active','Member'),
    m('Kartika Sari Indah','Creative Design',2024,640,75,'Active','Member'),
    m('Arief Budiman Santoso','Machine Learning',2021,2100,93,'Alumni','Former Lead'),
    m('Nadia Fitria Azzahra','Mobile Development',2024,520,70,'Active','Member'),
    m('Fadhil Ramadan Putra','Game Development',2023,310,45,'Inactive','Member'),
    m('Mutiara Anggraeni','Public Relations',2022,760,80,'Active','Core Team')
  ],
  activities: [
    ['GDG DevFest 2025','Conference','2025-11-15',45,50,100,'Completed','🎯','blue','Konferensi tahunan untuk mengenal teknologi Google, sesi komunitas, dan inspirasi membangun produk.'],
    ['Flutter for Beginners Workshop','Workshop','2025-10-20',32,40,50,'Completed','🛠️','orange','Workshop praktis membuat aplikasi lintas platform dengan Flutter dari dasar hingga aplikasi sederhana.'],
    ['Study Jam: ML Fundamentals','Study Jam','2025-12-01',28,30,75,'Completed','📖','green','Belajar Machine Learning bersama melalui teori singkat, studi kasus, dan sesi coding kolaboratif.'],
    ['Monthly Meeting — Jan 2026','Meeting','2026-01-10',38,45,20,'Completed','📋','gray','Pertemuan rutin untuk evaluasi program, koordinasi divisi, dan rencana kegiatan bulan berikutnya.'],
    ['Hackathon: Build for Sustainability','Hackathon','2026-02-14',22,25,150,'Completed','💻','red','Kompetisi membangun solusi teknologi berkelanjutan dengan sesi mentoring dan presentasi proyek.'],
    ['UX Research Workshop','Workshop','2026-03-05',18,20,50,'Completed','🔬','orange','Workshop riset pengguna, wawancara, analisis kebutuhan, dan penyusunan insight untuk desain produk.'],
    ['GDG Info Session 2026','Recruitment','2026-09-20',0,200,30,'Upcoming','📣','blue','Sesi informasi terbuka untuk mengenal GDGoC UNSRI, divisi, program tahunan, dan cara bergabung.']
  ].map(([name,type,date,joined,quota,pts,status,icon,color,description]) => ({name,type,date,joined,quota,pts,status,icon,color,description})),
  attendance: [
    ['Rafi Aditya Pratama',0,'Present'],['Siti Nurhaliza Rahman',0,'Present'],['Bima Sakti Wijaya',0,'Late'],
    ['Annisa Putri Handayani',0,'Present'],['Dimas Fauzan Hakim',0,'Excused'],['Larasati Dewi Kusuma',0,'Present'],
    ['Rizky Firmansyah',0,'Absent'],['Rafi Aditya Pratama',2,'Present'],['Siti Nurhaliza Rahman',2,'Present'],
    ['Bima Sakti Wijaya',1,'Present']
  ],
  registrations: []
};

const KEY = 'gdgoc-member-v2';
let db = structuredClone(seed);
try { db = JSON.parse(localStorage.getItem(KEY)) || db; } catch {}
if (!Array.isArray(db.registrations)) db.registrations = [];
if (Array.isArray(db.activities)) db.activities.forEach(a => { const seedActivity=seed.activities.find(x=>x.name===a.name); if (seedActivity && !a.description) a.description=seedActivity.description; });
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch {} };

// ===== UTILITAS =====
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
const date = d => new Date(d+'T00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const ranked = () => [...db.members].sort((a,b) => b.points - a.points);
const badge = s => `<span class="badge ${s}">${s}</span>`;
const bar = (pct, color) => `<div class="bar ${color}"><span style="width:${Math.min(pct,100)}%"></span></div>`;
const level = p => p >= 90 ? 'green' : p >= 75 ? 'orange' : 'red';
const short = n => n.split(' ').slice(0,2).join(' ');
const tint = ['orange','gray','red','blue','green'];
const badgesOf = name => { const i = seed.members.findIndex(p=>p.name===name);
  return {0:'⚡🏆',1:'⚡🏆',2:'⚡🥇',3:'⚡🏆',4:'⚡⭐',5:'🌱🤝',6:'💻',7:'🎨',8:'⚡🏆',9:'📱',10:'',11:'🤝🌱'}[i] ?? ''; };
const chips = (list, current, key) => list.map(v =>
  `<button class="chip ${v===current?'on':''}" data-set="${key}" data-val="${esc(v)}">${esc(v)}</button>`).join('');
const table = (heads, rows) => `<div class="card table"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead>
  <tbody>${rows.join('') || `<tr><td colspan="${heads.length}">Data tidak ditemukan.</td></tr>`}</tbody></table></div>`;
const stats = (items, cls='') => `<div class="stats ${cls}">${items.map(([icon,val,label,color,sub]) =>
  `<div class="stat"><i class="${color}">${icon}</i><div><b class="${color}">${val}</b><small>${label}</small>${sub?`<em>${sub}</em>`:''}</div></div>`).join('')}</div>`;
const podium = list => `<div class="podium">${[1,0,2].filter(i=>list[i]).map(i => {
  const p = list[i], color = ['orange','gray','red'][i];
  return `<div class="${color}"><span>${['🥇','🥈','🥉'][i]}</span><span class="avatar">${esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase())}</span>
    <b class="name">${esc(short(p.name))}</b><small class="muted">${esc(p.division)}</small><b>${p.points} pts</b>
    <div class="step" style="height:${[110,84,68][i]}px">#${i+1}</div></div>`;}).join('')}</div>`;

const seedOrder = p => { const i = seed.members.findIndex(x=>x.name===p.name); return i<0 ? 99 : i; };
const state = { year:'2025', layout:'list', status:'All', query:'', division:'All', period:'Overall', event:'All', activity:'All', registrationName:'' };
// Faktor simulasi untuk filter periode (belum ada riwayat poin per tanggal)
const factor = { Overall:1, Monthly:.12, Semester:.45, Annual:.8 };

// ===== HALAMAN =====
const pages = {
  home: ['Home','Welcome to GDGoC UNSRI Admin Portal', () => `
    <div class="hero"><u class="dot d1"></u><u class="dot d2"></u><u class="ring r1"></u><u class="ring r2"></u><u class="dot d3"></u><u class="dot d4"></u><u class="star s1">★</u><u class="spark">✨</u>
      <div class="pill"><span class="logo mini">GC</span> Google Developer Groups Universitas Sriwijaya</div>
      <h1><span class="red">Let's</span> <span class="blue">Connect,<br>Learn,</span> <span class="orange">and</span> <span class="green">Grow!</span></h1>
      <p class="pill sub">The centralized member engagement &amp; contribution platform</p>
      <div><a class="btn primary" href="#dashboard">Go to Dashboard &nbsp;→</a><a class="btn" href="#members">View Members →</a></div></div>
    ${stats([['👥',90,'Total Members','blue','89 active'],['📅','82%','Avg Attendance','green','across 7 events'],['✨',89,'Contributions','orange','verified records'],['🏅',5,'Competitions','red','delegations']],'strip')}
    <div class="band"><div class="row between"><div><h3>🏆 <span class="blue">Top</span> <span class="orange">Members</span></h3><small class="muted">Ranked by total accumulated points</small></div><a class="btn" href="#leaderboard">Full Leaderboard →</a></div>${podium(ranked())}</div>
    <div class="band white"><h3 class="red">📂 Divisions</h3><small class="muted">Find your best place to grow</small><div class="divs">
      <div class="green"><b>Curriculum Divisions</b><div class="tags">${['Machine Learning','Mobile Development','UI/UX Design','Front-End Dev','Back-End Dev','Cyber Security','Game Development'].map(d=>`<span>${d}</span>`).join('')}</div></div>
      <div class="orange"><b>Non-Curriculum Divisions</b><div class="tags">${['Community Development','Public Relations','Creative Design','Project Management','Copywriting'].map(d=>`<span>${d}</span>`).join('')}</div></div></div></div>
    <div class="cta"><u class="star s2">★</u><u class="dot d5"></u><h2>Let's <span>Connect,</span><br><span>Learn,</span> and <em>Grow!</em></h2><p>Join our growing community of developers</p><a class="btn" href="#members">🔷 Explore Members</a></div>`],

  dashboard: ['Dashboard','Organization overview & key metrics', () => `
    <div class="banner"><u class="star s3">★</u><p>Welcome back, Admin 👋</p><h2>GDGoC UNSRI — <span>Member Dashboard</span></h2>
      <div class="row">${[['90','Active Members','of 89 total'],['2,600','This Month Points','+37% vs last month'],['Sep 20','Next Event','Info Session 2026']].map(([a,b,c])=>`<div><b>${a}</b>${b}<em>${c}</em></div>`).join('')}</div></div>
    ${stats([['👥',90,'Total Members','blue','89 registered'],['📅','82%','Avg Attendance','green','7 events'],['✨',89,'Contributions','orange','verified'],['🎖️',37,'Achievements','red','badges awarded']],'cards')}
    <div class="two dash"><div class="card top5"><div class="row between nowrap"><h4>🏆 Top 5<br>Leaderboard</h4><a class="link" href="#leaderboard">View<br>all →</a></div>
      ${ranked().slice(0,5).map((p,i)=>`<div class="${tint[i]}"><i class="rank r${i}">${i+1}</i><span><b>${esc(p.name)}</b>${bar(p.points/21,tint[i])}</span><strong>${p.points}</strong></div>`).join('')}</div>
    <div class="card recent"><div class="row between"><h4>🗓️ Recent Activities</h4><a class="link" href="#activities">View all →</a></div>
      ${db.activities.filter(a=>a.status==='Completed').slice(0,4).map(a=>`<div><i>${a.icon}</i><span><b>${esc(a.name)}</b><small>${date(a.date)} • ${esc(a.type)}</small></span><p><b class="green">+${a.pts} pts</b>${badge(a.status)}</p></div>`).join('')}</div></div>
    <div class="card"><div class="row between"><h4>📊 Monthly Point Growth</h4><div class="row years">${chips(['2025','2026'],state.year,'year')}</div></div><div class="chart">
      ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'].map((mo,i)=>{const h=(state.year==='2025'?[46,71,54,80,65,88,73,100,42]:[55,62,70,58,84,76,90,68,50])[i];
        return `<div class="${['blue','red','orange','green'][i%4]}"><span style="height:${h}%" title="${mo}: ${h}% dari puncak"></span><small>${mo}</small></div>`}).join('')}</div></div>
    <div class="awards">${[['⚡','Most Active','Rafi Aditya','95% attendance','blue'],['🏆','Top Contributor','Siti Nurhaliza','15 contributions','orange'],['⭐','Competition Star','Dimas Fauzan','3 competitions','red'],['💯','Point Leader','Rafi Aditya','1,450 points','green']]
      .map(([ic,t,n,s,c])=>`<div class="card"><i>${ic}</i><span><em class="${c}">${t}</em><b>${n}</b><small>${s}</small></span></div>`).join('')}</div>`],

  members: ['Members','Browse and manage member profiles', () => {
    const q = state.query.toLowerCase();
    const id = i => 'GDG' + String(i+1).padStart(3,'0');
    const list = db.members.map((p,i)=>({...p,i})).filter(p =>
      (state.status==='All' || p.status===state.status) &&
      (state.division==='All' || p.division===state.division) &&
      `${p.name} ${id(p.i)} ${p.division} ${p.batch}`.toLowerCase().includes(q));
    const divs = ['All', ...new Set(db.members.map(p=>p.division))];
    const menu = p => `<button class="dots" data-act="menu" data-i="${p.i}" aria-label="Menu ${esc(p.name)}">···</button>`;
    const avatar = p => { const initials = p.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase(); const index = seed.members.findIndex(x=>x.name===p.name); const tone = ['blue','orange','green','red','yellow','teal'][index >= 0 ? index % 6 : p.i % 6]; return `<span class="member-avatar ${tone}">${esc(initials)}</span>`; };
    return `<div class="toolbar"><div class="row"><span class="search"><input id="memberSearch" placeholder="Search name, ID, division..." value="${esc(state.query)}">🔍</span>
      <select id="division">${divs.map(d=>`<option ${d===state.division?'selected':''}>${esc(d)}</option>`).join('')}</select>
      ${chips(['All','Active','Inactive','Alumni'],state.status,'status')}</div>
      <div class="row"><button class="chip sq ${state.layout==='list'?'on':''}" data-set="layout" data-val="list" aria-label="Tampilan daftar">≡</button>
      <button class="chip sq ${state.layout==='grid'?'on':''}" data-set="layout" data-val="grid" aria-label="Tampilan grid">⊞</button>
      <button class="btn primary" data-act="addMember">+ Add Member</button></div></div>
    ${state.layout==='grid' ? `<div class="mgrid">${list.map(p=>`<div class="card member-card"><div class="row between"><span class="member-status">${badge(p.status)}</span>${menu(p)}</div><div class="member-grid-profile">${avatar(p)}<div><b>${esc(p.name)}</b><small class="muted">${id(p.i)} • ${esc(p.division)}</small></div></div><div class="member-grid-meta"><b class="blue">${p.points} pts</b><small>${p.attendance}% hadir</small></div>${bar(p.attendance,level(p.attendance))}</div>`).join('')}</div>`
    : `<div class="card table members"><table><thead><tr>${['Member','Division','Batch','Points','Attendance','Status',''].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${list.map(p=>`<tr>
      <td><div class="member-row-profile">${avatar(p)}<div><b>${esc(p.name)}</b><small>${id(p.i)}</small></div></div></td><td class="div">${esc(p.division)}</td><td class="muted">${p.batch}</td>
      <td><b class="blue pts">${p.points}</b></td><td><div class="att">${bar(p.attendance,level(p.attendance))}<small>${p.attendance}%</small></div></td><td>${badge(p.status)}</td>
      <td>${menu(p)}</td></tr>`).join('') || '<tr><td colspan="7">Data tidak ditemukan.</td></tr>'}</tbody></table>
    <div class="tfoot">Showing ${list.length} of ${db.members.length} members</div></div>`}`;
  }],

  leaderboard: ['Leaderboard','Member rankings by total points', () => {
    const list = ranked().map(p=>({...p, points:Math.round(p.points*factor[state.period])}));
    const top = list[0]?.points || 1;
    return `<div class="row big">${chips(Object.keys(factor),state.period,'period')}</div>
      <div class="rankbox"><u class="star s4">★</u><u class="dot d6"></u><u class="dot d7"></u><h3>🏆 <span class="blue">Member</span> <span class="orange">Rankings</span> <span class="green">— ${state.period}</span></h3>${podium(list)}</div>
      <div class="card table lead"><table><thead><tr>${['Rank','Member','Division','Progress','Pts','Badges'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${list.map((p,i)=>`<tr><td><i class="rank ${i<3?'r'+i:''}">${i+1}</i></td>
        <td><b>${esc(p.name)}</b><small>${p.batch} • ${esc(p.role)}</small></td><td class="div muted">${esc(p.division)}</td>
        <td class="prog">${bar(p.points/top*100, ['orange','gray','red'][i]||'sky')}</td><td><b class="blue">${p.points}</b></td><td>${badgesOf(p.name)}</td></tr>`).join('')}</tbody></table></div>`;
  }],

  attendance: ['Attendance','Activity attendance records', () => {
    const label = i => i===1 ? 'Flutter Workshop' : db.activities[i].name;
    const rows = db.attendance.filter(r => state.event==='All' || label(r[1])===state.event);
    const count = s => rows.filter(r=>r[2]===s).length;
    const events = ['All', ...[0,2,1].map(label)];
    return `${stats([['✅',count('Present'),'Present','green'],['⏰',count('Late'),'Late','orange'],['📝',count('Excused'),'Excused','blue'],['❌',count('Absent'),'Absent','red']],'cards small')}
      <div class="row small-chips">${chips(events,state.event,'event')}</div>
      <div class="card table attend"><table><thead><tr>${['Member','Activity','Date','Status'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(([n,i,s])=>`<tr><td><b>${esc(n)}</b></td><td>${esc(label(i))}</td><td class="muted">${date(db.activities[i].date)}</td><td>${badge(s)}</td></tr>`).join('') || '<tr><td colspan="4">Data tidak ditemukan.</td></tr>'}</tbody></table></div>
      <div class="card overview"><h4>Member Attendance Overview</h4><div>
      ${db.members.filter(p=>p.status!=='Alumni' && p.name!=='Fadhil Ramadan Putra').sort((a,b)=>seedOrder(a)-seedOrder(b)).map(p=>`<div class="item"><span><b>${esc(short(p.name))}</b>${bar(p.attendance,level(p.attendance))}</span><strong class="${level(p.attendance)}">${p.attendance}%</strong></div>`).join('')}</div></div>`;
  }],

  activities: ['Activities','Organizational events and programs', () => `
    <div class="row between big"><div class="row">${chips(['All','Upcoming','Completed'],state.activity,'activity')}</div>
      <button class="btn primary square" data-act="addActivity">+ Create Activity</button></div>
    <div class="acts">
    ${db.activities.filter(a=>state.activity==='All'||a.status===state.activity).map(a=>`<div class="card activity">
      <div class="row between top"><i class="${a.color}">${a.icon}</i>${badge(a.status)}</div><h4>${esc(a.name)}</h4>
      <span><span class="badge t ${a.color}">${esc(a.type)}</span></span>
      <small class="muted">📅 &nbsp;${date(a.date)}<br>👥 &nbsp;${a.joined}/${a.quota} attendees</small>${bar(a.joined/a.quota*100,a.color)}
      <p class="activity-description">${esc(a.description || 'Deskripsi kegiatan belum tersedia.')}</p>
      <div class="row between"><small class="muted">${a.joined}/${a.quota} joined</small><span class="badge Active pts">+${a.pts} pts</span></div>
      <button type="button" class="btn square" data-act="viewRegistrations" data-name="${esc(a.name)}">Lihat Pendaftar (${db.registrations.filter(r=>r.activity===a.name).length})</button></div>`).join('') || '<p>Belum ada kegiatan.</p>'}</div>`],

  profile: ['My Profile','Your personal dashboard and history', () => {
    const p = db.members[0];
    if (!p) return '<p>Belum ada data anggota.</p>';
    const rank = ranked().filter(x=>x.status!=='Alumni').findIndex(x=>x.name===p.name)+1, next = Math.floor(p.points/500+1)*500;
    return `<div class="card me"><div class="row between"><div class="row"><span class="photo">${esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase())}</span>
      <div><h2>${esc(p.name)}</h2><p class="muted">${esc(p.role)} — ${esc(p.division)}</p>${badge(p.status)}</div></div>
      <div class="row"><button class="btn square" data-act="editMember" data-i="0">Edit Profile</button><button class="btn primary square" data-act="share">Share</button></div></div>
      <div class="tiles">${[[p.points,'Total Points','blue'],[rank?'#'+rank:'-','Rank','orange'],[p.attendance+'%','Attendance','green'],[18,'Contributions','orange'],[5,'Competitions','red']].map(([v,l,c])=>`<div class="${c}"><b>${v}</b><small>${l}</small></div>`).join('')}</div></div>
    <div class="two prof"><div class="card"><h4>🎖️ My Achievements</h4><div class="achv">${[['⚡','Active Member','blue'],['🏆','Top Contributor','orange'],['🥇','Champion','orange'],['⭐','Competition Star','red'],['💯','Point Leader','red'],['📅','Consistent','blue'],['🔭','Tech Explorer','green']].map(([i,t,c])=>`<div class="${c}"><i>${i}</i>${t}</div>`).join('')}</div></div>
    <div class="card history"><h4>📊 Recent Point Activity</h4>
      ${[['Hackathon 2026 — 1st Place','Competition Win • Feb 14, 2026',200],['GDG DevFest 2025 — Speaker','Event Staff • Nov 15, 2025',150],['ML Workshop Series (4 sessions)','Mentoring • Sep 1, 2025',160],['Study Jam: ML Fundamentals','Study Jam • Dec 1, 2025',75]]
        .map(([t,s,n])=>`<div><i>🥇</i><span><b>${t}</b><small>${s}</small></span><strong class="green">+${n} pts</strong></div>`).join('')}
      <section><div class="row between"><b>Progress to ${next} pts milestone</b><b>${p.points}/${next}</b></div>${bar(p.points/next*100,'blue')}<small>Only ${next-p.points} pts more to unlock the next achievement!</small></section></div></div>`;
  }]
};

const memberPages = {
  'member-home': ['Beranda','Ringkasan aktivitas dan komunitas', () => {
    const p = db.members[0];
    return `<div class="member-hero"><div><span class="member-kicker">MEMBER PORTAL</span><h1>Halo, ${esc(short(p.name))}!</h1><p>Siap berkembang bersama komunitas GDGoC UNSRI hari ini?</p><a class="btn primary" href="#member-activities">Lihat kegiatan →</a></div><div class="member-hero-badge"><span>✦</span><b>${p.points}</b><small>Total poin</small></div></div>
      ${stats([['🏆',p.points,'Poin Saya','blue'],['📅',p.attendance+'%','Kehadiran','green'],['⭐',ranked().findIndex(x=>x.name===p.name)+1,'Peringkat','orange'],['🎖️',7,'Pencapaian','red']],'cards member-stats')}
      <div class="member-two"><div class="card"><div class="row between"><h4>Kegiatan Mendatang</h4><a class="link" href="#member-activities">Semua kegiatan →</a></div>${db.activities.filter(a=>a.status==='Upcoming').map(a=>`<div class="member-event"><i class="${a.color}">${a.icon}</i><div><b>${esc(a.name)}</b><small>${date(a.date)} • ${esc(a.type)}</small></div><button class="chip" data-act="joinActivity" data-name="${esc(a.name)}">Lihat</button></div>`).join('')||'<p class="muted">Belum ada kegiatan mendatang.</p>'}</div>
      <div class="card member-progress"><h4>Progress Milestone</h4><b>${p.points} / ${Math.floor(p.points/500+1)*500} poin</b>${bar(p.points/(Math.floor(p.points/500+1)*500)*100,'blue')}<small>Kumpulkan poin melalui workshop, event, dan kompetisi.</small></div></div>`;
  }],
  'member-activities': ['Kegiatan','Temukan dan ikuti program komunitas', () => `<div class="member-filter row">${chips(['All','Upcoming','Completed'],state.activity,'activity')}</div><div class="acts">${db.activities.filter(a=>state.activity==='All'||a.status===state.activity).map(a=>{ const registered=db.registrations.some(r=>r.activity===a.name&&r.name===db.members[0]?.name); return `<div class="card activity"><div class="row between top"><i class="${a.color}">${a.icon}</i>${badge(a.status)}</div><h4>${esc(a.name)}</h4><span class="badge t ${a.color}">${esc(a.type)}</span><small class="muted">📅 ${date(a.date)}<br>👥 ${a.joined}/${a.quota} peserta</small>${bar(a.joined/a.quota*100,a.color)}<button class="btn ${registered?'':'primary'} square" data-act="joinActivity" data-name="${esc(a.name)}">${registered?'✓ Sudah Terdaftar':a.status==='Upcoming'?'Daftar Kegiatan':'Lihat Detail'}</button></div>`}).join('')}</div>`],
  'member-attendance': ['Kehadiran','Riwayat kehadiran pribadi', () => `<div class="member-attendance-summary">${stats([['✅',pCount('Present'),'Hadir','green'],['⏰',pCount('Late'),'Terlambat','orange'],['❌',pCount('Absent'),'Tidak hadir','red']],'cards member-stats')}</div><div class="card table attend"><table><thead><tr>${['Kegiatan','Tanggal','Status'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${db.attendance.filter(r=>r[0]==='Rafi Aditya Pratama').map(([n,i,s])=>`<tr><td><b>${esc(db.activities[i].name)}</b></td><td class="muted">${date(db.activities[i].date)}</td><td>${badge(s)}</td></tr>`).join('')||'<tr><td colspan="3">Belum ada riwayat kehadiran.</td></tr>'}</tbody></table></div>`],
  'member-leaderboard': ['Leaderboard','Peringkat kontribusi anggota', () => `<div class="rankbox"><h3>🏆 Peringkat Anggota</h3>${podium(ranked())}</div><div class="card table lead"><table><thead><tr>${['Rank','Member','Divisi','Poin'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${ranked().map((p,i)=>`<tr><td><i class="rank ${i<3?'r'+i:''}">${i+1}</i></td><td><div class="member-row-profile">${memberAvatar(p,i)}<b>${esc(p.name)}</b></div></td><td class="muted">${esc(p.division)}</td><td><b class="blue">${p.points}</b></td></tr>`).join('')}</tbody></table></div>`],
  'member-profile': ['Profil Saya','Kelola identitas dan pencapaian', () => { const p=db.members[0]; const profilePhoto=p.photo?`<img src="${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.remove()">`:''; const initials=esc(p.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()); return `<div class="card member-profile-card"><div class="row between"><div class="row"><span class="member-profile-avatar">${profilePhoto}<span class="profile-initial">${initials}</span></span><div><h2>${esc(p.name)}</h2><p class="muted">${esc(p.role)} • ${esc(p.division)}</p>${badge(p.status)}</div></div><button class="btn square" data-act="editMember" data-i="0">Edit Profil</button></div><div class="tiles">${[[p.points,'Poin','blue'],['#'+(ranked().findIndex(x=>x.name===p.name)+1),'Peringkat','orange'],[p.attendance+'%','Kehadiran','green'],[7,'Pencapaian','red']].map(([v,l,c])=>`<div class="${c}"><b>${v}</b><small>${l}</small></div>`).join('')}</div></div><div class="card"><h4>Informasi Anggota</h4><div class="profile-details"><p><span>ID Anggota</span><b>GDG001</b></p><p><span>Angkatan</span><b>${p.batch}</b></p><p><span>Divisi</span><b>${esc(p.division)}</b></p><p><span>Status</span><b>${esc(p.status)}</b></p></div></div>`; }]
};
const memberIcons = {'member-home':'⌂','member-activities':'▦','member-attendance':'✓','member-leaderboard':'♛','member-profile':'◉'};
const pCount = status => db.attendance.filter(r=>r[0]==='Rafi Aditya Pratama'&&r[2]===status).length;
function memberAvatar(p,i=0){const initials=p.name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();const tones=['blue','orange','green','red','yellow','teal'];return p.photo?`<span class="member-avatar photo-avatar ${tones[i%tones.length]}"><img src="${esc(p.photo)}" alt="${esc(p.name)}" onerror="this.replaceWith(document.createTextNode('${esc(initials)}'))"></span>`:`<span class="member-avatar ${tones[i%tones.length]}">${esc(initials)}</span>`};

// ===== ROUTER =====
const icons = {home:'🏠',dashboard:'⊞',members:'👥',leaderboard:'🏆',attendance:'📅',activities:'🗓️',profile:'👤'};
let loggedIn = false, portalRole = 'admin';
function render() {
  $('#login').hidden = loggedIn; $('#app').hidden = !loggedIn;
  if (!loggedIn) return;
  const source = portalRole === 'member' ? memberPages : pages;
  const fallback = portalRole === 'member' ? 'member-home' : 'home';
  const id = source[location.hash.slice(1)] ? location.hash.slice(1) : fallback;
  const [title, sub, view] = source[id];
  $('#title').textContent = title; $('#subtitle').textContent = sub;
  $('#app').classList.toggle('member-portal',portalRole==='member');
  $('#nav').innerHTML = portalRole==='member'
    ? Object.entries(memberPages).map(([k,v])=>`<a href="#${k}" class="${k===id?'on':''}"><i>${memberIcons[k]}</i>${v[0]}</a>`).join('')
    : Object.entries(pages).map(([k,v])=>`<a href="#${k}" class="${k===id?'on':''}"><i>${icons[k]}</i>${v[0]}</a>`).join('');
  $('.side-brand b').textContent = portalRole==='member' ? 'Member Space' : 'GDGoC UNSRI';
  $('.side-brand small').textContent = portalRole==='member' ? 'GDGoC UNSRI' : 'ADMIN PORTAL';
  $('.side-user b').textContent = portalRole==='member' ? db.members[0].name : 'Admin GDGoC UNSRI';
  const headerAvatar = $('.head-right .avatar');
  if (headerAvatar) headerAvatar.textContent = portalRole==='member' ? db.members[0].name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase() : 'AD';
  const sideAvatar = $('.side-user .avatar');
  if (sideAvatar) sideAvatar.textContent = portalRole==='member' ? db.members[0].name.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase() : 'AD';
  $('#view').className = id;
  $('#view').innerHTML = view();
}

// ===== FORM TAMBAH / EDIT =====
function openForm(title, fields, onSave) {
  $('#modalForm').innerHTML = `<h3>${title}</h3>` + fields.map(([key,label,value='',type='text',extra='']) =>
    Array.isArray(type)
      ? `<label>${label}<br><select class="full" name="${key}">${type.map(o=>`<option ${o===value?'selected':''}>${o}</option>`).join('')}</select></label>`
      : `<label>${label}<br><input class="full" name="${key}" type="${type}" value="${esc(value)}" ${extra} required></label>`).join('') +
    `<div class="row"><button class="btn primary">Simpan</button><button type="button" class="btn" data-act="close">Batal</button></div>`;
  $('#modalForm').onsubmit = e => {
    e.preventDefault();
    onSave(Object.fromEntries(new FormData(e.target)));
    save(); $('#modal').close(); render();
  };
  $('#modal').showModal();
}
function memberForm(i) {
  const p = db.members[i] || {};
  openForm(p.name ? 'Edit Anggota' : 'Tambah Anggota', [
    ['name','Nama',p.name],['division','Divisi',p.division],['role','Jabatan',p.role||'Member'],
    ['batch','Angkatan',p.batch||2026,'number','min="2000" max="2100"'],
    ['points','Poin',p.points??0,'number','min="0"'],
    ['attendance','Kehadiran (%)',p.attendance??0,'number','min="0" max="100"'],
    ['status','Status',p.status||'Active',['Active','Inactive','Alumni']],
    ['photo','URL Foto',p.photo||'','url','placeholder="https://..."']
  ], d => {
    ['batch','points','attendance'].forEach(k => d[k] = Number(d[k]));
    if (p.name) { db.attendance.forEach(r => { if (r[0]===p.name) r[0] = d.name; }); db.members[i] = d; }
    else db.members.push(d);
  });
}
function showInfo(title, body) {
  $('#modalForm').innerHTML = `<h3>${title}</h3>${body}<button type="button" class="btn" data-act="close">Tutup</button>`;
  $('#modalForm').onsubmit = e => e.preventDefault();
  $('#modal').showModal();
}
const actions = {
  notif: () => showInfo('Notifikasi', ['GDG Info Session 2026 dijadwalkan 20 Sep.','Rekap kehadiran DevFest tersedia.','Peringkat anggota diperbarui.','Ada pencapaian baru.'].map(t=>`<p>• ${t}</p>`).join('')),
  menu: el => { const i = el.dataset.i; showInfo(esc(db.members[i].name),
    `<button type="button" class="btn primary" data-act="editMember" data-i="${i}">Edit</button><button type="button" class="btn" data-act="delMember" data-i="${i}">Hapus</button>`); },
  addMember: () => memberForm(-1),
  editMember: el => { if ($('#modal').open) $('#modal').close(); memberForm(Number(el.dataset.i)); },
  delMember: el => {
    const i = Number(el.dataset.i), name = db.members[i].name;
    if (!confirm(`Hapus ${name}?`)) return;
    $('#modal').close(); db.members.splice(i,1); db.attendance = db.attendance.filter(r=>r[0]!==name); save(); render();
  },
  addActivity: () => openForm('Buat Kegiatan', [
    ['name','Nama kegiatan'],['type','Jenis','', ['Workshop','Study Jam','Meeting','Conference','Hackathon','Recruitment']],
    ['date','Tanggal','','date'],['quota','Kuota',30,'number','min="1"'],['pts','Poin',50,'number','min="0"'],
    ['description','Deskripsi kegiatan']
  ], d => db.activities.push({...d, quota:+d.quota, pts:+d.pts, joined:0, status:'Upcoming', icon:'📌', color:'blue'})),
  share: () => navigator.clipboard?.writeText(`${db.members[0].name} - ${db.members[0].points} pts`)
    .then(()=>alert('Ringkasan profil disalin.'), ()=>alert('Gagal menyalin.')),
  close: () => $('#modal').close(),
  joinActivity: el => {
    const name = el.dataset.name;
    const activity = db.activities.find(a => a.name === name);
    if (!activity) return;
    state.registrationName = name;
    const member = db.members[0];
    const isRegistered = db.registrations.some(r => r.activity === name && r.name === member.name);
    const percent = Math.min(activity.joined / activity.quota * 100, 100);
    $('#modalForm').innerHTML = `<div class="activity-detail"><div class="activity-detail-hero ${activity.color}"><div class="detail-date"><b>${new Date(activity.date+'T00:00').getDate()}</b><span>${new Date(activity.date+'T00:00').toLocaleDateString('id-ID',{month:'short'}).toUpperCase()}</span></div><span class="detail-icon">${activity.icon}</span><span class="detail-status">${activity.status}</span></div><div class="activity-detail-body"><span class="detail-type ${activity.color}">${esc(activity.type)}</span><h3>${esc(activity.name)}</h3><p class="detail-description">${esc(activity.description || 'Deskripsi kegiatan belum tersedia.')}</p><div class="detail-grid"><div><span>Tanggal</span><b>${date(activity.date)}</b></div><div><span>Poin</span><b>+${activity.pts} pts</b></div><div><span>Peserta</span><b>${activity.joined} / ${activity.quota}</b></div></div><div class="detail-progress"><div class="row between"><small>Kapasitas kegiatan</small><small>${Math.round(percent)}%</small></div><div class="bar ${activity.color}"><span style="width:${percent}%"></span></div></div><div class="detail-actions">${activity.status==='Upcoming'?(isRegistered?' <button type="button" class="btn primary" disabled>Sudah Terdaftar</button>':'<button type="button" class="btn primary" data-act="openRegistrationForm">Isi Form Pendaftaran</button>'):'<button type="button" class="btn primary" data-act="close">Selesai</button>'}<button type="button" class="btn" data-act="close">Tutup</button></div></div></div>`;
    $('#modalForm').onsubmit = e => e.preventDefault();
    $('#modal').showModal();
  },
  openRegistrationForm: () => {
    const activity = db.activities.find(a => a.name === state.registrationName);
    const member = db.members[0];
    if (!activity || !member) return;
    $('#modalForm').innerHTML = `<div class="registration-form"><div class="registration-form-head"><span>${activity.icon}</span><div><small>FORM PENDAFTARAN</small><h3>${esc(activity.name)}</h3></div></div><div class="registration-fields"><label>Nama lengkap<input name="name" value="${esc(member.name)}" required></label><label>Divisi<input name="division" value="${esc(member.division)}" required></label><label>Email<input type="email" name="email" value="" placeholder="nama@email.com" required></label><label>Nomor WhatsApp<input type="tel" name="phone" value="" placeholder="08xxxxxxxxxx" required></label><label>Alasan mengikuti kegiatan<textarea name="reason" rows="3" placeholder="Ceritakan singkat motivasi Anda" required></textarea></label></div><div class="detail-actions"><button type="submit" class="btn primary">Kirim Pendaftaran</button><button type="button" class="btn" data-act="close">Batal</button></div></div>`;
    $('#modalForm').onsubmit = e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      const exists = db.registrations.some(r => r.activity === activity.name && r.name === data.name);
      if (exists) { $('#modal').close(); alert('Anda sudah terdaftar pada kegiatan ini.'); return; }
      if (activity.joined >= activity.quota) { $('#modal').close(); alert('Maaf, kuota kegiatan sudah penuh.'); return; }
      db.registrations.push({ activity:activity.name, name:data.name, division:data.division, batch:member.batch, email:data.email, phone:data.phone, reason:data.reason, registeredAt:new Date().toISOString() });
      activity.joined += 1;
      save(); $('#modal').close(); render(); alert('Pendaftaran kegiatan berhasil dikirim dan tersimpan.');
    };
  },
  viewRegistrations: el => {
    const activityName = el.dataset.name;
    const rows = db.registrations.filter(r => r.activity === activityName);
    const tableRows = rows.map((r,i)=>`<tr><td>${i+1}</td><td><b>${esc(r.name)}</b><small>GDG${String(db.members.findIndex(p=>p.name===r.name)+1).padStart(3,'0')}</small></td><td>${esc(r.division)}</td><td>${r.batch}</td><td>${esc(r.email || '-')}<small>${esc(r.phone || '-')}</small></td><td>${esc(r.reason || '-')}</td><td>${new Date(r.registeredAt).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</td></tr>`).join('');
    $('#modalForm').innerHTML = `<h3>Pendaftar — ${esc(activityName)}</h3><p class="muted">${rows.length} anggota terdaftar</p><div class="registration-table"><table><thead><tr><th>No</th><th>Anggota</th><th>Divisi</th><th>Angkatan</th><th>Kontak</th><th>Alasan</th><th>Tanggal</th></tr></thead><tbody>${tableRows || '<tr><td colspan="7">Belum ada pendaftar.</td></tr>'}</tbody></table></div><button type="button" class="btn" data-act="close">Tutup</button>`;
    $('#modalForm').onsubmit = e => e.preventDefault();
    $('#modal').showModal();
  }
};

document.addEventListener('click', e => {
  const set = e.target.closest('[data-set]'), act = e.target.closest('[data-act]');
  if (set) { state[set.dataset.set] = set.dataset.val; render(); return; }
  if (act) { actions[act.dataset.act]?.(act); return; }

  const activity = e.target.closest('.activity');
  if (activity) {
    const name = activity.querySelector('h4')?.textContent;
    const item = db.activities.find(a => a.name === name);
    if (item) showInfo(item.name, `<p><b>Jenis:</b> ${esc(item.type)}</p><p><b>Tanggal:</b> ${date(item.date)}</p><p><b>Status:</b> ${esc(item.status)}</p><p><b>Peserta:</b> ${item.joined}/${item.quota}</p><p><b>Poin:</b> +${item.pts}</p>`);
    return;
  }

  const memberCard = e.target.closest('.mgrid .card');
  if (memberCard) {
    const name = memberCard.querySelector('b:not(.blue)')?.textContent;
    const index = db.members.findIndex(p => p.name === name);
    if (index >= 0) showInfo(db.members[index].name, `<p><b>ID:</b> GDG${String(index+1).padStart(3,'0')}</p><p><b>Divisi:</b> ${esc(db.members[index].division)}</p><p><b>Angkatan:</b> ${db.members[index].batch}</p><p><b>Poin:</b> ${db.members[index].points}</p><p><b>Kehadiran:</b> ${db.members[index].attendance}%</p><button type="button" class="btn primary" data-act="editMember" data-i="${index}">Edit Anggota</button>`);
    return;
  }

  const memberRow = e.target.closest('.members tbody tr');
  if (memberRow) {
    const name = memberRow.querySelector('td:first-child b')?.textContent;
    const index = db.members.findIndex(p => p.name === name);
    if (index >= 0) memberForm(index);
    return;
  }

  const recentRow = e.target.closest('.recent > div:not(.row)');
  if (recentRow) {
    const name = recentRow.querySelector('b')?.textContent;
    const item = db.activities.find(a => a.name === name);
    if (item) showInfo(item.name, `<p>${esc(item.type)} - ${date(item.date)}</p><p><b>Peserta:</b> ${item.joined}/${item.quota}</p><p><b>Poin:</b> +${item.pts}</p>`);
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'memberSearch') {
    state.query = e.target.value; const pos = e.target.selectionStart; render();
    $('#memberSearch').focus(); $('#memberSearch').setSelectionRange(pos,pos);
  }
  if (e.target.id === 'division') { state.division = e.target.value; render(); }
});
$('#globalSearch').addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  Object.assign(state, {query:e.target.value, status:'All', division:'All'});
  location.hash = 'members'; render();
});
let loginMode = 'member';
function setLoginMode(mode) {
  loginMode = mode;
  const admin = mode === 'admin';
  $('.member-fields').hidden = admin;
  $('.admin-fields').hidden = !admin;
  $('#loginWelcome').textContent = admin ? 'Akses administrator' : 'Selamat datang kembali';
  $('#loginTitle').textContent = admin ? 'Masuk sebagai Admin' : 'Masuk ke akun';
  $('#loginSubmit').innerHTML = admin ? 'Masuk ke Admin <span>→</span>' : 'Masuk <span>→</span>';
  $('#loginDivider').hidden = admin;
  $('#adminLogin').innerHTML = admin ? '<span class="admin-icon">M</span> Kembali ke login anggota' : '<span class="admin-icon">A</span> Masuk sebagai Admin';
}
$('#loginForm').onsubmit = e => {
  e.preventDefault();
  if (loginMode === 'admin') {
    const data = new FormData(e.target);
    if (!data.get('username') || !data.get('adminPassword')) return;
    loggedIn = true; portalRole = 'admin'; location.hash = 'home'; render();
  } else {
    loggedIn = true; portalRole = 'member'; location.hash = 'member-home'; render();
  }
};
$('#adminLogin').onclick = () => setLoginMode(loginMode === 'admin' ? 'member' : 'admin');
$('#forgotPassword').onclick = () => showInfo('Lupa Password', '<p>Hubungi administrator untuk mereset kata sandi akun Anda.</p>');
$('#logout').onclick = () => { loggedIn = false; portalRole = 'admin'; render(); };
window.addEventListener('hashchange', () => { render(); scrollTo(0,0); });
render();
