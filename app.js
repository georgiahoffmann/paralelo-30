(function () {
  // ---------- Mapa: filtros ----------
  var P = window.PLACES;
  if (P) {
    var tint = {'Bom Fim':'#B0D5F7','Cidade Baixa':'#FFEE62','Rio Branco':'#FF6A2B','Centro Histórico':'#96D26F'};
    var zones = [{k:'Bom Fim',x:54,y:29.6},{k:'Cidade Baixa',x:74,y:80.5},{k:'Rio Branco',x:78,y:14.4},{k:'Centro Histórico',x:14,y:52.5}];
    var bairros = ['Todos','Bom Fim','Cidade Baixa','Rio Branco','Centro Histórico'];
    var cnames = ['Todos','Bares','Comer e doces','Livrarias','Brechós e moda','Lojas e arte'];
    var st = {f:'Todos', c:'Todos', q:''};
    var norm = function (s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
    var catOf = function (p) {
      var t = p.t.toLowerCase();
      if (/livraria|banca/.test(t)) return 'Livrarias';
      if (/brech|upcycl|moda/.test(t)) return 'Brechós e moda';
      if (/loja|materiais|disco/.test(t)) return 'Lojas e arte';
      if (/caf|doce|gelateria|sorveteria|pastel|galeria gastr|mercado/.test(t)) return 'Comer e doces';
      if (/\bbar\b/.test(t)) return 'Bares';
      return 'Comer e doces';
    };
    P.forEach(function (p) { p.cat = catOf(p); });
    var counts = {};
    P.forEach(function (p) { counts[p.k] = (counts[p.k] || 0) + 1; });
    var $ = function (id) { return document.getElementById(id); };
    var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

    function render() {
      var q = norm(st.q.trim());
      var byZone = P.filter(function (p) {
        return (st.f === 'Todos' || p.k === st.f) && (!q || norm(p.n + ' ' + p.t + ' ' + p.b + ' ' + p.k).indexOf(q) > -1);
      });
      var shown = byZone.filter(function (p) { return st.c === 'Todos' || p.cat === st.c; });

      $('zones').innerHTML = zones.map(function (z) {
        return '<button type="button" class="zone" data-z="' + z.k + '" aria-pressed="' + (st.f === z.k) + '" aria-label="' + z.k + ', ' + counts[z.k] + ' pontos" style="left:' + z.x + '%;top:' + z.y + '%"><span class="zf">' + z.k + '</span><span class="zs">' + (z.k === 'Centro Histórico' ? 'Centro' : z.k) + '</span> · ' + counts[z.k] + '</button>';
      }).join('');
      $('bairros').innerHTML = bairros.map(function (n) {
        return '<button type="button" data-b="' + n + '" aria-pressed="' + (st.f === n) + '">' + (st.f === n ? '● ' : '○ ') + n + '</button>';
      }).join('');
      $('cats').innerHTML = cnames.map(function (n) {
        var cnt = n === 'Todos' ? byZone.length : byZone.filter(function (p) { return p.cat === n; }).length;
        return '<button type="button" data-c="' + n + '" aria-pressed="' + (st.c === n) + '">' + n + ' · ' + cnt + '</button>';
      }).join('');
      $('lista').innerHTML = shown.map(function (p) {
        return '<article class="place"><div class="k"><i style="background:' + tint[p.k] + '"></i><span>' + p.k + '</span></div><h3 class="rt">' + esc(p.n) + '</h3><p class="t">' + esc(p.t) + '</p><p class="b">' + esc(p.b) + '</p></article>';
      }).join('');
      $('titulo').textContent = st.f === 'Todos' ? 'Todos os bairros' : st.f;
      $('total').textContent = shown.length + (shown.length === 1 ? ' ponto' : ' pontos');
      $('vazio').hidden = shown.length > 0;
      $('limpar').hidden = !(st.f !== 'Todos' || st.c !== 'Todos' || st.q);
    }

    document.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.z) st.f = st.f === b.dataset.z ? 'Todos' : b.dataset.z;
      else if (b.dataset.b) st.f = b.dataset.b;
      else if (b.dataset.c) st.c = b.dataset.c;
      else if (b.id === 'limpar') { st = {f:'Todos', c:'Todos', q:''}; $('busca').value = ''; }
      else return;
      render();
    });
    $('busca').addEventListener('input', function (e) { st.q = e.target.value; render(); });
    render();
  }

  // ---------- Menu mobile ----------
  var top = document.querySelector('.top'), mb = document.querySelector('.menu-btn');
  if (top && mb) {
    var setMenu = function (open) {
      top.classList.toggle('open', open);
      mb.setAttribute('aria-expanded', open);
      mb.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    mb.addEventListener('click', function () { setMenu(!top.classList.contains('open')); });
    top.querySelectorAll('nav a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && top.classList.contains('open')) { setMenu(false); mb.focus(); }
    });
    window.matchMedia('(min-width:641px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  // ---------- Passaporte: formulário ----------
  var form = document.getElementById('form');
  if (form) {
    var ok = document.getElementById('ok');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.hidden = true; ok.hidden = false;
    });
    document.getElementById('outra').addEventListener('click', function () {
      form.reset(); ok.hidden = true; form.hidden = false;
    });
  }
})();
