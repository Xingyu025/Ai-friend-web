/* 纯静态展示：统计、SVG 图表与逐屏交互。 */
(function () {
  'use strict';
  // 可选插图只在受控 HTTP(S) 页面加载：空目录回退，不触发页面404错误。
  // 不缓存文件；按 IMAGES.md 放入图片后刷新即可显示。file:// 保留完整无图版。
  const illustrationLayers = [...document.querySelectorAll('[data-illustration]')];
  function showIllustrations() {
    illustrationLayers.forEach(layer => {
      layer.style.setProperty('--illustration', 'url("' + layer.dataset.illustration + '?v=' + performance.timeOrigin + '")');
    });
  }
  if (illustrationLayers.length && /^https?:$/.test(location.protocol) && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('image-fallback-sw.js').then(() => navigator.serviceWorker.ready).then(() => {
      if (navigator.serviceWorker.controller) showIllustrations();
      else navigator.serviceWorker.addEventListener('controllerchange', showIllustrations, { once: true });
    }).catch(() => { /* 运行环境不允许 Service Worker 时保持无图版，正文和交互正常。 */ });
  }

  const D = window.SURVEY;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const slides = [...document.querySelectorAll('.slide')];
  const sum = a => a.reduce((x, y) => x + y, 0);
  const pct = (v, n) => n ? Math.round(v / n * 100) : 0;
  const ratios = {
    hotLive: [D.q2.counts[1], D.q2.n], hotAI: [D.q2.counts[0], D.q2.n],
    usedAI: [sum(D.q5.counts.slice(0, 3)), D.q5.n], oftenAI: [sum(D.q5.counts.slice(0, 2)), D.q5.n],
    noJudge: [D.q7.counts[1], D.q7.n], agree: [sum(D.q8.counts.slice(0, 2)), D.q8.n],
    firstAI: [D.q3.counts[2], D.q3.n], stillTalk: [sum(D.q11.counts.slice(0, 2)), D.q11.n],
    notReplace: [sum(D.q13.counts.slice(2)), D.q13.n], friendBetter: [D.q9.counts[1], D.q9.n], aiBetter: [D.q9.counts[0], D.q9.n]
  };
  const values = {
    total: D.meta.total, noConcernPct: pct(D.q4.counts[5], D.q4.n), disagreePct: pct(D.q8.counts[2], D.q8.n), selfDigestPct: pct(D.q3.counts[4], D.q3.n),
    neverTalkText: D.q11.counts[3] === 0 ? "没有人选择'从不'" : D.q11.counts[3] + "人选择'从不'",
    canReplaceText: D.q13.counts[0] === 0 ? "没有人选择'完全可以'" : D.q13.counts[0] + "人选择'完全可以'"
  };
  Object.entries(ratios).forEach(([key, [v, n]]) => { values[key + 'Pct'] = pct(v, n); });
  document.querySelectorAll('[data-ratio]').forEach(el => {
    const [v, n] = ratios[el.dataset.ratio];
    el.innerHTML = pct(v, n) + '<small>%</small>';
  });
  document.querySelectorAll('[data-value]').forEach(el => { el.textContent = values[el.dataset.value]; });
  document.querySelectorAll('[data-n]').forEach(el => { el.textContent = D[el.dataset.n].n; });
  document.querySelectorAll('[data-meta]').forEach(el => {
    const v = String(D.meta[el.dataset.meta]);
    if (v.includes('【')) { const span = document.createElement('span'); span.className = 'ph'; span.textContent = v; el.replaceChildren(span); }
    else el.textContent = v;
  });
  document.querySelectorAll('[data-figure]').forEach((el, i) => { el.prepend('图' + (i + 1) + '　'); });
  const answer = id => D.q15.answers.find(a => a.id === Number(id)).text;
  document.querySelectorAll('[data-quote]').forEach(el => { el.textContent = answer(el.dataset.quote); });
  document.querySelectorAll('[data-excerpt]').forEach(el => {
    const t = answer(20), split = t.indexOf('因此');
    el.textContent = el.dataset.excerpt === '20-start' ? t.slice(0, split - 1) + '……' : '……' + t.slice(split + 2);
  });
  document.getElementById('gradeSummary').textContent = D.q1.options.map((s, i) => D.q1.counts[i] ? s + D.q1.counts[i] + '人' : '').filter(Boolean).join('、');
  document.getElementById('answerSummary').textContent = '第6–11题由用过AI倾诉的' + D.q6.n + '人作答；第12题由' + D.q12.n + '人作答；第15题为选填，' + D.q15.n + '人作答；量表题为' + D.q10.scale.join('–') + '分。';
  document.getElementById('nonUserSummary').textContent = '另外' + D.q12.n + '位没用过AI倾诉的同学，' + (D.q12.counts[0] === D.q12.n ? '都认为' : '其中' + D.q12.counts[0] + '位认为') + 'AI不懂人的真实感受。';


  // 手工关键词与固定布局，不进行自动分词，不使用随机坐标。
  const cloud = document.getElementById('wordCloud'); cloud.className = 'cloud-clusters';
  const keywordButtons = [];
  ['人', 'AI'].forEach(side => {
    const cluster = document.createElement('div'); cluster.className = 'cloud-cluster ' + (side === '人' ? 'human-cloud' : 'ai-cloud');
    const title = document.createElement('p'); title.className = 'cloud-label'; title.textContent = side === '人' ? '朋友有的' : 'AI的样子';
    const words = document.createElement('div'); words.className = 'cloud-words'; words.setAttribute('role', 'group'); words.setAttribute('aria-label', title.textContent);
    D.q15.keywords.filter(k => k.side === side).forEach(k => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = k.word; b.dataset.size = k.size;
      b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-controls', 'voiceList'); b.addEventListener('click', () => selectKeyword(k));
      keywordButtons.push({ b, k }); words.appendChild(b);
    });
    cluster.append(title, words); cloud.appendChild(cluster);
  });
  function highlightedText(parent, text, matches) {
    // 直接拼接原文本切片；不改写大小写、空格、标点，不注入 HTML。
    const escaped = matches.slice().sort((a, b) => b.length - a.length).map(m => m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = new RegExp(escaped.join('|'), 'g'); let end = 0;
    for (const hit of text.matchAll(pattern)) {
      parent.appendChild(document.createTextNode(text.slice(end, hit.index)));
      const mark = document.createElement('mark'); mark.textContent = hit[0]; parent.appendChild(mark); end = hit.index + hit[0].length;
    }
    parent.appendChild(document.createTextNode(text.slice(end)));
  }
  function selectKeyword(k) {
    keywordButtons.forEach(({ b, k: other }) => { b.classList.toggle('same-theme', other.theme === k.theme); b.setAttribute('aria-pressed', String(other.word === k.word)); });
    const panel = document.querySelector('.quote-panel'); panel.dataset.side = k.side;
    const answers = D.q15.answers.filter(a => k.ids.includes(a.id));
    document.getElementById('quoteHeading').textContent = '关键词：' + k.word + '　' + answers.length + '条原话';
    const list = document.getElementById('voiceList'); list.replaceChildren();
    answers.forEach(a => { const p = document.createElement('p'); p.className = 'voice'; highlightedText(p, a.text, k.matches); list.appendChild(p); });
    panel.scrollTop = 0;
  }
  selectKeyword(D.q15.keywords.find(k => k.word === '情感'));
  const themeCounts = ['情感', '真人在场', '意见与思想'].map(theme => new Set(D.q15.keywords.filter(k => k.theme === theme).flatMap(k => k.ids)).size);
  document.getElementById('themeSummary').textContent = D.q15.answers.length + '条回答中，' + themeCounts[0] + '条提到情感，' + themeCounts[1] + '条提到真人在场，' + themeCounts[2] + '条谈到AI的意见和思想。';

  // 镜像图左右题目的作答基数各自计算。
  const mirror = document.getElementById('mirror');
  mirror.innerHTML = '<div class="mirror-head"><span class="h">和人说时的顾虑</span><span></span><span class="a">AI吸引我的地方</span></div>';
  [[0, 2, '打扰'], [1, 1, '评判'], [2, 3, '隐私'], [4, 0, '找得到人']].forEach(([h, a, mid]) => {
    const side = (q, i, cls) => '<div class="mside ' + cls + '" title="' + q.options[i] + '：' + q.counts[i] + '人，占' + pct(q.counts[i], q.n) + '%（n=' + q.n + '）"><span class="mlab">' + q.options[i] + '</span><div class="mline"><div class="mbar"><i style="--w:' + pct(q.counts[i], q.n) + '%"></i></div><span class="mval">' + pct(q.counts[i], q.n) + '%</span></div></div>';
    mirror.insertAdjacentHTML('beforeend', '<div class="mrow">' + side(D.q4, h, 'h') + '<div class="mmid">' + mid + '</div>' + side(D.q7, a, 'a') + '</div>');
  });

  // 保留吸附、目录、圆点和键盘翻页。
  const dotsBox = document.querySelector('.dots');
  const current = () => Math.max(0, slides.findLastIndex(s => s.offsetTop <= scrollY + innerHeight * .4));
  function go(i) { slides[Math.max(0, Math.min(slides.length - 1, i))].scrollIntoView({ behavior: motion.matches ? 'instant' : 'smooth' }); }
  slides.forEach((s, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.dataset.label = s.dataset.title; b.setAttribute('aria-label', s.dataset.title);
    b.addEventListener('click', () => go(i)); dotsBox.appendChild(b);
  });
  function onScroll() {
    const k = current();
    [...dotsBox.children].forEach((b, i) => { b.classList.toggle('on', i === k); if (i === k) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    document.body.classList.toggle('on-light', slides[k].classList.contains('light'));
    document.querySelector('.progress i').style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight) * 100) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true });
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(slides.indexOf(document.getElementById(b.dataset.go)))));
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || e.target.isContentEditable) return;
    // 原话面板保留原生键盘滚动；按钮的空格保留原生激活。
    if (e.target.closest('.quote-panel')) return;
    if (e.key === ' ' && /BUTTON|A/.test(e.target.tagName)) return;
    let i;
    if (['ArrowDown', 'PageDown'].includes(e.key) || e.key === ' ' && !e.shiftKey) i = current() + 1;
    else if (['ArrowUp', 'PageUp'].includes(e.key) || e.key === ' ' && e.shiftKey) i = current() - 1;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = slides.length - 1;
    if (i !== undefined) { e.preventDefault(); go(i); }
  });
  onScroll();
  function alignMarginNotes() {
    document.querySelectorAll('.margin-note').forEach(note => {
      const inner = note.parentElement;
      note.style.top = (inner.querySelector('h2').getBoundingClientRect().top - inner.getBoundingClientRect().top + 2) + 'px';
    });
    // 光源跟随节点和两团词的位置，版心在不同分辨率下仍然对齐。
    [['words', '.word.ai', '.word.live'], ['layer2', '.mside.a', '.mside.h'],
     ['principle', '.ai-node text', '.human-nodes .self'], ['voices', '.ai-cloud', '.human-cloud']].forEach(([id, cool, warm]) => {
      const section = document.getElementById(id), rect = section.getBoundingClientRect();
      [[cool, 'cool'], [warm, 'warm']].forEach(([selector, key]) => {
        const target = section.querySelector(selector); if (!target) return;
        const r = target.getBoundingClientRect();
        section.style.setProperty('--' + key + '-x', (r.left + r.width / 2 - rect.left) + 'px');
        const y = id === 'words' ? r.top + r.height * .2 : id === 'layer2' ? section.querySelector('#mirror').getBoundingClientRect().top + section.querySelector('#mirror').clientHeight / 2 : r.top + r.height / 2;
        section.style.setProperty('--' + key + '-y', (y - rect.top) + 'px');
      });
    });
  }
  alignMarginNotes();
  document.fonts.ready.then(alignMarginNotes);
  addEventListener('resize', alignMarginNotes);

  const hei = getComputedStyle(document.documentElement).getPropertyValue('--hei').trim() || 'sans-serif';
  const kai = getComputedStyle(document.documentElement).getPropertyValue('--kai').trim() || 'serif';
  function theme(el) {
    const light = !!el.closest('.light');
    return light ? { text: '#23262D', muted: '#5E6270', ai: '#2F6E8E', ai2: '#52859D', ai3: '#779DAC', human: '#C98E3A', human2: '#B27A32', human3: '#9A6928', neutral: '#A9ACB4', tip: '#F2F2EE' }
      : { text: '#E6E1D6', muted: '#A3A6B4', ai: '#739DB5', ai2: '#8FB3C9', ai3: '#B1CBDA', human: '#E3A857', human2: '#C48D43', human3: '#A87532', neutral: '#5A6072', tip: '#161A26' };
  }
  function base(t) { return { animation: !motion.matches, animationDuration: 900, animationEasing: 'cubicOut', textStyle: { fontFamily: hei, color: t.text }, tooltip: { confine: true, backgroundColor: t.tip, borderColor: t.muted, textStyle: { color: t.text, fontFamily: hei, fontSize: 13 } } }; }
  const tip = (name, c, n) => name + '：' + c + '人，占' + pct(c, n) + '%（n=' + n + '）';
  function hbar(el, q, colors, sort = false) {
    const t = theme(el); const rows = q.options.map((name, i) => ({ name, i, c: q.counts[i] }));
    if (sort) rows.sort((a, b) => b.c - a.c);
    return { ...base(t), grid: { left: 0, right: 88, top: 6, bottom: 6, containLabel: true },
      xAxis: { type: 'value', min: 0, max: q.n, show: false },
      yAxis: { type: 'category', inverse: true, data: rows.map(r => r.name), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: t.text, fontFamily: hei, fontSize: 12, width: el.dataset.chart === 'q14' ? 230 : 175, overflow: 'break', lineHeight: 17 } },
      tooltip: { ...base(t).tooltip, formatter: p => tip(rows[p.dataIndex].name, p.value, q.n) },
      series: [{ type: 'bar', barWidth: 10, data: rows.map(r => ({ value: r.c, itemStyle: { color: colors(r.i, t) } })), label: { show: true, position: 'right', color: t.text, fontSize: 12, formatter: p => pct(p.value, q.n) + '%' } }] };
  }
  function stack(el, q, colors) {
    const t = theme(el), cols = colors(t);
    return { ...base(t), grid: { left: 0, right: 0, top: 3, bottom: 64 },
      xAxis: { type: 'value', min: 0, max: q.n, show: false }, yAxis: { type: 'category', data: [''], show: false },
      legend: { left: 0, bottom: 0, itemWidth: 10, itemHeight: 10, itemGap: 10, textStyle: { color: t.muted, fontFamily: hei, fontSize: 12 }, data: q.options, selectedMode: false },
      tooltip: { ...base(t).tooltip, formatter: p => tip(p.seriesName, p.value, q.n) },
      series: q.options.map((name, i) => ({ name, type: 'bar', stack: 'total', barWidth: 10, data: [q.counts[i]], itemStyle: { color: cols[i] }, label: { show: q.counts[i] / q.n * el.clientWidth >= 44, position: 'inside', fontSize: 10, color: i === q.counts.length - 1 && cols[i] === t.neutral ? t.text : '#161A26', formatter: p => pct(p.value, q.n) + '%' } })) };
  }
  function means(el) {
    const t = theme(el), q = D.q10;
    return { ...base(t), grid: { left: 268, right: 38, top: 12, bottom: 48 },
      xAxis: { type: 'value', min: q.scale[0], max: q.scale[1], interval: 1, axisLine: { show: true, lineStyle: { color: t.muted } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { color: t.muted, fontSize: 12, formatter: v => q.scaleLabels[v] ? v + '\n' + q.scaleLabels[v] : '' } },
      yAxis: { type: 'category', inverse: true, data: q.items.map(x => x.label), show: false },
      tooltip: { ...base(t).tooltip, formatter: p => q.items[p.dataIndex].label + '：均分' + q.items[p.dataIndex].mean.toFixed(2) + '（1–5分，n=' + q.n + '）' },
      series: [{ type: 'scatter', symbolSize: 11, data: q.items.map((x, i) => [x.mean, i]), itemStyle: { color: t.ai2 }, label: { show: true, position: 'right', color: t.text, fontSize: 13, formatter: p => p.value[0].toFixed(2) }, markLine: { silent: true, symbol: 'none', label: { show: false }, lineStyle: { type: 'dashed', color: t.muted, width: 1 }, data: [{ xAxis: 3 }] } }] };
  }
  const builders = {
    q5: el => stack(el, D.q5, t => [t.ai, t.ai2, t.ai3, t.neutral]),
    q6: el => hbar(el, D.q6, (i, t) => t.ai2, true),
    q8: el => hbar(el, D.q8, (i, t) => i === 0 ? t.ai : i === 1 ? t.ai2 : t.neutral),
    q9: el => hbar(el, D.q9, (i, t) => i === 0 ? t.ai2 : i === 1 ? t.human : t.neutral),
    q10: means,
    q11: el => stack(el, D.q11, t => [t.human, t.human2, t.human3, t.neutral]),
    q13: el => stack(el, D.q13, t => [t.ai, t.ai2, t.human2, t.human]),
    q14: el => hbar(el, D.q14, (i, t) => [1, 2, 4].includes(i) ? t.human : [0, 3].includes(i) ? t.ai : t.neutral, true)
  };
  const charts = [];
  function buildIn(section) {
    section.classList.add('in');
    section.querySelectorAll('[data-chart]').forEach(el => {
      if (el.dataset.done) return; el.dataset.done = '1';
      if (!window.echarts) { el.textContent = '图表库未加载，请确认 js/echarts.min.js 存在。'; return; }
      const c = echarts.init(el, null, { renderer: 'svg' }); c.setOption(builders[el.dataset.chart](el)); charts.push(c);
      if (el.dataset.chart === 'q10') {
        const labels = document.createElement('div'); labels.className = 'mean-labels';
        D.q10.items.forEach((item, i) => {
          const row = document.createElement('div'), label = document.createElement('span'); label.textContent = item.label; row.appendChild(label);
          if (i === 2) {
            const note = document.createElement('span'); note.className = 'mean-note';
            note.textContent = '但只有 ' + pct(D.q7.counts[5], D.q7.n) + '% 觉得AI比身边人更懂自己（第7题）'; row.appendChild(note);
          }
          labels.appendChild(row);
        });
        el.appendChild(labels);
      }
    });
  }
  const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { buildIn(en.target); io.unobserve(en.target); } }), { threshold: .3 });
  slides.forEach(s => io.observe(s));
  addEventListener('resize', () => { charts.forEach(c => c.resize()); onScroll(); });
  motion.addEventListener('change', () => charts.forEach(c => c.setOption({ animation: !motion.matches })));
})();
