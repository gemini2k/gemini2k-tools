/* audit-kit.js — 감리·점검 도구 공용 위젯 (의존성 없음)
   AuditKit.register(opts) : 편집 가능한 관리대장(표) — 행추가/삭제·자동저장(localStorage)·CSV
   AuditKit.checklist(opts): 체크리스트 — 충족/미충족/해당없음·비고·충족률
   모든 데이터는 브라우저 localStorage 에만 저장된다(전송 없음). */
window.AuditKit = (function () {
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]); }); }
  function toast(m) { var t = document.getElementById('toast'); if (!t) return; t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 1400); }
  function L(k, d) { return (window.t && window.t(k) !== k) ? window.t(k) : d; }   // i18n: 키 있으면 번역, 없으면 한국어 기본
  function load(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function csvCell(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function downloadCSV(name, rows) {
    var csv = '﻿' + rows.map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    var blob = new Blob([csv], { type: 'text/csv' }); var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 120);
  }

  function register(o) {
    var mount = typeof o.mount === 'string' ? document.querySelector(o.mount) : o.mount;
    var KEY = 'reg:' + o.key, cols = o.cols;
    var rows = load(KEY, (o.seed || []).slice());
    var table = el('table', 'ak-tbl'), bar = el('div', 'ak-bar'), tw = el('div', 'ak-tw'), sum = el('div', 'ak-sum');
    function persist() { save(KEY, rows); renderSummary(); }
    function renderSummary() { if (o.summary) sum.innerHTML = o.summary(rows) || ''; }
    function field(r, ri, c) {
      var v = r[c.k] == null ? '' : r[c.k];
      if (c.type === 'select') return '<select data-ri="' + ri + '" data-k="' + c.k + '">' + (c.opts || []).map(function (op) { return '<option' + (String(op) === String(v) ? ' selected' : '') + '>' + esc(op) + '</option>'; }).join('') + '</select>';
      if (c.type === 'area') return '<textarea data-ri="' + ri + '" data-k="' + c.k + '" rows="1">' + esc(v) + '</textarea>';
      var tp = c.type === 'num' ? 'number' : (c.type === 'date' ? 'date' : 'text');
      return '<input type="' + tp + '" data-ri="' + ri + '" data-k="' + c.k + '" value="' + esc(v) + '"/>';
    }
    function render() {
      table.innerHTML = '<thead><tr>' + cols.map(function (c) { return '<th' + (c.w ? ' style="min-width:' + c.w + '"' : '') + '>' + esc(c.label) + '</th>'; }).join('') + '<th class="ak-x"></th></tr></thead><tbody>' +
        rows.map(function (r, ri) { return '<tr>' + cols.map(function (c) { return '<td>' + field(r, ri, c) + '</td>'; }).join('') + '<td class="ak-x"><button class="ak-del" data-ri="' + ri + '" aria-label="삭제">✕</button></td></tr>'; }).join('') +
        '</tbody>'; renderSummary();
    }
    table.addEventListener('input', function (e) { var t = e.target; if (t.dataset && t.dataset.ri != null) { rows[+t.dataset.ri][t.dataset.k] = t.value; persist(); } });
    table.addEventListener('change', function (e) { var t = e.target; if (t.tagName === 'SELECT' && t.dataset.ri != null) { rows[+t.dataset.ri][t.dataset.k] = t.value; persist(); } });
    table.addEventListener('click', function (e) { var b = e.target.closest('.ak-del'); if (b) { rows.splice(+b.dataset.ri, 1); persist(); render(); } });
    function btn(label, ghost, fn) { var b = el('button', 'btn' + (ghost ? ' btn-ghost' : ''), label); b.type = 'button'; b.onclick = fn; return b; }
    bar.appendChild(btn('+ ' + L('ak.addrow', '행 추가'), false, function () { var nr = {}; cols.forEach(function (c) { nr[c.k] = c.def || ''; }); rows.push(nr); persist(); render(); }));
    bar.appendChild(btn('⬇️ CSV', true, function () { downloadCSV(o.key + '.csv', [cols.map(function (c) { return c.label; })].concat(rows.map(function (r) { return cols.map(function (c) { return r[c.k]; }); }))); }));
    bar.appendChild(btn('🗑 ' + L('ak.clear', '비우기'), true, function () { if (confirm(L('ak.confirmclear', '모든 행을 삭제할까요?'))) { rows = []; persist(); render(); } }));
    tw.appendChild(table); mount.appendChild(bar); mount.appendChild(tw); mount.appendChild(sum); render();
    return { rows: function () { return rows; }, render: render };
  }

  function checklist(o) {
    var mount = typeof o.mount === 'string' ? document.querySelector(o.mount) : o.mount;
    var KEY = 'chk:' + o.key, state = load(KEY, {});
    var sum = el('div', 'ak-sum'), bar = el('div', 'ak-bar'), body = el('div');
    function gid(g, i) { return (g.id || g.title) + '#' + i; }
    function persist() { save(KEY, state); renderSum(); }
    function renderSum() {
      var total = 0, ok = 0, na = 0;
      o.groups.forEach(function (g) { g.items.forEach(function (it, i) { total++; var s = state[gid(g, i)] && state[gid(g, i)].v; if (s === 'ok') ok++; else if (s === 'na') na++; }); });
      var denom = total - na, rate = denom > 0 ? Math.round(ok / denom * 100) : 0;
      sum.innerHTML = '<div class="ak-rate"><b>' + rate + '%</b> ' + L('ak.met', '충족') + ' <span>(' + ok + '/' + denom + ' · ' + L('ak.na', '해당없음') + ' ' + na + ' · ' + L('ak.total', '전체') + ' ' + total + ')</span></div><div class="ak-bar2"><i style="width:' + rate + '%"></i></div>';
    }
    function render() {
      body.innerHTML = '';
      o.groups.forEach(function (g) {
        var sec = el('div', 'ak-grp'); sec.appendChild(el('h3', 'ak-grp-h', esc(g.title)));
        g.items.forEach(function (it, i) {
          var id = gid(g, i), cur = state[id] || {}, row = el('div', 'ak-chk');
          row.innerHTML = '<div class="ak-chk-q">' + esc(it) + '</div><div class="ak-chk-c">' +
            [['ok', L('ak.met', '충족')], ['no', L('ak.notmet', '미충족')], ['na', L('ak.na', '해당없음')]].map(function (x) { return '<label><input type="radio" name="' + id + '" value="' + x[0] + '"' + (cur.v === x[0] ? ' checked' : '') + '/>' + x[1] + '</label>'; }).join('') +
            '</div><input class="ak-chk-n" data-id="' + id + '" placeholder="' + L('ak.csv_note', '비고') + '" value="' + esc(cur.n || '') + '"/>';
          sec.appendChild(row);
        });
        body.appendChild(sec);
      });
    }
    body.addEventListener('change', function (e) { var t = e.target; if (t.type === 'radio') { state[t.name] = state[t.name] || {}; state[t.name].v = t.value; persist(); } });
    body.addEventListener('input', function (e) { var t = e.target; if (t.classList.contains('ak-chk-n')) { var id = t.dataset.id; state[id] = state[id] || {}; state[id].n = t.value; persist(); } });
    var b = el('button', 'btn btn-ghost', '⬇️ CSV'); b.type = 'button';
    b.onclick = function () { var data = [[L('ak.csv_group', '그룹'), L('ak.csv_item', '점검항목'), L('ak.csv_result', '결과'), L('ak.csv_note', '비고')]]; o.groups.forEach(function (g) { g.items.forEach(function (it, i) { var s = state[gid(g, i)] || {}; data.push([g.title, it, { ok: L('ak.met', '충족'), no: L('ak.notmet', '미충족'), na: L('ak.na', '해당없음') }[s.v] || '', s.n || '']); }); }); downloadCSV(o.key + '.csv', data); };
    bar.appendChild(b);
    mount.appendChild(sum); mount.appendChild(bar); mount.appendChild(body); render(); renderSum();
    return {};
  }

  return { register: register, checklist: checklist, csv: downloadCSV, toast: toast, esc: esc, load: load, save: save };
})();
