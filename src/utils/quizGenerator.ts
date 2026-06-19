// src/utils/quizGenerator.ts
import { Question, Unit } from '../types';
import { curriculumData } from '../curriculumData';

// Generates a random integer between min and max inclusive
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Shuffle helper
const shuffleArray = <T>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Dynamic questions library generators
export const generateDynamicQuestion = (unitId: string, lessonId?: string, index: number = 0): Question => {
  const idSuffix = `_dyn_${index}_${getRandomInt(100, 999)}`;
  const category = lessonId || unitId;

  // Decide which topic question to generate based on Unit / Lesson
  if (unitId === 'unit_1') {
    // UNIT 1: Sets (المجموعات)
    const subTopic = lessonId ? lessonId : ['u1_l1', 'u1_l2', 'u1_l3', 'u1_l4'][index % 4];

    if (subTopic === 'u1_l1') {
      const setsOptions = [
        { item: 'مجموعة ولايات السودان السبعة عشر الكبرى', isSet: true },
        { item: 'التلاميذ المهذبون بالصف السادس', isSet: false },
        { item: 'الأعداد الفردية المحصورة بين 2 و 10', isSet: true },
        { item: 'روايات الأطفال المشوقة في منصة نقلة للمناهج الإلكترونية', isSet: false },
        { item: 'مدن السودان الجميلة جداً', isSet: false },
        { item: 'أحرف كلمة "خرطوم"', isSet: true },
      ];
      const pick = setsOptions[getRandomInt(0, setsOptions.length - 1)];
      const answer = pick.isSet ? 'صواب' : 'خطأ';
      return {
        id: `q_u1_l1${idSuffix}`,
        text: `التجمع "${pick.item}" يمثل مجموعة محددة بوضوح في مادة الرياضيات. صواب أم خطأ؟`,
        options: ['صواب', 'خطأ'],
        correctAnswer: answer,
        explanation: pick.isSet
          ? `العبارة صواب. التجمع محدد تماماً ولا مجال للاختلاف والذوق الشخصي في رصد عناصره.`
          : `العبارة خطأ. التجمع يحتوي على صفة نسبية تعتمد على الذوق والتقدير الشخصي، لذا لا يسمى مجموعة بالرياضيات.`,
        type: 'boolean',
      };
    } else if (subTopic === 'u1_l2') {
      const words = [
        { word: 'شندي', elements: 'ش، ن، د، ي' },
        { word: 'سنار', elements: 'س، ن، ا، ر' },
        { word: 'سمسم', elements: 'س، م' },
        { word: 'تطابق', elements: 'ت، ط، ا، ب، ق' },
      ];
      const pick = words[getRandomInt(0, words.length - 1)];
      return {
        id: `q_u1_l2${idSuffix}`,
        text: `عند كتابة مجموعة أحرف كلمة "${pick.word}" برصد العناصر، نحصل على المجموع الكلي التالي:`,
        options: [
          `{ ${pick.elements} }`,
          `{ ${pick.word} }`,
          `{ م، س، م، س }`,
          `{ ش، ن، د }`,
        ].slice(0, 3).concat([`{ ${pick.elements} }`].filter((v,i,a)=>a.indexOf(v)===i)).slice(0, 4), // ensuring options don't duplicate easily
        correctAnswer: `{ ${pick.elements} }`,
        explanation: `طريقة رصد العناصر تكتب بوضع العناصر داخل قوسي المجموعة { } مع فصلها بفاصلة وعدم تكرار أي عنصر إطلاقاً.`,
        type: 'multiple-choice',
      };
    } else if (subTopic === 'u1_l3') {
      return {
        id: `q_u1_l3${idSuffix}`,
        text: `ما هي الصياغة بالصفة المميزة الصحيحة للمجموعة ص = { 3، 5، 7، 9 }؟`,
        options: [
          'ص = { س : س عدد فردي محصور بين 2 و 10 }',
          'ص = { س : س عدد زوجي محصور بين 3 و 9 }',
          'ص = { س : س عدد طبيعي أقل من 9 }',
          'ص = { س : س أحرف فردية }',
        ],
        correctAnswer: 'ص = { س : س عدد فردي محصور بين 2 و 10 }',
        explanation: 'العناصر 3، 5، 7، 9 هي أعداد فردية محصورة تماماً بين العددين 2 و 10.',
        type: 'multiple-choice',
      };
    } else {
      const relations = [
        { elem: '7', set: '{ 1، 3، 5، 7، 9 }', symbol: '∈', reason: 'عنصر ينتمي لمجموعة' },
        { elem: '3', set: '{ 2، 4، 6 }', symbol: '∉', reason: 'عنصر لا ينتمي لمجموعة' },
        { elem: '{ 2، 4 }', set: '{ 1، 2، 3، 4 }', symbol: '⊂', reason: 'مجموعة محتواة في مجموعة' },
        { elem: '{ 5 }', set: '{ 1، 2، 3 }', symbol: '⊄', reason: 'مجموعة غير محتواة في مجموعة' },
      ];
      const pick = relations[getRandomInt(0, relations.length - 1)];
      return {
        id: `q_u1_l4${idSuffix}`,
        text: `الرمز الرياضي الصحيح الذي يجب وضعه في الفراغ: ${pick.elem} [ ..... ] ${pick.set} هو:`,
        options: ['∈', '∉', '⊂', '⊄'],
        correctAnswer: pick.symbol,
        explanation: `الرمز الصحيح هو (${pick.symbol}) لأن العلاقة هي (${pick.reason}).`,
        type: 'multiple-choice',
      };
    }
  }

  if (unitId === 'unit_2') {
    // UNIT 2: Integers (الأعداد الصحيحة)
    const subTopic = lessonId ? lessonId : ['u2_l1', 'u2_l2', 'u2_l3', 'u2_l4'][index % 4];

    if (subTopic === 'u2_l1') {
      const scenarios = [
        { text: 'عمق غواصة 50 متراً تحت مستوى سطح البحر', ans: '-50' },
        { text: 'درجة الحرارة 8 درجات تحت الصفر ببورتسودان', ans: '-8' },
        { text: 'تحقيق ربح تجاري قدره 350 جنيهاً سودانياً', ans: '+350' },
        { text: 'هبوط مصعد 6 طوابق لأسفل في مبنى الوزارة', ans: '-6' },
      ];
      const pick = scenarios[getRandomInt(0, scenarios.length - 1)];
      return {
        id: `q_u2_l1${idSuffix}`,
        text: `عبر بعدد صحيح مناسب عن الموقف التالي: "${pick.text}"`,
        options: [pick.ans, pick.ans.startsWith('-') ? pick.ans.replace('-', '+') : pick.ans.replace('+', '-'), '0', '100'],
        correctAnswer: pick.ans,
        explanation: `التحت أو الخسارة يعوض بإشارة سالبة (-)، بينما الصعود أو الربح يمثل بإشارة موجبة (+).`,
        type: 'multiple-choice',
      };
    } else if (subTopic === 'u2_l2') {
      const valA = getRandomInt(-20, -1);
      const valB = getRandomInt(1, 10);
      return {
        id: `q_u2_l2${idSuffix}`,
        text: `أي العلاقات الرياضية للمقارنة بين الأعداد التالية صحيحة ومثبتة؟`,
        options: [
          `${valA} > ${valB}`,
          `0 < ${valA}`,
          `-100 > -1`,
          `${valB} > ${valA}`,
        ],
        correctAnswer: `${valB} > ${valA}`,
        explanation: `أي عدد موجب (مثل ${valB}) هو دائماً أكبر قيمة من أي عدد صحيح سالب (مثل ${valA}).`,
        type: 'multiple-choice',
      };
    } else if (subTopic === 'u2_l3') {
      const val = getRandomInt(-60, -5);
      const absVal = Math.abs(val);
      return {
        id: `q_u2_l3${idSuffix}`,
        text: `احسب القيمة المطلقة للتعبير التالي: | ${val} | تساوي:`,
        options: [`${absVal}`, `${val}`, `-${absVal}`, '0'],
        correctAnswer: `${absVal}`,
        explanation: `القيمة المطلقة تجرد العدد من إشارته السالبة دائماً، لأنها تقيس المسافة الهندسية عن الصفر وهي موجبة دوماً.`,
        type: 'multiple-choice',
      };
    } else {
      // arithmetic sum/sub
      const opt = getRandomInt(1, 2);
      if (opt === 1) {
        // sum (-A) + B
        const a = getRandomInt(5, 20);
        const b = getRandomInt(5, 20);
        const ans = -a + b;
        return {
          id: `q_u2_l4${idSuffix}`,
          text: `أوجد ناتج عملية جمع الأعداد الصحيحة التالية بدقة: (-${a}) + ${b}`,
          options: [`${ans}`, `${-a - b}`, `${a + b}`, `${a - b}`],
          correctAnswer: `${ans}`,
          explanation: `مخالفا الإشارة: نطرح الصغير من الكبير (الفرق بين ${a} و ${b}) ونضع إشارة العدد الأكبر في قيمته المطلقة. الناتج هو ${ans}.`,
          type: 'multiple-choice',
        };
      } else {
        // A - (-B) -> A + B
        const a = getRandomInt(5, 20);
        const b = getRandomInt(3, 10);
        const ans = a + b;
        return {
          id: `q_u2_l4_sub${idSuffix}`,
          text: `احسب ناتج عملية طرح الأعداد الصحيحة التالية: ${a} - (-${b})`,
          options: [`${ans}`, `${a - b}`, `-${a + b}`, '0'],
          correctAnswer: `${ans}`,
          explanation: `طرح عدد سالب يتحول لجمع مع نظيره الجمعي: ${a} - (-${b}) = ${a} + ${b} = ${ans}.`,
          type: 'multiple-choice',
        };
      }
    }
  }

  if (unitId === 'unit_3') {
    // UNIT 3: Percentage (النسبة المئوية)
    const subTopic = lessonId ? lessonId : ['u3_l1', 'u3_l2'][index % 2];

    if (subTopic === 'u3_l1') {
      const fractions = [
        { frac: '1/4', pct: '25%' },
        { frac: '1/2', pct: '50%' },
        { frac: '3/4', pct: '75%' },
        { frac: '1/5', pct: '20%' },
        { frac: '2/5', pct: '40%' },
        { frac: '3/10', pct: '30%' },
      ];
      const pick = fractions[getRandomInt(0, fractions.length - 1)];
      return {
        id: `q_u3_l1${idSuffix}`,
        text: `النسبة المئوية التي تكافئ الكسر (${pick.frac}) تمثل تماماً بـ:`,
        options: [pick.pct, '10%', '15%', '85%'],
        correctAnswer: pick.pct,
        explanation: `لتحويل كسر إلى نسبة مئوية نضربه بـ 100٪. على سبيل المثال: ${pick.frac} × 100% = ${pick.pct}.`,
        type: 'multiple-choice',
      };
    } else {
      const percentages = [
        { pct: 20, total: 500, ans: 100 },
        { pct: 50, total: 80, ans: 40 },
        { pct: 10, total: 250, ans: 25 },
        { pct: 25, total: 400, ans: 100 },
        { pct: 30, total: 300, ans: 90 },
      ];
      const pick = percentages[getRandomInt(0, percentages.length - 1)];
      return {
        id: `q_u3_l2${idSuffix}`,
        text: `احسب القيمة الحقيقية للتعبير التالي: ما هي قيمة ${pick.pct}% من العدد ${pick.total} تلميذ؟`,
        options: [`${pick.ans}`, `${pick.ans * 2}`, `${pick.ans - 10}`, `${pick.ans + 50}`],
        correctAnswer: `${pick.ans}`,
        explanation: `نحسبها كالتالي: (${pick.pct} ÷ 100) × ${pick.total} = ${pick.ans}.`,
        type: 'multiple-choice',
      };
    }
  }

  if (unitId === 'unit_4') {
    // UNIT 4: Algebra (التعبير الجبري)
    const subTopic = lessonId ? lessonId : ['u4_l1', 'u4_l2'][index % 2];

    if (subTopic === 'u4_l1') {
      const coef = getRandomInt(2, 5);
      const xVal = getRandomInt(2, 6);
      const constVal = getRandomInt(1, 10);
      const ans = coef * xVal + constVal;
      return {
        id: `q_u4_l1${idSuffix}`,
        text: `إذا كانت قيمة س = ${xVal}، فإن قيمة التعبير الجبري الممثل بـ (${coef}س + ${constVal}) تساوي:`,
        options: [`${ans}`, `${coef + xVal + constVal}`, `${coef * (xVal + constVal)}`, '20'],
        correctAnswer: `${ans}`,
        explanation: `نعوض قيمة س بـ ${xVal}: (${coef} × ${xVal}) + ${constVal} = ${coef * xVal} + ${constVal} = ${ans}.`,
        type: 'multiple-choice',
      };
    } else {
      const a = getRandomInt(2, 6);
      const b = getRandomInt(2, 6);
      const c = getRandomInt(2, 6);
      const sumX = a + c;
      return {
        id: `q_u4_l2${idSuffix}`,
        text: `قم بتبسيط المقدار الجبري التالي بجمع الحدود المتشابهة: (${a}س + ${b}ص + ${c}س)`,
        options: [
          `${sumX}س + ${b}ص`,
          `${a + b + c}س ص`,
          `${a}س + ${b + c}ص`,
          `${sumX}ص + ${b}س`,
        ],
        correctAnswer: `${sumX}س + ${b}ص`,
        explanation: `نجمع حدود س المتشابهة معاً: (${a}س + ${c}س) = ${sumX}س. ويبقى حد ص كما هو، فنحصل على: ${sumX}س + ${b}ص.`,
        type: 'multiple-choice',
      };
    }
  }

  if (unitId === 'unit_5') {
    // UNIT 5: Operations on Sets (العمليات على المجموعات)
    const subTopic = lessonId ? lessonId : ['u5_l1', 'u5_l2', 'u5_l3'][index % 3];

    if (subTopic === 'u5_l1') {
      return {
        id: `q_u5_l1${idSuffix}`,
        text: `إذا كانت س = { 1، 2، 3 }، ص = { 3، 4، 5 }، فإن تقاطع المجموعتين (س ∩ ص) يساوي:`,
        options: ['{ 3 }', '{ 1، 2، 3، 4، 5 }', '{ 1، 2 }', '{ }'],
        correctAnswer: '{ 3 }',
        explanation: 'التقاطع (∩) يعني أخذ العناصر المشتركة فقط المتواجدة في كلا المجموعتين، والعنصر المشترك الوحيد هو 3.',
        type: 'multiple-choice',
      };
    } else if (subTopic === 'u5_l2') {
      return {
        id: `q_u5_l2${idSuffix}`,
        text: `إذا كانت س = { 1، 2 }، ص = { 2، 3 }، فإن اتحاد المجموعتين (س ∪ ص) يمثل بالرصد التالي:`,
        options: ['{ 1، 2، 3 }', '{ 2 }', '{ 1، 3 }', '{ 1، 2، 2، 3 }'],
        correctAnswer: '{ 1، 2، 3 }',
        explanation: 'الاتحاد (∪) يعني دمج كافة عناصر المجموعتين معاً في مجموعة واحدة دون تكرار أي عنصر.',
        type: 'multiple-choice',
      };
    } else {
      return {
        id: `q_u5_l3${idSuffix}`,
        text: `إذا كانت س = { 1، 2، 3 }، ص = { 3، 4، 5 }، فإن الفرق بين المجموعتين (س - ص) يساوي:`,
        options: ['{ 1، 2 }', '{ 4، 5 }', '{ 3 }', '{ 1، 2، 3، 4، 5 }'],
        correctAnswer: '{ 1، 2 }',
        explanation: 'الفرق (س - ص) يعني كل العناصر التي تنتمي إلى س وفي نفس الوقت لا تنتمي إلى ص، وهي { 1، 2 }.',
        type: 'multiple-choice',
      };
    }
  }

  if (unitId === 'unit_6') {
    // UNIT 6: Area of 2D shapes (مساحة الأشكال الثنائية)
    const subTopic = lessonId ? lessonId : ['u6_l1', 'u6_l2', 'u6_l3'][index % 3];

    if (subTopic === 'u6_l1') {
      const b = getRandomInt(6, 15);
      const h = getRandomInt(4, 10);
      const ans = b * h;
      return {
        id: `q_u6_l1${idSuffix}`,
        text: `احسب مساحة متوازي أضلاع إذا كان طول قاعدته = ${b} سم وارتفاعه المتعامد = ${h} سم.`,
        options: [`${ans} سم^2`, `${b + h} سم^2`, `${(b + h) * 2} سم^2`, `${Math.round((b * h) / 2)} سم^2`],
        correctAnswer: `${ans} سم^2`,
        explanation: `مساحة متوازي الأضلاع = طول القاعدة × الارتفاع = ${b} × ${h} = ${ans} سم^2.`,
        type: 'multiple-choice',
      };
    } else if (subTopic === 'u6_l2') {
      const isSquare = getRandomInt(1, 2) === 1;
      if (isSquare) {
        const s = getRandomInt(4, 12);
        const ans = s * s;
        return {
          id: `q_u6_l2_sq${idSuffix}`,
          text: `احسب المساحة الكلية لمربع إذا كان طول ضلعه الكلي = ${s} سم.`,
          options: [`${ans} سم^2`, `${s * 4} سم^2`, `${s * 2} سم^2`, '100 سم^2'],
          correctAnswer: `${ans} سم^2`,
          explanation: `مساحة المربع = طول الضلع × نفسه = ${s} × ${s} = ${ans} سم^2.`,
          type: 'multiple-choice',
        };
      } else {
        const l = getRandomInt(6, 12);
        const w = getRandomInt(3, 5);
        const ans = l * w;
        return {
          id: `q_u6_l2_rect${idSuffix}`,
          text: `احسب مساحة مستطيل طوله الداخلي = ${l} سم وعرضه الجانبي = ${w} سم.`,
          options: [`${ans} سم^2`, `${(l + w) * 2} سم^2`, `${l + w} سم^2`, '24 سم^2'],
          correctAnswer: `${ans} سم^2`,
          explanation: `مساحة المستطيل = الطول × العرض = ${l} × ${w} = ${ans} سم^2.`,
          type: 'multiple-choice',
        };
      }
    } else {
      return {
        id: `q_u6_l3${idSuffix}`,
        text: `احسب مساحة دائرة نصف قطرها (نق) = 7 سم (مستخدماً القيمة التقريبية ط = 22/7):`,
        options: ['154 سم^2', '44 سم^2', '88 سم^2', '308 سم^2'],
        correctAnswer: '154 سم^2',
        explanation: 'مساحة الدائرة = ط × نق^2 = 22/7 × 7^2 = 22 × 7 = 154 سم^2.',
        type: 'multiple-choice',
      };
    }
  }

  // UNIT 7: Pythagoras & Congruence (فيثاغورث والتطابق)
  const subTopic = lessonId ? lessonId : ['u7_l1', 'u7_l2'][index % 2];

  if (subTopic === 'u7_l1') {
    const triads = [
      { a: 3, b: 4, c: 5 },
      { a: 6, b: 8, c: 10 },
      { a: 5, b: 12, c: 13 },
    ];
    const pick = triads[getRandomInt(0, triads.length - 1)];
    const findHypotenuse = getRandomInt(1, 2) === 1;

    if (findHypotenuse) {
      return {
        id: `q_u7_l1_hyp${idSuffix}`,
        text: `في مثلث قائم الزاوية، إذا كان طولا ضلعي القائمة هما ${pick.a} سم و ${pick.b} سم، فإن طول الوتر يساوي:`,
        options: [`${pick.c} سم`, `${pick.a + pick.b} سم`, `${pick.c * 2} سم`, '25 سم'],
        correctAnswer: `${pick.c} سم`,
        explanation: `حسب نظرية فيثاغورث، مربع الوتر = مربع الضلع الأول + مربع الضلع الثاني. إذن: ${pick.a}^2 + ${pick.b}^2 = ${pick.a * pick.a} + ${pick.b * pick.b} = ${pick.c * pick.c}. وجذرها هو ${pick.c} سم.`,
        type: 'multiple-choice',
      };
    } else {
      return {
        id: `q_u7_l1_side${idSuffix}`,
        text: `في مثلث قائم الزاوية، إذا كان طول الوتر = ${pick.c} سم، وطول أحد ضلعي القائمة = ${pick.a} سم، فإن طول الضلع الآخر هو:`,
        options: [`${pick.b} سم`, `${pick.c - pick.a} سم`, `${pick.b + 2} سم`, '12 سم'],
        correctAnswer: `${pick.b} سم`,
        explanation: `حسب نظرية فيثاغورث: (الضلع الآخر)^2 = الوتر^2 - الضلع المعلوم^2 = ${pick.c}^2 - ${pick.a}^2 = ${pick.c * pick.c} - ${pick.a * pick.a} = ${pick.b * pick.b}. وجذرها يساوي ${pick.b} سم.`,
        type: 'multiple-choice',
      };
    }
  } else {
    // congruence
    const cases = [
      { code: 'ض.ض.ض', label: 'ضلع، ضلع، ضلع' },
      { code: 'ض.ز.ض', label: 'ضلع، زاوية، ضلع' },
      { code: 'ز.ض.ز', label: 'زاوية، ضلع، زاوية' },
      { code: 'ق.و.ض', label: 'زاوية قائمة، وتر، ضلع' },
    ];
    const pick = cases[getRandomInt(0, cases.length - 1)];
    return {
      id: `q_u7_l2${idSuffix}`,
      text: `إذا تطابق في مثلثين (${pick.label})، فإن حالة هذا التطابق يرمز لها بالرمز:`,
      options: ['ض.ض.ض', 'ض.ز.ض', 'ز.ض.ز', 'ق.و.ض'].slice(0, 3).concat([pick.code]).filter((v,i,a)=>a.indexOf(v)===i).slice(0, 4),
      correctAnswer: pick.code,
      explanation: `الحالة المناسبة لاختصار (${pick.label}) هي الرمز المعتمد (${pick.code}).`,
      type: 'multiple-choice',
    };
  }
};

interface QuizGenerationOptions {
  scope: 'all' | 'unit' | 'lesson';
  unitId?: string;
  lessonId?: string;
  count: number; // Max 40
}

export const generateCustomQuiz = (options: QuizGenerationOptions): Question[] => {
  let pool: Question[] = [];

  // Gather static questions from appropriate scope first
  curriculumData.forEach((unit) => {
    // If filtering by unit, must match unitId
    if (options.scope === 'unit' && unit.id !== options.unitId) return;
    
    // Static questions of unit
    unit.quizzes.forEach((q) => {
      // If filtering by lesson, check if question relates to the lesson
      // Static questions do not have lessonId, but we can filter by prefix or just let them be part of the pool if matched
      if (options.scope === 'lesson' && options.lessonId) {
        // e.g., if lessonId is u1_l1, question is q_u1_1, match u1
        const uPrefix = options.lessonId.split('_')[0]; // u1
        if (q.id.startsWith(`q_${uPrefix}`)) {
          // Add it since it matches unit prefix
          pool.push(q);
        }
      } else {
        pool.push(q);
      }
    });
  });

  // Shuffle the static questions to provide variability
  let resultQuestions = shuffleArray(pool);

  // If we have more static questions than requested, truncate
  if (resultQuestions.length >= options.count) {
    return resultQuestions.slice(0, options.count);
  }

  // Otherwise, we need to generate dynamic math questions to fill the rest up to "count"
  const needed = options.count - resultQuestions.length;
  const dynamicPool: Question[] = [];

  for (let i = 0; i < needed * 2; i++) {
    // Pick suitable unit list to pull questions from
    let targetUnitId = options.unitId;
    let targetLessonId = options.lessonId;

    if (options.scope === 'all') {
      const randomUnit = curriculumData[getRandomInt(0, curriculumData.length - 1)];
      targetUnitId = randomUnit.id;
      targetLessonId = undefined;
    } else if (options.scope === 'unit' && options.unitId) {
      targetUnitId = options.unitId;
      targetLessonId = undefined;
    }

    if (targetUnitId) {
      dynamicPool.push(generateDynamicQuestion(targetUnitId, targetLessonId, i));
    }
  }

  // De-duplicate generated IDs or texts if any
  const uniqueDynamic: Question[] = [];
  const textsSeen = new Set<string>();

  dynamicPool.forEach((q) => {
    if (!textsSeen.has(q.text)) {
      textsSeen.add(q.text);
      uniqueDynamic.push(q);
    }
  });

  // Add the unique dynamic questions to fill-out the result list
  const filledQuestions = [...resultQuestions, ...uniqueDynamic].slice(0, options.count);

  return filledQuestions;
};
