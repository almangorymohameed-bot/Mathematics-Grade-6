import React, { useState } from 'react';
import { 
  Gamepad2, Check, X, RefreshCw, Trophy, Sparkles, 
  ArrowUp, ArrowDown, Sailboat, AlertCircle, Play, Star, 
  HelpCircle, Scale, ShoppingBag, Percent
} from 'lucide-react';
import { toEasternArabicNumerals } from '../curriculumData';

interface MathGamesProps {
  isArabicNumeral: boolean;
  onAwardPoints: (points: number) => void;
  studentName: string;
}

type GameType = 'sets_fishing' | 'integers_elevator' | 'pythagoras_sail' | 'percentage_market' | 'algebra_scale';

export const MathGames: React.FC<MathGamesProps> = ({
  isArabicNumeral,
  onAwardPoints,
  studentName
}) => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [score, setScore] = useState<number>(0);
  const [hearts, setHearts] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  
  // Custom number printer
  const printNum = (num: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(num) : num.toString();
  };

  // State for Sets Fishing
  const [fishingQuestionIdx, setFishingQuestionIdx] = useState<number>(0);
  const FISHING_QUESTIONS = [
    {
      targetSet: "مجموعة الأعداد الفردية أقل من ١٠",
      element: 7,
      isBelong: true,
      explanation: "العدد ٧ هو عدد فردي وهو أصغر من ١٠، لذلك فهو ينتمي للمجموعة."
    },
    {
      targetSet: "مجموعة ولايات السودان التي تقع على ساحل البحر الأحمر",
      element: "ولاية كسلا",
      isBelong: false,
      explanation: "ولاية كسلا ولاية شرقية ولكن ليس لها ساحل مباشر على البحر الأحمر (الساحل هو لولاية البحر الأحمر وعاصمتها بورتسودان)."
    },
    {
      targetSet: "مجموعة الأعداد الحاصرة بين ٢ و ٧ (دون الطرفين)",
      element: 2,
      isBelong: false,
      explanation: "بما أننا ذكرنا 'دون الطرفين'، فإن العدد ٢ لا ينطبق عليه الشرط ولا ينتمي للمجموعة."
    },
    {
      targetSet: "مجموعة عواصم الدول المجاورة للسودان",
      element: "أديس أبابا",
      isBelong: true,
      explanation: "أديس أبابا هي عاصمة إثيوبيا، وإثيوبيا دولة جارة شقيقة للسودان، لذلك فهي تنتمي للمجموعة."
    },
    {
      targetSet: "مجموعة مضاعفات العدد ٥ الأصغر من ٢٥",
      element: 20,
      isBelong: true,
      explanation: "العدد ٢٠ من مضاعفات ٥ (٥، ١٠، ١٥، ٢٠) وهو أصغر من ٢٥، إذن ينتمي."
    },
    {
      targetSet: "مجموعة الأعداد الزوجية الأولى الموجبة",
      element: 13,
      isBelong: false,
      explanation: "العدد ١٣ هو عدد فردي وليس زوجي، إذن لا ينتمي للمجموعة."
    }
  ];

  // State for Integers Elevator Drill
  const [elevatorTarget, setElevatorTarget] = useState<{
    start: number;
    moves: Array<{ type: 'up' | 'down'; steps: number }>;
    final: number;
    text: string;
  }>(() => generateElevatorQuestion());

  function generateElevatorQuestion() {
    const start = Math.floor(Math.random() * 5) - 2; // -2 to 2
    const dir1 = Math.random() > 0.5 ? 'up' : 'down';
    const steps1 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const dir2 = Math.random() > 0.5 ? 'up' : 'down';
    const steps2 = Math.floor(Math.random() * 3) + 1; // 1 to 3

    let current = start;
    const moves: Array<{ type: 'up' | 'down'; steps: number }> = [];

    // move 1
    if (dir1 === 'up') {
      current += steps1;
      moves.push({ type: 'up', steps: steps1 });
    } else {
      current -= steps1;
      moves.push({ type: 'down', steps: steps1 });
    }

    // move 2
    if (dir2 === 'up') {
      current += steps2;
      moves.push({ type: 'up', steps: steps2 });
    } else {
      current -= steps2;
      moves.push({ type: 'down', steps: steps2 });
    }

    const startText = start === 0 ? "عند مستوى سطح الأرض (٠)" : start > 0 ? `في الطابق ${start} فوق الأرض` : `في المستودع ${Math.abs(start)} تحت الأرض`;
    const move1Text = dir1 === 'up' ? `صَعَدَ ${steps1} طوابق` : `هَبَطَ ${steps1} طوابق`;
    const move2Text = dir2 === 'up' ? `ثم صَعَدَ ${steps2} طوابق جديدة` : `ثم هَبَطَ ${steps2} طوابق أخرى`;

    return {
      start,
      moves,
      final: current,
      text: `بدأ مهندس النفط في حقل هجليج الحركة بقفص المناوبين من: [${startText}]، ثم [${move1Text}]، [${move2Text}]. في أي مستوى أو طابق يقف قفص المهندس الآن؟`
    };
  }

  const [selectedElevatorFloor, setSelectedElevatorFloor] = useState<number>(0);

  // State for Pythagoras Sail Boat
  const [pythagorasData, setPythagorasData] = useState<{
    base: number;
    height: number;
    hypotenuse: number;
    options: number[];
  }>(() => generatePythagorasQuestion());

  function generatePythagorasQuestion() {
    const sets = [
      { b: 3, h: 4, hyp: 5 },
      { b: 6, h: 8, hyp: 10 },
      { b: 5, h: 12, hyp: 13 },
      { b: 9, h: 12, hyp: 15 },
      { b: 8, h: 15, hyp: 17 }
    ];
    const chosen = sets[Math.floor(Math.random() * sets.length)];
    
    // Generate 4 randomized options
    const optionsSet = new Set<number>();
    optionsSet.add(chosen.hyp);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 8) - 4;
      const val = chosen.hyp + offset;
      if (val > 0) {
        optionsSet.add(val);
      }
    }

    return {
      base: chosen.b,
      height: chosen.h,
      hypotenuse: chosen.hyp,
      options: Array.from(optionsSet).sort((x, y) => x - y)
    };
  }

  // State for Percentage Market (NEW!)
  const [marketQuestion, setMarketQuestion] = useState<{
    product: string;
    originalPrice: number;
    percentage: number;
    question: string;
    answer: number;
    options: number[];
  }>(() => generateMarketQuestion());

  function generateMarketQuestion() {
    const items = [
      { product: "شوال كركدي فخم", basePrice: 4000, pct: 10 },
      { product: "جردل تمر بركا بلدي", basePrice: 2000, pct: 25 },
      { product: "شوال صمغ عربي نقي", basePrice: 8000, pct: 20 },
      { product: "ربع بلح قنديلة ممتاز", basePrice: 12000, pct: 15 },
      { product: "جوال فول سوداني محمص", basePrice: 6000, pct: 30 }
    ];
    const chosen = items[Math.floor(Math.random() * items.length)];
    const discount = (chosen.basePrice * chosen.pct) / 100;
    
    const optionsSet = new Set<number>();
    optionsSet.add(discount);
    while (optionsSet.size < 4) {
      const offset = (Math.floor(Math.random() * 6) - 3) * (chosen.basePrice / 100);
      const val = discount + offset;
      if (val > 0 && val !== discount) {
        optionsSet.add(val);
      } else {
        optionsSet.add(discount + 150);
      }
    }

    return {
      product: chosen.product,
      originalPrice: chosen.basePrice,
      percentage: chosen.pct,
      question: `يريد زبون شراء [${chosen.product}] بسعر أساسي قدره ${chosen.basePrice} جنيه سوداني. قدمت له خصماً خاصاً بقيمة [${chosen.pct}٪] لجلب البركة والتيسير. احسب القيمة الفعلية لهذا الخصم بالجنيه!`,
      answer: discount,
      options: Array.from(optionsSet).sort((a, b) => a - b)
    };
  }

  // State for Algebra Scale (NEW!)
  const [scaleQuestion, setScaleQuestion] = useState<{
    lhsText: string;
    rhsValue: number;
    correctX: number;
    options: number[];
    op: '+' | '-' | '*';
    operand: number;
  }>(() => generateScaleQuestion());

  function generateScaleQuestion() {
    const ops: Array<'+' | '-' | '*'> = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let correctX = Math.floor(Math.random() * 8) + 2; // 2 to 9
    let operand = Math.floor(Math.random() * 6) + 2; // 2 to 7
    let rhsValue = 0;
    let lhsText = "";

    if (op === '+') {
      rhsValue = correctX + operand;
      lhsText = `س + ${operand}`;
    } else if (op === '-') {
      correctX = Math.floor(Math.random() * 8) + operand + 1;
      rhsValue = correctX - operand;
      lhsText = `س - ${operand}`;
    } else {
      rhsValue = operand * correctX;
      lhsText = `${operand}س`;
    }

    const optionsSet = new Set<number>();
    optionsSet.add(correctX);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 6) - 3;
      const val = correctX + offset;
      if (val > 0 && val !== correctX) {
        optionsSet.add(val);
      } else {
        optionsSet.add(correctX + 1);
      }
    }

    return {
      lhsText,
      rhsValue,
      correctX,
      options: Array.from(optionsSet).sort((a, b) => a - b),
      op,
      operand
    };
  }

  const [activeScaleHoverValue, setActiveScaleHoverValue] = useState<number | null>(null);

  // Handle Answers globally
  const handleAnswerResult = (isCorrect: boolean, successPoints: number, onNext: () => void) => {
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      onAwardPoints(successPoints);
      
      if (newScore >= 5) {
        setGameWon(true);
        onAwardPoints(30); // Bonus reward for winning!
      } else {
        onNext();
      }
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setGameOver(true);
      } else {
        onNext();
      }
    }
  };

  const resetGameSession = (game: GameType) => {
    setActiveGame(game);
    setScore(0);
    setHearts(3);
    setGameOver(false);
    setGameWon(false);
    
    // Reset individual game states
    if (game === 'sets_fishing') {
      setFishingQuestionIdx(0);
    } else if (game === 'integers_elevator') {
      setElevatorTarget(generateElevatorQuestion());
      setSelectedElevatorFloor(0);
    } else if (game === 'pythagoras_sail') {
      setPythagorasData(generatePythagorasQuestion());
    } else if (game === 'percentage_market') {
      setMarketQuestion(generateMarketQuestion());
    } else if (game === 'algebra_scale') {
      setScaleQuestion(generateScaleQuestion());
      setActiveScaleHoverValue(null);
    }
  };

  return (
    <div className="space-y-6 text-right">
      {/* Upper description */}
      {!activeGame ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-850 dark:text-amber-500 text-lg flex items-center gap-2 justify-end">
                <span>معمل الألعاب والمسابقات الرياضية التنشيطية</span>
                <Gamepad2 className="w-6 h-6 text-indigo-600 dark:text-amber-400" />
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-350 mt-1">
                تحديات ممتعة صممت لتعزيز وتحفيز الفهم الهندسي والجبري والمنطقي لكافة دروس المنهج السوداني!
              </p>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 rounded-2xl p-3 flex items-center gap-2 text-right justify-end shrink-0">
              <span className="text-xl">🏆</span>
              <div>
                <span className="text-[10px] text-amber-800 dark:text-amber-400 block font-bold">جوائز الذكاء أوفلاين</span>
                <span className="text-xs font-black text-slate-700 dark:text-slate-200">كل إجابة صحيحة تمنحك نقاطاً حقيقية!</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game 1 info card */}
            <div className="bg-white dark:bg-[#1a1a15] border border-slate-200/70 dark:border-[#2e2e24] rounded-3xl p-5 shadow-sm hover:shadow-md transition text-right flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl">
                  🐟
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">صيد عناصر المجموعات بالنيل</h4>
                  <span className="text-[9px] font-bold bg-emerald-100/40 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-md inline-block mt-1">امتداد للوحدة الأولى والخامسة</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed">
                    انطلق في رحلة صيد عبر بحيرات السودان، وافحص العناصر لتحدد بدقة وعناية انتمائها للمجموعة الرياضية المطلوبة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => resetGameSession('sets_fishing')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" /> ابدأ المغامرة الآن
              </button>
            </div>

            {/* Game 2 info card */}
            <div className="bg-white dark:bg-[#1a1a15] border border-slate-200/70 dark:border-[#2e2e24] rounded-3xl p-5 shadow-sm hover:shadow-md transition text-right flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
                  🛗
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">مصعد حفر بئر النفط هجليج</h4>
                  <span className="text-[9px] font-bold bg-amber-100/40 text-amber-800 dark:text-amber-400 px-2 py-0.5 rounded-md inline-block mt-1">تطبيقات الأعداد الصحيحة (الوحدة ٢)</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed">
                    تحكم بحركة قفص المهندسين في الآبار الباطنية للنفط. تدرب على عمليات الجمع والطرح للأعداد الصحيحة بحركة رأسية تفاعلية جذابة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => resetGameSession('integers_elevator')}
                className="w-full bg-amber-650 hover:bg-amber-705 text-white text-xs font-black py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" /> ابدأ المغامرة الآن
              </button>
            </div>

            {/* Game 3 info card */}
            <div className="bg-white dark:bg-[#1a1a15] border border-slate-200/70 dark:border-[#2e2e24] rounded-3xl p-5 shadow-sm hover:shadow-md transition text-right flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl">
                  ⛵
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">أشرعة قوارب فيثاغورث بالخرطوم</h4>
                  <span className="text-[9px] font-bold bg-indigo-100/40 text-indigo-850 dark:text-indigo-400 px-2 py-0.5 rounded-md inline-block mt-1">فهم أطوال المثلث القائم وتطبيقاته</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed">
                    ساعد أصحاب المراكب الشراعية بالنيل الأزرق في تفصيل شراع متين! احسب طول الوتر الفولاذي المائل بناءً على قاعدة المثلث وارتفاعه بسرعة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => resetGameSession('pythagoras_sail')}
                className="w-full bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-black py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" /> ابدأ المغامرة الآن
              </button>
            </div>

            {/* Game 4 info card (NEW!) */}
            <div className="bg-white dark:bg-[#1a1a15] border border-slate-200/70 dark:border-[#2e2e24] rounded-3xl p-5 shadow-sm hover:shadow-md transition text-right flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 text-2xl">
                  🛍️
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">حسابات وبائع سوق أم درمان المئوي</h4>
                  <span className="text-[9px] font-bold bg-red-100/40 text-red-800 dark:text-red-400 px-2 py-0.5 rounded-md inline-block mt-1">الكسور والنسب المئوية (الوحدة ٣)</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed">
                    كن التاجر الأذكى والأنشط في أكبر أسواق السودان التاريخية! احسب مبالغ التخفيضات ومكاسب المحاصيل للزبائن فورياً وبثقة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => resetGameSession('percentage_market')}
                className="w-full bg-red-650 hover:bg-red-750 text-white text-xs font-black py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" /> ابدأ المغامرة الآن
              </button>
            </div>

            {/* Game 5 info card (NEW!) */}
            <div className="bg-white dark:bg-[#1a1a15] border border-slate-200/70 dark:border-[#2e2e24] rounded-3xl p-5 shadow-sm hover:shadow-md transition text-right flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-2xl">
                  ⚖️
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">ميزان الذهب الذكي في سوق شندي</h4>
                  <span className="text-[9px] font-bold bg-cyan-100/40 text-cyan-850 dark:text-cyan-400 px-2 py-0.5 rounded-md inline-block mt-1">الجبر والحلول التفاعلية (الوحدة ٤)</span>
                  <p className="text-xs text-slate-600 dark:text-slate-350 mt-2.5 leading-relaxed">
                    عدّل كفتي الميزان عبر حساب قيم المقادير والمجاهيل س وتجربتها بشكل تفاعلي مرئي لتثبت مهاراتك الفائقة في الموازنات المتناظرة.
                  </p>
                </div>
              </div>
              <button
                onClick={() => resetGameSession('algebra_scale')}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-black py-3 rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play className="w-4 h-4 fill-white" /> ابدأ المغامرة الآن
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Active Game screen template wrapper with score states & hearts
        <div className="bg-white dark:bg-[#1a1a15] border border-slate-200/60 dark:border-[#2e2e24] p-6 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-150 dark:border-[#2e2e24] pb-4">
            <button
              onClick={() => setActiveGame(null)}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-amber-400 transition"
            >
              ← العودة لساحة الألعاب الرئيسية
            </button>
            
            {/* Status indicators */}
            <div className="flex items-center gap-4 text-xs font-extrabold">
              <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-xl border border-rose-100/40">
                <span className="text-sm">❤️</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-1">المحاولات:</span>
                <span className="font-black text-xs">{printNum(hearts)}</span>
              </div>

              <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-xl border border-yellow-105">
                <span className="text-sm">🎯</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">الصحية:</span>
                <span className="font-black text-xs">{printNum(score)} / {printNum(5)}</span>
              </div>
            </div>
          </div>

          {!gameOver && !gameWon ? (
            <div>
              {/* GAME 1: Sets Fishing */}
              {activeGame === 'sets_fishing' && (
                <div className="space-y-6">
                  {/* High contrast alert banner */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border border-emerald-250 dark:border-emerald-800/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-emerald-500">🧭</span>
                      <h4 className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm">مهمة الصيد النشق للأرقام والمفاهيم:</h4>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      المرشد البحري يعرض عليك دليلاً للمجموعات. والآن، شبكتك اصطادت العنصر الموضح أدناه. 
                      هل هذا العنصر <span className="font-extrabold text-indigo-700 dark:text-indigo-350 underline underline-offset-2">ينتمي</span> أم <span className="font-extrabold text-rose-600 dark:text-rose-350 underline underline-offset-2">لا ينتمي</span> للمجموعة؟
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#13130e] border border-slate-200 dark:border-[#2e2e24] p-6 rounded-2xl text-center space-y-5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">اسم المجموعة المستهدفة:</span>
                      <h5 className="text-base font-black text-indigo-900 dark:text-indigo-300">
                        {FISHING_QUESTIONS[fishingQuestionIdx].targetSet}
                      </h5>
                    </div>

                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-tr from-[#ede9fe] to-[#c7d2fe] dark:from-[#2e1065] dark:to-[#1e1b4b] border-2 border-indigo-300 dark:border-indigo-800 rounded-full flex items-center justify-center text-xl font-black text-indigo-900 dark:text-indigo-200 shadow-sm animate-pulse">
                        {printNum(FISHING_QUESTIONS[fishingQuestionIdx].element)}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-350 mt-2 block font-medium">هل هذا العنصر ضمن المجموعة السابقة؟</span>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => {
                          const current = FISHING_QUESTIONS[fishingQuestionIdx];
                          const correct = current.isBelong === true;
                          handleAnswerResult(correct, 15, () => {
                            setFishingQuestionIdx((prev) => (prev + 1) % FISHING_QUESTIONS.length);
                          });
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 px-8 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                      >
                        <Check className="w-4 h-4 text-white" /> ينتمي (∈)
                      </button>
                      
                      <button
                        onClick={() => {
                          const current = FISHING_QUESTIONS[fishingQuestionIdx];
                          const correct = current.isBelong === false;
                          handleAnswerResult(correct, 15, () => {
                            setFishingQuestionIdx((prev) => (prev + 1) % FISHING_QUESTIONS.length);
                          });
                        }}
                        className="bg-rose-600 hover:bg-rose-750 text-white font-black text-xs py-3.5 px-8 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition"
                      >
                        <X className="w-4 h-4 text-white" /> لا ينتمي (∉)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 2: Integers Elevator */}
              {activeGame === 'integers_elevator' && (
                <div className="space-y-6">
                  {/* Rich high contrast banner */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-250 dark:border-amber-800/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-amber-500">⚙️</span>
                      <h4 className="font-extrabold text-amber-850 dark:text-amber-300 text-sm">مهمة مهندس الآبار في هجليج:</h4>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      اقرأ مسار حركة القفص العمودي بعناية، ثم اضبط مؤشر الرافعة أو اختر الطابق الصحيح الذي استقر عنده المهندس بعد الحفر.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#13130e] border border-slate-200 dark:border-[#2e2e24] p-6 rounded-2xl text-right space-y-6">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">لغز الحركة والارتفاع:</span>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-relaxed border-r-4 border-amber-500 pr-3">
                        {elevatorTarget.text}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                      {/* Left: Interactive elevator vertical schematic */}
                      <div className="md:col-span-1 bg-white dark:bg-[#1c1c16] rounded-2xl p-4 border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">تمثيل بئر المصعد</span>
                        {/* vertical floors bar */}
                        <div className="flex flex-col gap-1 w-full max-w-[80px]">
                          {[4, 3, 2, 1, 0, -1, -2, -3, -4].map((f) => {
                            const isCurrentSelected = selectedElevatorFloor === f;
                            return (
                              <button
                                key={f}
                                onClick={() => setSelectedElevatorFloor(f)}
                                className={`text-[10px] p-1 rounded font-black text-center border transition ${
                                  isCurrentSelected 
                                    ? 'bg-amber-600 border-amber-655 text-white scale-[1.05]' 
                                    : 'bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 border-slate-200 dark:border-[#2e2e24]'
                                }`}
                              >
                                {f > 0 ? `+${f}` : f === 0 ? 'السطح (٠)' : f}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Choices & Answer confirm button */}
                      <div className="md:col-span-3 space-y-4">
                        <div className="p-4 bg-amber-50/20 dark:bg-amber-950/20 border border-dashed border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
                          <span className="text-[11px] block font-bold text-slate-600 dark:text-amber-300">اختيارك الحالي للارتفاع:</span>
                          <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                            {selectedElevatorFloor > 0 
                              ? `الطابق [ +${printNum(selectedElevatorFloor)} ] فوق مستوى سطح الأرض` 
                              : selectedElevatorFloor === 0 
                                ? "مستوى سطح الأرض المتزن بالضبط [ ٠ ]" 
                                : `المستودع الباطني البئر [ ${printNum(selectedElevatorFloor)} ] تحت الأرض`
                            }
                          </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                          {[-3, -2, -1, 0, 1, 2, 3, 4].map((i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedElevatorFloor(i)}
                              className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                                selectedElevatorFloor === i
                                  ? 'bg-amber-600 text-white border-amber-600'
                                  : 'bg-white hover:bg-slate-50 dark:bg-[#1c1c16] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-[#2e2e24]'
                              }`}
                            >
                              الجواب: {i > 0 ? `+${printNum(i)}` : printNum(i)}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            const isCorrect = selectedElevatorFloor === elevatorTarget.final;
                            handleAnswerResult(isCorrect, 20, () => {
                              setElevatorTarget(generateElevatorQuestion());
                              setSelectedElevatorFloor(0);
                            });
                          }}
                          className="w-full bg-amber-650 hover:bg-amber-700 text-white font-black text-xs py-3.5 rounded-xl shadow-md transition"
                        >
                          🚀 تحقق من صحة منسوب الرافعة الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 3: Pythagoras Sail Boat */}
              {activeGame === 'pythagoras_sail' && (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="bg-indigo-50 dark:bg-indigo-950/40 p-5 rounded-2xl border border-indigo-250 dark:border-indigo-800/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-indigo-500">⛵</span>
                      <h4 className="font-extrabold text-indigo-900 dark:text-indigo-300 text-sm">مهمة تفصيل أشرعة قوارب النيل:</h4>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      أمامك شراع لقارب ترفيهي في النيل الأزرق على المخطط الهندسي. معطى طول الضلع الأفقي (القاعدة) والعمودي (الارتفاع).
                      احسب طول الوتر الفولاذي المائل المقابل بدقة حسب قاعدة فيثاغورث: <span className="font-black">مربع الوتر = مجموع مربعي الضلعين الآخرين</span>.
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#13130e] border border-slate-200 dark:border-[#2e2e24] p-6 rounded-2xl text-right space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Left: Sail Visualization drawing */}
                      <div className="bg-white dark:bg-[#1c1c16] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative min-h-[220px]">
                        <span className="text-[11px] text-slate-500 dark:text-slate-450 absolute top-3 font-bold">رسم تخطيطي لشراع القارب بالشماسي</span>
                        
                        {/* Simple right-angled triangle SVG */}
                        <svg width="180" height="150" viewBox="0 0 120 100" className="text-indigo-600 dark:text-indigo-405 mt-2">
                          <polygon points="20,10 20,80 90,80" fill="rgba(79, 70, 229, 0.1)" stroke="currentColor" strokeWidth="2.5" />
                          <rect x="20" y="73" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1" />
                          
                          {/* Height text (left) */}
                          <text x="8" y="50" fontSize="8" fontWeight="bold" fill="currentColor">
                            {printNum(pythagorasData.height)} متر
                          </text>
                          {/* Base text (bottom) */}
                          <text x="45" y="93" fontSize="8" fontWeight="bold" fill="currentColor">
                            {printNum(pythagorasData.base)} متر
                          </text>
                          {/* Hypotenuse text (diagonal) */}
                          <text x="60" y="40" fontSize="8" fontWeight="bold" className="fill-pink-600 dark:fill-pink-400 animate-pulse font-black">
                            س ؟ (الوتر)
                          </text>
                        </svg>
                      </div>

                      {/* Right: Choices buttons grid */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold block">مطلوب حساب طول السلك المائل (س):</span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            مربع الوتر = {printNum(pythagorasData.base)}² + {printNum(pythagorasData.height)}² = {printNum(pythagorasData.base * pythagorasData.base)} + {printNum(pythagorasData.height * pythagorasData.height)} = {printNum(pythagorasData.base * pythagorasData.base + pythagorasData.height * pythagorasData.height)}.
                          </p>
                          <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-300 block mt-1">ابحث عن جذر هذا المجموع لإيجاد طول س!</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {pythagorasData.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                const isCorrect = opt === pythagorasData.hypotenuse;
                                handleAnswerResult(isCorrect, 25, () => {
                                  setPythagorasData(generatePythagorasQuestion());
                                });
                              }}
                              className="bg-white hover:bg-slate-50 dark:bg-[#1c1c16] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 p-3 rounded-xl text-center text-xs font-black transition active:scale-95 shadow-sm"
                            >
                              س = {printNum(opt)} متر 📏
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 4: Percentage Market (NEW!) */}
              {activeGame === 'percentage_market' && (
                <div className="space-y-6">
                  {/* High contrast alert banner */}
                  <div className="bg-red-50 dark:bg-red-950/40 p-5 rounded-2xl border border-red-250 dark:border-red-800/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-red-500">🛍️</span>
                      <h4 className="font-extrabold text-red-900 dark:text-red-300 text-sm">بائع سوق أم درمان المئوي الذكي:</h4>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      أنت بائع تمور ومحاصيل في سوق أم درمان التاريخي الشهير. ساعد الزبون في احتساب قيمة الخصم الممنوح لكي تتم المعاملة التجارية بنجاح!
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#13130e] border border-slate-200 dark:border-[#2e2e24] p-6 rounded-2xl text-right space-y-6">
                    <div className="space-y-4">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">عرض الصفقة وتفاصيل الخصم:</span>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100 leading-relaxed pr-3 border-r-4 border-red-500">
                        {marketQuestion.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                      {/* Left: Decorative Bag SVG illustration */}
                      <div className="bg-white dark:bg-[#1c1c16] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative min-h-[160px]">
                        <ShoppingBag className="w-16 h-16 text-red-500 dark:text-red-400 animate-bounce mb-2" />
                        <div className="text-center">
                          <span className="text-[10px] font-bold bg-red-105 dark:bg-red-950 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-lg">
                            {marketQuestion.product}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1.5 font-bold">
                            النسبة: {printNum(marketQuestion.percentage)}٪ خصم
                          </span>
                        </div>
                      </div>

                      {/* Right: Choices list */}
                      <div className="space-y-3">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold block">اختر قيمة الخصم الفعلي بالجنيه:</span>
                        <div className="grid grid-cols-2 gap-3">
                          {marketQuestion.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                const isCorrect = opt === marketQuestion.answer;
                                handleAnswerResult(isCorrect, 20, () => {
                                  setMarketQuestion(generateMarketQuestion());
                                });
                              }}
                              className="bg-white hover:bg-slate-50 dark:bg-[#1c1c16] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-red-400 p-3 rounded-xl text-center text-xs font-black transition active:scale-95 shadow-sm"
                            >
                              {printNum(opt)} جنيه سوداني
                            </button>
                          ))}
                        </div>

                        <div className="p-3 bg-red-50/10 border border-dashed border-red-200 rounded-lg text-[11px] text-red-900 dark:text-red-300 leading-relaxed font-bold">
                          💡 تلميح: اضرب السعر في النسبة واقسم الناتج على ١٠٠ لإنهاء الحسبة بسرعة البرق!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* GAME 5: Algebra Scale (NEW!) */}
              {activeGame === 'algebra_scale' && (
                <div className="space-y-6">
                  {/* High contrast alert banner */}
                  <div className="bg-cyan-50 dark:bg-cyan-950/40 p-5 rounded-2xl border border-cyan-250 dark:border-cyan-800/60 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-cyan-500">⚖️</span>
                      <h4 className="font-extrabold text-cyan-900 dark:text-cyan-300 text-sm">ميزان ذهب شندي الذكي والمجاهيل:</h4>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      في ميزان الصائغ العريق، يجب أن تجعل الكفة اليمنى تعادل الكفة اليسرى تماماً. أوجد قيمة المجهول [ س ] التي تحقق الاتزان والعدل!
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#13130e] border border-slate-200 dark:border-[#2e2e24] p-6 rounded-2xl text-right space-y-6">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">معادلة الميزان والاتزان:</span>
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                        لدينا كفة مجهولة بها المقدار الجبري [ <span className="text-indigo-600 dark:text-indigo-400 text-sm">{scaleQuestion.lhsText}</span> ] وكفة معلومة فيها قطعة ذهب تزن بالضبط [ <span className="text-cyan-700 dark:text-cyan-300 text-sm">{printNum(scaleQuestion.rhsValue)} غرام</span> ].
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Left: Beautiful SVG Balance Scale */}
                      <div className="bg-white dark:bg-[#1c1c16] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative min-h-[220px]">
                        <span className="text-[10px] text-slate-400 dark:text-slate-450 absolute top-3 font-bold">نموذج الميزان ذي الكفتين</span>
                        
                        {/* Interactive Scale Drawing */}
                        <svg width="220" height="150" viewBox="0 0 160 120" className="text-slate-500 mt-2">
                          {/* Main Stand */}
                          <line x1="80" y1="20" x2="80" y2="105" stroke="#475569" strokeWidth="4" />
                          <path d="M 60 105 L 100 105" stroke="#475569" strokeWidth="6" />
                          
                          {/* Horizontal balancing bar (tilted slightly depending on selection status!) */}
                          {(() => {
                            const currentVal = activeScaleHoverValue;
                            let angle = 0; // balanced
                            if (currentVal !== null) {
                              if (currentVal < scaleQuestion.correctX) angle = -12; // left is lighter
                              if (currentVal > scaleQuestion.correctX) angle = 12; // left is heavier
                            }
                            const rad = (angle * Math.PI) / 180;
                            const dx = 50 * Math.cos(rad);
                            const dy = 50 * Math.sin(rad);

                            const leftX = 80 - dx;
                            const leftY = 40 - dy;
                            const rightX = 80 + dx;
                            const rightY = 40 + dy;

                            return (
                              <>
                                {/* Central pivot node */}
                                <circle cx="80" cy="40" r="5" fill="#eab308" />
                                <line x1={leftX} y1={leftY} x2={rightX} y2={rightY} stroke="#eab308" strokeWidth="3.5" />

                                {/* Left pan cords */}
                                <line x1={leftX} y1={leftY} x2={leftX - 15} y2={leftY + 35} stroke="#64748b" strokeWidth="1" />
                                <line x1={leftX} y1={leftY} x2={leftX + 15} y2={leftY + 35} stroke="#64748b" strokeWidth="1" />
                                <path d={`M ${leftX - 18} ${leftY + 35} Q ${leftX} ${leftY + 41} ${leftX + 18} ${leftY + 35}`} stroke="#64748b" strokeWidth="2" fill="none" />
                                {/* Left tray label */}
                                <text x={leftX - 14} y={leftY + 28} fontSize="7.5" fontWeight="bold" fill="#4f46e5" className="dark:fill-indigo-300">
                                  {scaleQuestion.lhsText}
                                </text>

                                {/* Right pan cords */}
                                <line x1={rightX} y1={rightY} x2={rightX - 15} y2={rightY + 35} stroke="#64748b" strokeWidth="1" />
                                <line x1={rightX} y1={rightY} x2={rightX + 15} y2={rightY + 35} stroke="#64748b" strokeWidth="1" />
                                <path d={`M ${rightX - 18} ${rightY + 35} Q ${rightX} ${rightY + 41} ${rightX + 18} ${rightY + 35}`} stroke="#64748b" strokeWidth="2" fill="none" />
                                {/* Right tray label */}
                                <text x={rightX - 10} y={rightY + 28} fontSize="7.5" fontWeight="bold" fill="#0891b2" className="dark:fill-cyan-300">
                                  {printNum(scaleQuestion.rhsValue)} غرام
                                </text>
                              </>
                            );
                          })()}
                        </svg>

                        <div className="text-[10px] text-slate-400 dark:text-slate-401 text-center font-bold mt-2">
                          💡 حرك الفأرة أو انظر للقيم بالأسفل لرؤية اتزان الميزان!
                        </div>
                      </div>

                      {/* Right: Choices buttons grid */}
                      <div className="space-y-4">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-extrabold block">اختر قيمة س لإعادة الكفتين للميزان المتناظر:</span>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {scaleQuestion.options.map((opt) => (
                            <button
                              key={opt}
                              onMouseEnter={() => setActiveScaleHoverValue(opt)}
                              onMouseLeave={() => setActiveScaleHoverValue(null)}
                              onClick={() => {
                                const isCorrect = opt === scaleQuestion.correctX;
                                handleAnswerResult(isCorrect, 20, () => {
                                  setScaleQuestion(generateScaleQuestion());
                                  setActiveScaleHoverValue(null);
                                });
                              }}
                              className="bg-white hover:bg-slate-50 dark:bg-[#1c1c16] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:border-cyan-450 p-3 rounded-xl text-center text-xs font-black transition active:scale-95 shadow-sm"
                            >
                              س = {printNum(opt)} غرامات
                            </button>
                          ))}
                        </div>

                        <div className="p-3 bg-cyan-50/10 border border-dashed border-cyan-200 rounded-lg text-[11px] text-cyan-950 dark:text-cyan-200 leading-relaxed font-bold">
                          🧠 الجبر ممتع! فكر في العدد الذي إذا أجريت عليه العملية، سيعطيك بالضبط الكفة المقابلة.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : gameOver ? (
            // GAVE OVER SCREEN VIEW
            <div className="text-center py-8 space-y-5">
              <div className="text-5xl">💔</div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">حظ أوفر يا بطل! لقد نفدت محاولاتك هذه المرة</h4>
                <p className="text-xs text-slate-450 dark:text-slate-350">
                  لا تقلق، الأخطاء هي التي تجعلنا نتعلم! راجع الدرس النظري مجدداً ثم عد لتحدي النوابغ.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => resetGameSession(activeGame)}
                  className="bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold text-xs py-3 px-8 rounded-2xl shadow-sm transition"
                >
                  🔄 المحاولة مجدداً الآن
                </button>
              </div>
            </div>
          ) : (
            // GAME WON CHIEF SCREEN
            <div className="text-center py-8 space-y-6">
              <div className="text-5xl animate-bounce">🎉</div>
              <div className="text-indigo-600 dark:text-indigo-400 flex justify-center">
                <Trophy className="w-16 h-16" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full font-bold">بطل الأرقام السوداني</span>
                <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg">ألف مبروك التميز والتفوق يا {studentName}!</h4>
                <p className="text-xs text-slate-500 dark:text-slate-350 max-w-md mx-auto leading-relaxed">
                  لقد حققت ٥ إجابات صحيحة متتالية بنجاح وحصلت على مكافأة النوابغ وحماية حواشتك الذهبية! تم إيداع نقاط المكافأة الإضافية في حسابك الموثق.
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => resetGameSession(activeGame)}
                  className="bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-sm transition"
                >
                  🚀 لعب دورة جديدة
                </button>
                <button
                  onClick={() => setActiveGame(null)}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-705 dark:text-slate-300 font-extrabold text-xs py-3.5 px-6 rounded-2xl hover:bg-slate-200 transition"
                >
                  ← تصفح الألعاب الأخرى
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
