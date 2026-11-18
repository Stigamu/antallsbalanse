(function(){
  const KEY = "biomassebalanse-v7";
  const fmt = n => new Intl.NumberFormat("nb-NO").format(n).replace("\u2212","-");
  const parse = v => { const s = String(v).replace(/[\u2212\u2013]/g,"-"); const neg = s.trim().startsWith("-");
                       const n = parseInt(s.replace(/[^\d]/g,""),10); return isNaN(n) ? 0 : (neg ? -n : n); };
  const clone = o => JSON.parse(JSON.stringify(o));
  let state = clone(window.STARTDATA);
  try { const lagret = JSON.parse(localStorage.getItem(KEY) || "null"); if (lagret) state = lagret; } catch(e) {}

  const get = p => p.split(".").reduce((o,k)=>o[k], state);
  const set = (p,v) => { const ks=p.split("."); ks.slice(0,-1).reduce((o,k)=>o[k],state)[ks.at(-1)] = v; };
  const inputs = document.querySelectorAll(".inp");
  const tekstfelt = ["lokalitet","generasjon","dato","mottakerTlf","mottakerEpost"];
  const $ = id => document.getElementById(id);

  function calc(){
    const p = state.produksjon;
    const sumIb = state.ib.utsett;                                          // C16 = C6
    const sumProd = p.dode + p.destruert + p.avlivetProve + p.flyttetUt +
                    p.slakt + p.romming + p.antallsavvik + p.uspesAvvik + p.ub; // G16 = SUM(G6:G14)
    return { sumIb, sumProd, balanse: sumIb - sumProd };                    // F19 = C16 - G16
  }

  function render(){
    inputs.forEach(i => { if (document.activeElement !== i) { const v = get(i.dataset.k); i.value = v ? fmt(v) : ""; } });
    tekstfelt.forEach(k => { if (document.activeElement !== $(k)) $(k).value = state[k] || ""; });
    const r = calc();
    $("sumIb").textContent = fmt(r.sumIb);
    $("sumProd").textContent = fmt(r.sumProd);
    $("balanse").textContent = fmt(r.balanse);
    $("balanseBox").className = "balanse " + (r.balanse === 0 ? "ok" : "feil");
    $("status").textContent = r.balanse === 0 ? "✔ Regnskapet går i balanse" : "✖ Ikke i balanse – avvik på " + fmt(r.balanse) + " fisk";
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function rapport(){
    const r = calc(), p = state.produksjon;
    return [
      "ANTALLSREGNSKAP – Biomassebalanse",
      "Lokalitet: " + (state.lokalitet || "-"),
      "Generasjon/merd: " + (state.generasjon || "-"),
      "Dato: " + (state.dato || new Date().toISOString().slice(0,10)),
      "",
      "IB – Utsett: " + fmt(state.ib.utsett),
      "Døde: " + fmt(p.dode), "Destruert: " + fmt(p.destruert), "Avlivet prøve: " + fmt(p.avlivetProve),
      "Flyttet ut: " + fmt(p.flyttetUt), "Slakt: " + fmt(p.slakt), "Rømming: " + fmt(p.romming),
      "Antallsavvik: " + fmt(p.antallsavvik),
      "Uspes. avvik i perioden: " + fmt(p.uspesAvvik),
      "UB (fisk igjen på lok.): " + fmt(p.ub),
      "Sum produksjonsdata: " + fmt(r.sumProd),
      "BALANSE: " + fmt(r.balanse) + (r.balanse === 0 ? " (i balanse)" : " (IKKE i balanse)")
    ].join("\n");
  }

  inputs.forEach(i => {
    i.addEventListener("input", () => { set(i.dataset.k, parse(i.value)); render(); });
    i.addEventListener("blur", render);
  });
  tekstfelt.forEach(k => $(k).addEventListener("input", e => { state[k] = e.target.value; render(); }));

  $("btnSms").onclick = () => {
    const tlf = (state.mottakerTlf || "").replace(/[^\d+]/g, "");
    const sep = /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent) ? "&" : "?";
    window.location.href = "sms:" + tlf + sep + "body=" + encodeURIComponent(rapport());
  };
  $("btnMail").onclick = () => {
    const emne = ("Biomassebalanse – " + (state.lokalitet || "lokalitet") + " " + (state.dato || "")).trim();
    window.location.href = "mailto:" + (state.mottakerEpost || "").trim() +
      "?subject=" + encodeURIComponent(emne) + "&body=" + encodeURIComponent(rapport());
  };
  // Sletter innholdet i alle gule bokser. Lokalitet, generasjon, dato og mottakere beholdes.
  $("btnSlett").onclick = () => {
    if (!confirm("Slette innholdet i alle gule bokser?")) return;
    inputs.forEach(i => { set(i.dataset.k, 0); i.value = ""; });
    render();
    inputs[0].focus();
  };
  render();
})();
