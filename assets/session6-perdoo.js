"use strict";

const steps = [
  ["موقعیت","مسئله راهبردی را انتخاب کنید"],
  ["هویت","مأموریت، چشم‌انداز و ارزش‌ها"],
  ["هدف غایی","هدف غایی را صورت‌بندی کنید"],
  ["ارکان","ارکان راهبردی و اولویت دوره"],
  ["شاخص‌ها","شاخص‌های کلیدی عملکرد"],
  ["هدف و نتایج","هدف دوره‌ای و نتایج کلیدی"],
  ["اجرا","تیم، مسئولیت و اقدام‌های اجرایی"],
  ["پایش و یادگیری","مرور پیشرفت و تصمیم پایان فصل"],
  ["خروجی","نقشه اجرای استراتژی شما"]
];

const storageKey = "bp-session6-perdoo-v1";
const $ = (id) => document.getElementById(id);
const stage = $("stage");
const digit = new Intl.NumberFormat("fa-IR", {maximumFractionDigits:1});
const fa = (number) => digit.format(number);
const pct = (number) => fa(number) + "٪";
const row = (name, text) => `<dt>${name}</dt><dd>${text}</dd>`;
const localMessage = "انتخاب‌ها در همین مرورگر ذخیره می‌شوند.";
let saved = {};
try {
  saved = JSON.parse(localStorage.getItem(storageKey) || "{}") || {};
} catch {
  saved = {};
}
if (!Number.isInteger(saved.case) || !perdooCases[saved.case]) saved.case = -1;
if (!saved.drafts || typeof saved.drafts !== "object") saved.drafts = {};
let current = 0;

const fieldsByStep = [
  ["case","evidence"], ["mission","vision","value"], ["ultimate"], ["pillar"],
  ["primaryMetric","cadence"], ["ambition"], ["team","action0","action1"],
  ["snapshot","barrier","decision","next"]
];

const choice = (key) => model()[key];
const scenario = () => perdooCases[saved.case];
function model() {
  return saved.case < 0 ? {} : (saved.drafts[saved.case] ??= {});
}

function persist() {
  saved.step = current;
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
    $("status").textContent = localMessage;
  } catch {
    $("status").textContent = "ذخیره خودکار در دسترس نیست. خروجی گزارش را دانلود کنید.";
  }
}

function complete(index) {
  return fieldsByStep[index].every((key) =>
    key === "case" ? saved.case >= 0 : Number.isInteger(choice(key))
  );
}

function firstIncomplete() {
  const index = fieldsByStep.findIndex((_, i) => !complete(i));
  return index < 0 ? steps.length - 1 : index;
}

function select(key, label, options, hint = "") {
  const value = key === "case" ? saved.case : choice(key);
  const id = "perdoo-" + key;
  return `<div class="field"><label for="${id}">${label}</label>
    <select id="${id}" name="${key}" required ${hint ? `aria-describedby="${id}-hint"` : ""}>
      <option value="">انتخاب کنید</option>
      ${options.map((option, index) => `<option value="${index}" ${value === index ? "selected" : ""}>${option}</option>`).join("")}
    </select>${hint ? `<p class="choice-note" id="${id}-hint">${hint}</p>` : ""}</div>`;
}

function lesson(text) {
  return `<div class="lesson">${text}</div>`;
}

function feedback(id, value = "") {
  return `<p class="feedback" id="${id}" aria-live="polite">${value}</p>`;
}

function ultimateOptions() {
  const mission = choice("mission");
  const vision = choice("vision");
  return [
    perdooIdentity.ultimate[mission][vision],
    "تا پایان فصل، مجموعه‌ای از پروژه‌های بهبود در همه واحدها اجرا کنیم.",
    "در سال‌های آینده، در تمام بازارها رشد کنیم."
  ];
}

function selectedPillar() {
  return choice("pillar") === 0 ? scenario().pillar : scenario().secondaryPillar;
}

function progressOf(metric, actual) {
  const target = metric.targets[choice("ambition")];
  const position = (actual - metric.base) / (target - metric.base);
  return Math.min(100, Math.max(0, Math.round(position * 100)));
}

function achieved(metric, actual) {
  const target = metric.targets[choice("ambition")];
  return target > metric.base ? actual >= target : actual <= target;
}

function krText(metric, index = choice("ambition")) {
  const target = metric.targets[index];
  return `${target > metric.base ? "افزایش" : "کاهش"} ${metric.name} از ${pct(metric.base)} به ${pct(target)} تا پایان فصل`;
}

function teamResult(item, team) {
  const result = item.teamResult[team];
  return Number.isInteger(result) ? krText(item.metrics[result]) : result;
}

function sampleText(metric, sample) {
  return `${metric.name} · خط مبنا ${pct(metric.base)}، هدف ${pct(metric.targets[choice("ambition")])}، میان‌دوره ${pct(metric.mid[sample])} (${pct(progressOf(metric, metric.mid[sample]))} پیشرفت)، پایان دوره ${pct(metric.end[sample])} (${achieved(metric, metric.end[sample]) ? "محقق شد" : "محقق نشد"})`;
}

function renderCheckin() {
  const el = $("snapshot-note");
  if (!el) return;
  const sample = choice("snapshot");
  el.replaceChildren();
  if (!Number.isInteger(sample)) return;
  for (const metric of scenario().metrics) {
    const p = document.createElement("p");
    p.textContent = sampleText(metric, sample);
    el.append(p);
  }
}

function renderFeedback() {
  if (current === 0 && scenario() && Number.isInteger(choice("evidence"))) {
    $("evidence-note").textContent = choice("evidence") === saved.case
      ? "این داده‌ها با مسئله انتخابی هم‌خوان‌اند و نقطه شروع مناسبی برای بررسی فرضیه هستند."
      : "این داده‌ها می‌توانند مکمل باشند. برای بررسی مستقیم مسئله، شواهد را به نتیجه‌ای وصل کنید که مشتری یا شرکت تجربه می‌کند.";
  }
  if (current === 1 && Number.isInteger(choice("value"))) {
    $("value-note").textContent = choice("value") === scenario().value
      ? "این ارزش در تعارض اصلی سناریو مستقیماً به تصمیم شما جهت می‌دهد."
      : `این ارزش هم می‌تواند در تصمیم نقش داشته باشد. در این پرونده ارزش نزدیک‌تر به تعارض اصلی این است: ${perdooIdentity.value[scenario().value]}`;
  }
  if (current === 2 && Number.isInteger(choice("ultimate"))) {
    $("ultimate-note").textContent = choice("ultimate") === 0
      ? "این جمله مخاطب، ارزش ایجادشده و جایگاه بلندمدت را به هم وصل می‌کند."
      : "جمله اولِ گزینه‌ها مأموریت و چشم‌انداز انتخابی شما را با هم جمع می‌کند. یک پروژه فصلی یا عبارت کلی رشد، جهت بلندمدت را به این روشنی نشان نمی‌دهد.";
  }
  if (current === 7) {
    renderCheckin();
    const decision = choice("decision");
    const barrier = choice("barrier");
    $("decision-note").textContent = Number.isInteger(decision) && Number.isInteger(barrier)
      ? decision === barrier
        ? "این تصمیم مستقیماً به مانعی که انتخاب کرده‌اید پاسخ می‌دهد."
        : "این تصمیم ممکن است مفید باشد. بررسی کنید اقدام انتخاب‌شده مستقیماً روی مانع اعلام‌شده اثر دارد یا به مانع دیگری پاسخ می‌دهد."
      : "";
    const sample = choice("snapshot");
    const next = choice("next");
    $("next-note").textContent = Number.isInteger(sample) && Number.isInteger(next)
      ? scenario().metrics.every((metric) => achieved(metric, metric.end[sample]))
        ? "هر دو نتیجه محقق شده‌اند. اگر داده‌ها قابل‌اتکا باشند، استانداردسازی اقدام مؤثر و ادامه پایش گزینه‌ای قابل دفاع است."
        : "دست‌کم یک نتیجه محقق نشده است. علت و اعتبار اقدام‌ها را بررسی کنید و بر همان اساس ادامه یا بازطراحی چرخه بعد را انتخاب کنید."
      : "";
  }
}

function stageBody() {
  const item = scenario();
  const data = perdooIdentity;
  switch (current) {
    case 0:
      return lesson("<p>استراتژی با دیدن یک تغییر مهم در محیط و شناخت توان اجرای شرکت شروع می‌شود. یک موقعیت را انتخاب کنید و بعد مشخص کنید برای بررسی آن به چه شاهدی نیاز دارید.</p>")
        + select("case", "روی کدام موقعیت کار می‌کنید؟", perdooCases.map((card) => card.title))
        + (item ? `<div class="scene"><h3>موقعیت و انتخاب پیش روی شرکت</h3><p>${item.situation}</p><p>${item.tradeoff}</p></div>
          ${select("evidence", "کدام شواهد را باید اول بررسی کنیم؟", data.evidence)}${feedback("evidence-note")}` : "");
    case 1:
      return lesson("<p><strong>مأموریت</strong> می‌گوید امروز برای چه کسی چه ارزشی می‌سازیم. <strong>چشم‌انداز</strong> تصویری از جایگاه آینده است. <strong>ارزش محوری</strong> راهنمای رفتار ما در یک انتخاب دشوار است.</p>")
        + select("mission", "مأموریت · چرا و برای چه کسی کار می‌کنیم؟", data.mission)
        + select("vision", "چشم‌انداز · در افق ۱۴۱۰ چه جایگاهی می‌خواهیم؟", data.vision)
        + select("value", "ارزش · در تعارض این پرونده به کدام اصل بیشتر نیاز داریم؟", data.value)
        + feedback("value-note");
    case 2:
      return lesson("<p>پردو مأموریت و چشم‌انداز را در یک جمله کوتاه به نام <strong>هدف غایی</strong> جمع می‌کند. جمله باید مخاطب، ارزش وعده‌شده و تصویر موفقیت بلندمدت را روشن کند. ارزش‌ها در اجرای آن، راهنمای رفتار باقی می‌مانند.</p>")
        + `<dl class="scene">${row("مأموریت شما", data.mission[choice("mission")])}${row("چشم‌انداز شما", data.vision[choice("vision")])}</dl>`
        + select("ultimate", "کدام جمله هدف غایی مناسب‌تری است؟", ultimateOptions())
        + feedback("ultimate-note");
    case 3:
      return lesson("<p>ارکان راهبردی چند انتخاب بلندمدت‌اند که توضیح می‌دهند چرا مشتری باید به‌پرور را انتخاب کند. برای این پرونده، یک رکن اصلی و یک رکن پشتیبان داریم. مشخص کنید تمرکز این چرخه کدام باشد.</p>")
        + `<div class="scene"><strong>دوراهی راهبردی</strong><p>${item.tradeoff}</p></div>`
        + select("pillar", "تمرکز چرخه را روی کدام رکن می‌گذارید؟", [item.pillar, item.secondaryPillar])
        + `<p class="choice-note">اولویت سالانه شرکت که هر دو رکن به آن کمک می‌کنند: ${item.annual}</p>`;
    case 4:
      return lesson("<p>شاخص کلیدی عملکرد، سلامت رکن را به‌طور مستمر نشان می‌دهد. برای اینکه عدد قابل پیگیری باشد، تعریف، منبع داده، مسئول و حد مطلوب را روشن می‌کنیم.</p>")
        + item.metrics.map((metric) => `<div class="scene"><h3>${metric.name}</h3><p>${metric.definition}</p>
        <p><strong>مقدار پایه</strong> ${pct(metric.base)} · <strong>حد مطلوب</strong> ${metric.threshold > metric.base ? "دست‌کم" : "حداکثر"} ${pct(metric.threshold)}</p>
        <p><strong>منبع داده</strong> ${metric.source} · <strong>مسئول گزارش</strong> ${metric.owner}</p></div>`).join("")
        + select("primaryMetric", "در گزارش مدیریتی ابتدا کدام شاخص را برجسته می‌کنید؟", item.metrics.map((metric) => metric.name))
        + select("cadence", "در این چرخه هر چند وقت یک بار شاخص‌ها را مرور می‌کنید؟", data.cadence,
          "بعد از چرخه تمرین، شاخص‌ها در داشبورد عملکرد ماهانه قابل پایش‌اند.");
    case 5:
      return lesson("<p>هدف دوره‌ای جهت تغییر را بیان می‌کند. نتایج کلیدی شواهد سنجش تغییرند و مقدار پایه، مقدار هدف و موعد دارند. انتخاب سطح هدف در این تمرین تعیین می‌کند پایان فصل چه نتیجه‌ای موفقیت محسوب شود.</p>")
        + `<div class="scene"><h3>هدف فصل</h3><p>${item.objective}</p></div>`
        + select("ambition", "با توجه به ظرفیت تیم کدام سطح هدف را انتخاب می‌کنید؟",
          [0,1].map((index) => `${index === 0 ? "تدریجی" : "بلندپروازانه"} · ${item.metrics.map((metric) => metric.name + " " + pct(metric.targets[index])).join(" / ")}`))
        + `<div id="kr-preview" class="scene" hidden></div>`;
    case 6:
      return lesson("<p>اکنون روشن کنید کدام تیم به هدف شرکت کمک می‌کند و روی کدام کارها وقت می‌گذارد. پیشرفت اقدام نشانه اجرای کار است. پیشرفت هدف از داده نتایج کلیدی به دست می‌آید.</p>")
        + `<div class="scene"><h3>حامی پاسخ‌گو</h3><p>${item.sponsor}</p><p>${item.guard}</p></div>`
        + select("team", "کدام تیم مشترک هدایت اجرا را برعهده بگیرد؟", item.team)
        + `<div id="team-preview" class="scene" hidden></div>`
        + select("action0", "اقدام اصلی برای نتیجه کلیدی اول", item.initiatives[0], krText(item.metrics[0]))
        + select("action1", "اقدام اصلی برای نتیجه کلیدی دوم", item.initiatives[1], krText(item.metrics[1]));
    case 7:
      return lesson("<p>در مرور دوره‌ای، به ترتیب عدد، مانع و تصمیم را مرور کنید. پایان فصل، عدد واقعی را با مقدار هدف مقایسه و برای چرخه بعد تصمیم بگیرید. درصد پیشرفت در تمرین، سهم فاصله طی‌شده از خط مبنا تا هدف است.</p>")
        + select("snapshot", "کدام مسیر شبیه‌سازی‌شده را مرور می‌کنید؟", ["پیشرفت کند و باقی‌ماندن شکاف", "بهبود محسوس و عبور از هدف"])
        + `<div id="snapshot-note" class="scene" aria-live="polite"></div>`
        + select("barrier", "در مرور میانی، کدام مانع را اولویت می‌دهید؟", item.barrier)
        + select("decision", "چه تصمیمی برای رفع مانع می‌گیرید؟", item.decision)
        + feedback("decision-note")
        + select("next", "بعد از مرور پایان فصل، تصمیم چرخه بعد چیست؟", data.next)
        + feedback("next-note");
    default:
      return renderReport();
  }
}

function reportContent() {
  const item = scenario();
  const data = perdooIdentity;
  const sample = choice("snapshot");
  const audit = [];
  if (choice("ultimate") !== 0) audit.push("صورت‌بندی هدف غایی را با جمع‌بندی مأموریت و چشم‌انداز بازبینی کنید.");
  if (choice("evidence") !== saved.case) audit.push("منبع شواهد اولیه را به مسئله انتخابی نزدیک‌تر کنید.");
  if (choice("barrier") !== choice("decision")) audit.push("ارتباط تصمیم میان‌دوره با مانع انتخاب‌شده را بازبینی کنید.");
  const allAchieved = item.metrics.every((metric) => achieved(metric, metric.end[sample]));
  if (!allAchieved && choice("next") === 0) audit.push("قبل از استانداردسازی، علت شکاف باقی‌مانده را بررسی کنید.");
  const result = item.metrics.filter((metric) => achieved(metric, metric.end[sample])).length;
  return [
    ["زمینه و جهت‌گیری", [
      ["موقعیت راهبردی", item.title], ["شواهد اولیه", data.evidence[choice("evidence")]],
      ["مأموریت", data.mission[choice("mission")]], ["چشم‌انداز", data.vision[choice("vision")]],
      ["ارزش‌های محوری", data.value.join(" | ")], ["ارزشِ راهنمای این تصمیم", data.value[choice("value")]],
      ["هدف غایی", ultimateOptions()[choice("ultimate")]]
    ]],
    ["ارکان و هم‌راستایی", [
      ["رکن منتخب", selectedPillar()], ["رکن مکمل", choice("pillar") === 0 ? item.secondaryPillar : item.pillar],
      ["هدف سالانه شرکت", item.annual], ["تیم اجرا", item.team[choice("team")]],
      ["هدف تیم در این فصل", item.contribution[choice("team")]],
      ["نتیجه کلیدی تیم", teamResult(item, choice("team"))], ["حامی پاسخ‌گو", item.sponsor]
    ]],
    ["شاخص‌ها و تعهد فصل", [
      ["شاخص برجسته در گزارش مدیریتی", item.metrics[choice("primaryMetric")].name],
      ...item.metrics.map((m) => [m.name, `${m.definition} مقدار پایه ${pct(m.base)}، حد مطلوب ${pct(m.threshold)}، مسئول ${m.owner}، منبع ${m.source}.`]),
      ["هدف فصل", item.objective], ...item.metrics.map((m, i) => [`نتیجه کلیدی ${fa(i + 1)}`, krText(m)])
    ]],
    ["اجرا و مرور دوره", [
      ["اقدام برای نتیجه اول", item.initiatives[0][choice("action0")]],
      ["اقدام برای نتیجه دوم", item.initiatives[1][choice("action1")]],
      ["شرط تصمیم‌گیری", item.guard], ["تناوب مرور", data.cadence[choice("cadence")]],
      ...item.metrics.map((m) => ["شواهد پیشرفت", sampleText(m, sample)]),
      ["جمع‌بندی فصل", `${fa(result)} نتیجه از ${fa(item.metrics.length)} نتیجه کلیدی محقق شد.`],
      ["مانع و تصمیم میان‌دوره", `${item.barrier[choice("barrier")]} · ${item.decision[choice("decision")]}`],
      ["تصمیم چرخه بعد", data.next[choice("next")]],
      ["بازبینی پیش از ارائه", audit.join(" ") || "تعریف سنجه‌ها و مقدارهای پایه را با داده واقعی به‌پرور اعتبارسنجی کنید."]
    ]]
  ];
}

function renderReport() {
  return `<p class="report-intro">گزارش مستقل خود را برای گفت‌وگوی کلاسی دانلود یا چاپ کنید.</p>
    <div class="report"><p><strong>به‌پرور | گزارش آموزشی اجرای استراتژی به روش پردو</strong></p>
    <p>سناریو و داده‌های شبیه‌سازی‌شده برای جلسه ششم</p>
    ${reportContent().map(([heading, entries]) => `<section><h3>${heading}</h3><dl>${entries.map(([label, content]) => row(label, content)).join("")}</dl></section>`).join("")}</div>`;
}

function renderPreview() {
  const teamPreview = $("team-preview");
  if (teamPreview) {
    const team = choice("team");
    teamPreview.hidden = !Number.isInteger(team);
    if (!teamPreview.hidden) {
      const item = scenario();
      teamPreview.innerHTML = `<h3>هم‌راستایی با هدف فصل شرکت</h3><dl>${row("هدف تیم", item.contribution[team])}${row("نتیجه کلیدی تیم تا پایان فصل", teamResult(item, team))}</dl>`;
    }
  }
  const preview = $("kr-preview");
  if (!preview) return;
  const ambition = choice("ambition");
  preview.hidden = !Number.isInteger(ambition);
  preview.replaceChildren();
  if (preview.hidden) return;
  for (const [index, metric] of scenario().metrics.entries()) {
    const p = document.createElement("p");
    p.textContent = `نتیجه ${fa(index + 1)} · ${krText(metric)}`;
    preview.append(p);
  }
}

function renderNavigation() {
  const available = firstIncomplete();
  const nav = $("step-nav");
  nav.className = "steps";
  nav.innerHTML = steps.map(([label], index) => `<button type="button" data-step="${index}"
    ${index === current ? 'aria-current="step"' : ""} ${index > available ? "disabled" : ""}>${fa(index + 1)}. ${label}</button>`).join("");
  $("step-count").textContent = `گام ${fa(current + 1)} از ${fa(steps.length)}`;
  $("case-name").textContent = scenario()?.title ?? "";
  $("progress").value = current === steps.length - 1 ? steps.length : available;
}

function render() {
  renderNavigation();
  const end = current === steps.length - 1;
  stage.innerHTML = `<h2 id="stage-title" tabindex="-1">${steps[current][1]}</h2>
    <form id="step-form">${stageBody()}
      <div class="actions">
        ${current > 0 ? '<button class="button" type="button" data-back>گام قبل</button>' : ""}
        ${end ? '<button class="button primary" type="button" data-download>دانلود گزارش</button><button class="button" type="button" data-print>چاپ یا ذخیره پی‌دی‌اف</button>'
          : `<button class="button primary" type="submit">${current === steps.length - 2 ? "مشاهده نقشه نهایی" : "ادامه"}</button>`}
      </div>
      <p id="form-error" class="form-error" role="alert"></p>
    </form>`;
  renderPreview();
  renderFeedback();
}

function go(index) {
  current = Math.min(Math.max(index, 0), firstIncomplete());
  persist();
  render();
  $("work").scrollIntoView({block:"start"});
  $("stage-title").focus({preventScroll:true});
}

function downloadReport() {
  const lines = ["به‌پرور | گزارش آموزشی اجرای استراتژی به روش پردو", "سناریو و داده‌های شبیه‌سازی‌شده برای جلسه ششم", ""];
  for (const [heading, entries] of reportContent()) {
    lines.push(heading, ...entries.map(([label, content]) => `${label} — ${content}`), "");
  }
  const url = URL.createObjectURL(new Blob(["\ufeff", lines.join("\n")], {type:"text/plain;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = "behparvar-perdoo-strategy-report.txt";
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

stage.addEventListener("change", (event) => {
  const control = event.target;
  if (!(control instanceof HTMLSelectElement)) return;
  if (control.name === "case") {
    saved.case = control.value === "" ? -1 : Number(control.value);
    persist();
    render();
    $("perdoo-case").focus();
    return;
  }
  if (control.value === "") delete model()[control.name];
  else model()[control.name] = Number(control.value);
  if (control.name === "mission" || control.name === "vision") delete model().ultimate;
  if (complete(current)) $("form-error").textContent = "";
  persist();
  renderNavigation();
  renderPreview();
  renderFeedback();
});

stage.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!complete(current)) {
    $("form-error").textContent = "برای ادامه، گزینه‌های این گام را کامل کنید.";
    return;
  }
  go(current + 1);
});

stage.addEventListener("click", (event) => {
  if (event.target.closest("[data-back]")) go(current - 1);
  if (event.target.closest("[data-download]")) downloadReport();
  if (event.target.closest("[data-print]")) window.print();
});
$("step-nav").addEventListener("click", (event) => {
  const button = event.target.closest("[data-step]");
  if (button && !button.disabled) go(Number(button.dataset.step));
});
$("start").addEventListener("click", (event) => {
  event.preventDefault();
  go(current);
});
current = Number.isInteger(saved.step) ? Math.min(Math.max(saved.step, 0), firstIncomplete()) : 0;
$("start").textContent = current > 0 || saved.case >= 0 ? "ادامه تمرین" : "شروع تمرین";
$("progress-panel").hidden = false;
render();
