(() => {
  'use strict';

  const lesson = (title, definition, example, question, options) => ({title, definition, example, question, options});
  const direction = [
    lesson('هدف غایی', 'هدف غایی (Ultimate Goal) اثر بلندمدتی است که سازمان می‌خواهد برای مشتریان و ذی‌نفعان ایجاد کند.',
      'پرورش‌دهندگان بتوانند به خوراک ایمن و یکنواخت تکیه کنند و تولید پایدارتری داشته باشند.',
      'کدام اثر بلندمدت را برای به‌پرور انتخاب می‌کنید؟', [
        'کمک به تولید پایدار پرورش‌دهندگان با خوراک قابل اتکا',
        'تقویت امنیت زنجیره تأمین غذا با خوراک ایمن و قابل رهگیری',
        'کمک به پرورش‌دهندگان برای تولید اقتصادی‌تر با کاهش اتلاف خوراک'
      ]),
    lesson('مأموریت', 'مأموریت می‌گوید امروز برای چه کسی، چه کاری انجام می‌دهیم و چه ارزشی ایجاد می‌کنیم.',
      'برای پرورش‌دهندگان، خوراکی با کیفیت یکنواخت تولید و تأمین می‌کنیم تا عملکرد گله قابل پیش‌بینی‌تر باشد.',
      'به‌پرور چگونه هر روز به هدف غایی انتخابی شما کمک می‌کند؟', [
        'تولید و تأمین خوراک یکنواخت برای پرورش‌دهندگان',
        'تأمین خوراک ایمن و قابل رهگیری برای کسب‌وکارهای زنجیره پرورش',
        'تولید خوراک و ارائه راهنمای مصرف برای کاهش اتلاف در واحدهای پرورش'
      ]),
    lesson('چشم‌انداز', 'چشم‌انداز تصویری از جایگاه مطلوب سازمان در یک افق زمانی مشخص است.',
      'تا سه سال آینده، مشتریان منطقه به‌پرور را به‌عنوان تأمین‌کننده قابل اتکای خوراک بشناسند.',
      'در افق سه‌ساله، دوست دارید به‌پرور با چه جایگاهی شناخته شود؟', [
        'تأمین‌کننده مرجع خوراک یکنواخت در بازار منطقه',
        'شریک قابل اتکای پرورش‌دهندگان در ایمنی و رهگیری خوراک',
        'شریک منتخب مشتریان در کاهش اتلاف خوراک و بهبود بهره‌وری'
      ]),
    lesson('ارزش‌ها', 'ارزش سازمانی قاعده‌ای برای رفتار و تصمیم‌گیری است، به‌ویژه وقتی انتخاب دشوار می‌شود.',
      'در زمان فشار برای تحویل، محموله‌ای که آزمون ایمنی را نگذرانده از کارخانه خارج نمی‌شود.',
      'کدام رفتار را در تصمیم‌های دشوار مبنا قرار می‌دهید؟', [
        'ایمنی خوراک را حتی هنگام فشار برای تحویل رعایت کنیم.',
        'هر انحراف را ثبت و شفاف گزارش کنیم، حتی اگر خبر خوبی نباشد.',
        'در تغییر زمان تحویل، اثر تصمیم بر مشتری و واحدهای دیگر را بررسی کنیم.'
      ]),
    lesson('رکن راهبردی', 'رکن راهبردی حوزه‌ای است که سازمان برای رسیدن به چشم‌انداز، زمان و منابعش را روی آن متمرکز می‌کند.',
      '«کیفیت قابل اتکا» سبب می‌شود تولید، آزمایشگاه و خرید برای کاهش نوسان کیفیت هم‌جهت شوند.',
      'برای ساخت شاخه بعدی نقشه، یکی از این دو اولویت را انتخاب کنید.', ['کیفیت قابل اتکای خوراک', 'تحویل قابل اتکا به مشتری'])
  ];

  const quality = [
    ['ثبات کیفیت خوراک را برای مشتریان بهتر کنیم.', 'نوسان انطباق محصول بین نوبت‌های تولید را کاهش دهیم.'],
    ['نرخ انطباق سری‌های تولید در آزمون اول، هر هفته', 'نرخ محموله‌های برگشتی به علت کیفیت، هر ماه'],
    ['نرخ انطباق در آزمون اول را این فصل از ۹۲٪ به ۹۸٪ برسانیم.', 'نرخ انطباق در آزمون اول را این فصل از ۹۲٪ به ۹۶٪ برسانیم.'],
    ['تیم تولید · انطباق خط منتخب در آزمون اول را تا پایان فصل از ۹۰٪ به ۹۷٪ برساند.', 'تیم تولید · انطباق خط منتخب در آزمون اول را تا پایان فصل از ۹۰٪ به ۹۵٪ برساند.'],
    ['تولید و آزمایشگاه · ثبت تنظیمات شروع هر نوبت و نمونه‌گیری از اولین سری', 'تولید و نگهداری · بررسی و کالیبراسیون ترازوهای توزین مواد'],
    ['تولید و آزمایشگاه هر هفته انحراف‌ها را مرور و یک اقدام اصلاحی تعیین کنند.', 'در پایان هر ماه، نرخ انطباق و اثر اقدامات اصلاحی را بررسی کنیم.']
  ];
  const delivery = [
    ['قابلیت اتکای تحویل سفارش‌ها را بهتر کنیم.', 'اختلال در تحویل سفارش به پرورش‌دهندگان را کاهش دهیم.'],
    ['سهم سفارش‌های کامل و به‌موقع، هر هفته', 'سهم سفارش‌های دارای تأخیر بیش از یک روز، هر هفته'],
    ['سهم تحویل کامل و به‌موقع را این فصل از ۸۵٪ به ۹۵٪ برسانیم.', 'سهم تحویل کامل و به‌موقع را این فصل از ۸۵٪ به ۹۲٪ برسانیم.'],
    ['تیم ارسال · سهم سفارش‌های آماده بارگیری در موعد را تا پایان فصل از ۸۸٪ به ۹۶٪ برساند.', 'تیم ارسال · سهم سفارش‌های آماده بارگیری در موعد را تا پایان فصل از ۸۸٪ به ۹۳٪ برساند.'],
    ['برنامه‌ریزی و ارسال · تأیید حجم تولید و ظرفیت بارگیری پیش از اعلام موعد', 'انبار و ارسال · آماده‌سازی سفارش‌ها طبق زمان‌بندی مسیرهای تحویل'],
    ['ارسال و برنامه‌ریزی هر هفته تأخیرهای تکرارشونده را بررسی و گلوگاه را مشخص کنند.', 'هر ماه علت تأخیر و تغییر سهم سفارش‌های کامل و به‌موقع را مرور کنیم.']
  ];

  function steps() {
    const [objective,kpi,kr,baseTeam,initiative,baseReview] = state.choices[4] === 1 ? delivery : quality;
    const [metric] = kpi;
    const chosenMetric = state.choices[6] === 1;
    const otherMetricKr = state.choices[4] === 1
      ? ['سهم سفارش‌های با تأخیر بیش از یک روز را این فصل از ۱۲٪ به ۵٪ برسانیم.', 'سهم سفارش‌های با تأخیر بیش از یک روز را این فصل از ۱۲٪ به ۸٪ برسانیم.']
      : ['نرخ برگشت ناشی از کیفیت را این فصل از ۴٪ به ۱٪ برسانیم.', 'نرخ برگشت ناشی از کیفیت را این فصل از ۴٪ به ۲٪ برسانیم.'];
    const team = chosenMetric ? (state.choices[4] === 1
      ? ['تیم ارسال · سفارش‌های از دست‌دهنده نوبت بارگیری را تا پایان فصل از ۱۰٪ به ۴٪ برساند.', 'تیم ارسال · سفارش‌های از دست‌دهنده نوبت بارگیری را تا پایان فصل از ۱۰٪ به ۶٪ برساند.']
      : ['تیم تولید · سهم سری‌های خارج از حدود کیفیت را تا پایان فصل از ۷٪ به ۲٪ برساند.', 'تیم تولید · سهم سری‌های خارج از حدود کیفیت را تا پایان فصل از ۷٪ به ۴٪ برساند.']) : baseTeam;
    const review = chosenMetric ? (state.choices[4] === 1
      ? ['هر هفته سفارش‌های با تأخیر بیش از یک روز را با آخرین هفته مقایسه کنیم و درباره تغییر برنامه بارگیری تصمیم بگیریم.', 'هر ماه سهم تأخیرهای طولانی را با هدف فصل مقایسه و علت اصلی را ثبت کنیم.']
      : ['هر هفته علت برگشت‌های کیفی را مرور و یک اقدام اصلاحی تعیین کنیم.', 'در پایان ماه، نرخ برگشت کیفی را با هدف فصل بسنجیم و اثر اصلاحات را بررسی کنیم.']) : baseReview;
    const results = chosenMetric ? otherMetricKr : kr;

    return [...direction,
      lesson('هدف سازمانی (Objective)', 'هدف سازمانی، تغییر مشخصی است که می‌خواهیم در این دوره ایجاد کنیم.', objective[0],
        'برای رکن انتخابی، کدام جهت را در این فصل دنبال می‌کنید؟', objective),
      lesson('شاخص عملکرد (KPI)', 'شاخص عملکرد نشان می‌دهد وضعیت کار چطور است و می‌توان آن را در چند دوره دنبال کرد.', metric + '.',
        'برای پایش هدف انتخابی، کدام شاخص به کار شما می‌آید؟', kpi),
      lesson('نتیجه کلیدی سازمان (KR)', 'نتیجه کلیدی، تغییر عددی مورد انتظار روی یک شاخص است. مقدار شروع، مقصد و مهلت را مشخص می‌کند.', results[0],
        'با توجه به شاخص انتخابی، کدام نتیجه را تا پایان فصل تعهد می‌کنید؟', results),
      lesson('هم‌راستایی تیم (Team OKR)', 'تیم بخشی از نتیجه سازمان را که در حوزه اختیار خودش است، به هدف و نتیجه قابل سنجش تبدیل می‌کند.', team[0],
        'کدام نتیجه را به‌عنوان سهم تیم در نتیجه سازمان ثبت می‌کنید؟', team),
      lesson('اقدام اجرایی (Initiative)', 'اقدام اجرایی کاری است که تیم برای حرکت دادن نتیجه کلیدی انجام می‌دهد.', initiative[0],
        'کدام اقدام به تیم کمک می‌کند نتیجه انتخابی را جلو ببرد؟', initiative),
      lesson('مرور پیشرفت (Check-in)', 'در مرور، مقدار واقعی با هدف مقایسه می‌شود و تیم درباره ادامه یا اصلاح اقدام تصمیم می‌گیرد.', review[0],
        'تیم چه زمانی و چگونه مسیر را بازبینی کند؟', review)
    ];
  }

  const key = 'bp-session6-okr-cascade-v1';
  let state = {choices: [], index: 0};
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Array.isArray(saved.choices) && Number.isInteger(saved.index)) state = saved;
  } catch {}
  state.index = Math.max(0, Math.min(steps().length, state.index));
  const stage = document.getElementById('stage');
  const jump = document.getElementById('review');
  const format = new Intl.NumberFormat('fa-IR', {useGrouping: false});
  const number = value => format.format(value);

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      document.getElementById('storage-status').textContent = 'مرورگر اجازه ذخیره نمی‌دهد. تا پایان تمرین این صفحه را باز نگه دارید.';
    }
  }
  function valid(i, item) {
    const answer = state.choices[i];
    return Number.isInteger(answer) && answer >= 0 && answer < item.options.length;
  }
  function go(i) {
    state.index = i;
    save();
    render(true);
  }
  function render(focus = false) {
    const items = steps(), index = state.index, item = items[index];
    const complete = items.every((step,i) => valid(i, step));
    const progress = document.getElementById('step-progress');
    progress.max = items.length;
    progress.value = items.filter((step,i) => valid(i,step)).length;
    document.getElementById('step-label').textContent = item ? 'گام ' + number(index+1) + ' از ' + number(items.length) : 'جمع‌بندی';
    jump.hidden = !complete || !item;

    if (item) {
      const previous = items[index-1];
      const parent = index === 4 ? 0 : index === 8 ? 7 : index-1;
      const context = previous && valid(parent, items[parent]) ? '<p class="context"><strong>' + items[parent].title + '</strong> · ' + items[parent].options[state.choices[parent]] + '</p>' : '';
      stage.innerHTML = '<h2 id="stage-title" tabindex="-1">' + item.title + '</h2>' + context + '<p>' + item.definition + '</p>' +
        '<p class="example"><strong>مثال به‌پرور</strong><br>' + item.example + '</p><form><fieldset><legend>' + item.question + '</legend>' +
        item.options.map((option,i) => '<label class="choice"><input required type="radio" name="answer" value="' + i + '" ' + (state.choices[index] === i ? 'checked' : '') + '><span>' + option + '</span></label>').join('') +
        '</fieldset><div class="actions"><button class="primary" type="submit">' + (index === items.length-1 ? 'دیدن زنجیره کامل' : 'گام بعدی ←') +
        '</button>' + (index ? '<button type="button" data-step="' + (index-1) + '">گام قبل</button>' : '') + '</div></form>';
    } else {
      stage.innerHTML = '<h2 id="stage-title" tabindex="-1">زنجیره استراتژی شما</h2><ol class="chain">' +
        items.map((step,i) => '<li><strong>' + step.title + '</strong><br>' + (valid(i, step) ? step.options[state.choices[i]] : 'انتخاب نشده') +
          ' <button type="button" data-step="' + i + '" aria-label="ویرایش ' + step.title + '">ویرایش</button></li>').join('') +
        '</ol><div class="actions"><button type="button" class="primary" id="print">چاپ یا ذخیره PDF</button></div>';
    }
    if (focus) {
      document.getElementById('stage-title').focus({preventScroll:true});
      window.scrollTo(0,0);
    }
  }
  stage.addEventListener('submit', event => {
    event.preventDefault();
    const index = state.index, choice = Number(new FormData(event.target).get('answer'));
    if (state.choices[index] !== choice) {
      if (index === 4) state.choices.length = Math.min(state.choices.length, 5);
      if (index === 6) state.choices.length = Math.min(state.choices.length, 7);
      state.choices[index] = choice;
    }
    go(index+1);
  });
  stage.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-step')) go(Number(button.dataset.step));
    if (button.id === 'print') window.print();
  });
  jump.addEventListener('click', () => go(steps().length));
  render();
})();
