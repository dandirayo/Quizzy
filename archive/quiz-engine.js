(() => {
  const id = new URLSearchParams(location.search).get('quiz');
  const config = window.QUIZ_CATALOG && window.QUIZ_CATALOG[id];
  if(!config){
    document.getElementById('appCard').innerHTML = '<div class="error"><div class="logo">🧭</div><h1>Quiz tidak ditemukan</h1><p>Pilih quiz melalui halaman utama Quizzy agar tautannya sesuai.</p><a class="primary" href="index.html" style="display:block;text-decoration:none">Kembali ke Beranda</a></div>';
    return;
  }

  document.documentElement.style.setProperty('--accent', config.colors[0]);
  document.documentElement.style.setProperty('--accent2', config.colors[1]);
  document.title = `${config.title} — Quizzy`;
  document.querySelector('meta[name="description"]').content = config.subtitle;

  const $ = selector => document.querySelector(selector);
  const answers = new Array(config.questions.length).fill(null);
  let current = 0;
  let shareText = '';
  const scale = [
    ['Sangat tidak sesuai',1],['Tidak sesuai',2],['Kadang-kadang',3],['Sesuai',4],['Sangat sesuai',5]
  ];

  $('#quizLogo').textContent = config.emoji;
  $('#quizTitle').textContent = config.title;
  $('#quizSubtitle').textContent = config.subtitle;
  $('#quizNote').textContent = config.note;
  $('#startButton').textContent = `Mulai ${config.shortTitle}`;
  $('#dimensionPreview').innerHTML = Object.values(config.dimensions).map(dim => `<div class="dimension-card"><strong style="color:${dim.color}">${dim.name}</strong><span>${dim.preview}</span></div>`).join('');

  function showScreen(id){
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    $(id).classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function renderQuestion(){
    const question = config.questions[current];
    const dimension = config.dimensions[question.dimension];
    const percent = Math.round(((current + 1) / config.questions.length) * 100);
    $('#progressBar').style.width = `${percent}%`;
    $('#progressText').textContent = `Pertanyaan ${current + 1} / ${config.questions.length}`;
    $('#progressPct').textContent = `${percent}%`;
    $('#dimensionBadge').textContent = dimension.name.toUpperCase();
    $('#dimensionBadge').style.color = dimension.color;
    $('#dimensionBadge').style.borderColor = dimension.color;
    $('#questionText').textContent = question.text;
    $('#options').innerHTML = scale.map(([label,value]) => `<button type="button" class="option${answers[current] === value ? ' selected' : ''}" data-value="${value}"><span class="score">${value}</span><span>${label}</span></button>`).join('');
    document.querySelectorAll('.option').forEach(option => option.addEventListener('click', () => {
      answers[current] = Number(option.dataset.value);
      renderQuestion();
    }));
    $('#backButton').disabled = current === 0;
    $('#nextButton').disabled = answers[current] === null;
    $('#nextButton').textContent = current === config.questions.length - 1 ? 'Lihat Hasil' : 'Lanjut →';
  }

  function calculateResult(){
    const totals = {};
    Object.keys(config.dimensions).forEach(key => totals[key] = {score:0,count:0});
    config.questions.forEach((question,index) => {
      const value = question.reverse ? 6 - answers[index] : answers[index];
      totals[question.dimension].score += value;
      totals[question.dimension].count++;
    });
    const percentages = {};
    Object.entries(totals).forEach(([key,value]) => {
      const average = value.score / value.count;
      percentages[key] = Math.round(((average - 1) / 4) * 100);
    });
    const ordered = Object.keys(percentages).sort((a,b) => percentages[b] - percentages[a]);
    const dominantKey = ordered[0];
    const profile = config.profiles[dominantKey];
    const dominant = config.dimensions[dominantKey];

    $('#resultEmoji').textContent = profile.emoji;
    $('#resultTitle').textContent = profile.title;
    $('#resultTagline').textContent = profile.tagline;
    $('#results').innerHTML = ordered.map(key => {
      const dim = config.dimensions[key];
      return `<div><div class="result-labels"><span>${dim.name}</span><span>${percentages[key]}%</span></div><div class="track"><div class="fill" data-width="${percentages[key]}" style="background:linear-gradient(90deg,${dim.color},${config.colors[1]})"></div></div></div>`;
    }).join('');
    $('#dominantInsight').textContent = `${dominant.name} paling menonjol dalam jawabanmu. ${profile.insight}`;
    $('#practicalTip').textContent = profile.tip;
    $('#sourceList').innerHTML = config.sources.map(source => `<li>${source.url ? `<a href="${source.url}" target="_blank" rel="noopener">${source.label}</a>` : source.label}</li>`).join('');
    shareText = `Hasil ${config.title} saya: ${profile.title} (${dominant.name} ${percentages[dominantKey]}%). Coba juga di Quizzy!`;
    localStorage.setItem(`quizzy_${id}`, JSON.stringify({emoji:profile.emoji,title:profile.title,dominant:dominant.name,score:percentages[dominantKey],date:new Date().toISOString()}));
    showScreen('#screen-result');
    requestAnimationFrame(() => document.querySelectorAll('.fill').forEach(fill => fill.style.width = `${fill.dataset.width}%`));
  }

  $('#startButton').addEventListener('click', () => { answers.fill(null); current = 0; showScreen('#screen-quiz'); renderQuestion(); });
  $('#backButton').addEventListener('click', () => { if(current > 0){ current--; renderQuestion(); } });
  $('#nextButton').addEventListener('click', () => { if(answers[current] === null) return; if(current === config.questions.length - 1) calculateResult(); else { current++; renderQuestion(); } });
  $('#restartButton').addEventListener('click', () => { answers.fill(null); current = 0; showScreen('#screen-intro'); });
  $('#shareButton').addEventListener('click', async () => {
    if(navigator.share){ try{ await navigator.share({title:config.title,text:shareText}); return; }catch(error){ if(error.name === 'AbortError') return; } }
    try{ await navigator.clipboard.writeText(shareText); $('#shareButton').textContent = 'Tersalin ✓'; setTimeout(() => $('#shareButton').textContent = 'Bagikan Hasil',1600); }catch(error){ alert(shareText); }
  });
})();
