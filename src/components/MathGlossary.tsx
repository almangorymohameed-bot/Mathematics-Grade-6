import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Volume2, VolumeX, BookOpen, Sparkles, HelpCircle, RefreshCw, Layers, CheckCircle2, ChevronDown, Award } from 'lucide-react';
import { toEasternArabicNumerals } from '../curriculumData';

interface GlossaryTerm {
  id: string;
  term: string;
  englishTerm: string;
  definition: string;
  unitId: string;
  unitName: string;
  category: 'sets' | 'numbers' | 'fractions' | 'algebra' | 'geometry' | 'statistics';
  keywords: string[];
  interactiveType: 'empty-set' | 'number-line' | 'square-number' | 'percentage' | 'algebra-box' | 'angle-draw' | 'stats-mean' | 'venn-subset';
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'term_set',
    term: 'المجموعة',
    englishTerm: 'Set',
    definition: 'هي تجمع من الأشياء الحسية أو الذهنية المعرفة تعريفاً تاماً ومحدداً، تسمى هذه الأشياء عناصر المجموعة ويشترك كل منها في صفة مشتركة واحدة على الأقل.',
    unitId: 'unit_1',
    unitName: 'الوحدة الأولى: المجموعات',
    category: 'sets',
    keywords: ['عناصر', 'تجمع', 'تعريف تام', 'فئة'],
    interactiveType: 'venn-subset'
  },
  {
    id: 'term_empty_set',
    term: 'المجموعة الخالية',
    englishTerm: 'Empty Set',
    definition: 'هي المجموعة التي لا تحتوي على أي عنصر على الإطلاق، ونرمز لها رياضياً بالرمز الإغريقي الفاي (∅) أو بقوسين فارغين {}. وهي جزئية من أي مجموعة أخرى.',
    unitId: 'unit_1',
    unitName: 'الوحدة الأولى: المجموعات',
    category: 'sets',
    keywords: ['خالية', 'فاي', 'قوسين فارغين', 'صفر عناصر', 'empty', 'phi'],
    interactiveType: 'empty-set'
  },
  {
    id: 'term_universal_set',
    term: 'المجموعة الشاملة',
    englishTerm: 'Universal Set',
    definition: 'هي المجموعة الكبرى التي تضم في ثناياها جميع العناصر والمجموعات الفرعية قيد البحث والمناقشة في مسألة معينة، ونرمز لها اختصاراً بالرمز الحرفي (ش).',
    unitId: 'unit_1',
    unitName: 'الوحدة الأولى: المجموعات',
    category: 'sets',
    keywords: ['الشاملة', 'ش', 'الأم', 'الكلية', 'universe'],
    interactiveType: 'venn-subset'
  },
  {
    id: 'term_positive_int',
    term: 'العدد الصحيح الموجب',
    englishTerm: 'Positive Integer',
    definition: 'هو أي عدد طبيعي أكبر من الصفر ويرمز له بإشارة الزائد (+) أو يكتب بدونها، يُمثل بموقع يقع على يمين الصفر في خط الأعداد الصحيحة، ويمثل الزيادة أو الأرباح.',
    unitId: 'unit_2',
    unitName: 'الوحدة الثانية: الأعداد الصحيحة',
    category: 'numbers',
    keywords: ['موجب', 'صحيح', 'يمين الصفر', 'زيادة', 'ربح', 'positive'],
    interactiveType: 'number-line'
  },
  {
    id: 'term_negative_int',
    term: 'العدد الصحيح السالب',
    englishTerm: 'Negative Integer',
    definition: 'هو عدد صحيح يقع على يسار الصفر على خط الأعداد المعتمد وتقل قيمته عن الصفر دائماً، يحمل دوماً إشارة الناقص (-) ليدل على خسائر، أو درجات حرارة تحت الصفر، أو أعماق تحت سطح البحر.',
    unitId: 'unit_2',
    unitName: 'الوحدة الثانية: الأعداد الصحيحة',
    category: 'numbers',
    keywords: ['سالب', 'تحت الصفر', 'يسار الصفر', 'خسارة', 'عمق', 'negative'],
    interactiveType: 'number-line'
  },
  {
    id: 'term_absolute_value',
    term: 'القيمة المطلقة',
    englishTerm: 'Absolute Value',
    definition: 'هي المسافة الهندسية الفاصلة بين موقع العدد الصحيح ونقطة الصفر على خط الأعداد الصحيحة، وتكون دائماً كمية موجبة أو صفراً لأن المسافة لا يمكن أن تكون سالبة على الإطلاق.',
    unitId: 'unit_2',
    unitName: 'الوحدة الثانية: الأعداد الصحيحة',
    category: 'numbers',
    keywords: ['القيمة المطلقة', 'مسافة', 'مطلق', 'موجبة دائما', 'absolute'],
    interactiveType: 'number-line'
  },
  {
    id: 'term_percentage',
    term: 'النسبة المئوية',
    englishTerm: 'Percentage',
    definition: 'هي طريقة رياضية ممتازة لتمثيل ومقارنة الكسور بحيث يكون المقام فيها مساوياً للعدد المائة (١٠٠) بشكل ثابت، ونرمز لها بالرمز الميداني المعتمد (%).',
    unitId: 'unit_3',
    unitName: 'الوحدة الثالثة: الكسور والنسبة المئوية',
    category: 'fractions',
    keywords: ['نسبة', 'مئوية', 'بالمئة', 'مئة', 'percent', 'shopping'],
    interactiveType: 'percentage'
  },
  {
    id: 'term_variable',
    term: 'المتغير',
    englishTerm: 'Variable',
    definition: 'هو كمية مجهولة أو قيمة متغيرة نعبر عنها برمز حرفي هجائي مثل (س، ص، ع) لتمكيننا من صياغة المعادلات وحل المشاكل الحياتية الهندسية بشكل جبري مرن.',
    unitId: 'unit_4',
    unitName: 'الوحدة الرابعة: الجبر والمعادلات',
    category: 'algebra',
    keywords: ['متغير', 'س', 'ص', 'مجهول', 'جبر', 'حرف'],
    interactiveType: 'algebra-box'
  },
  {
    id: 'term_expression',
    term: 'المقدار الجبري',
    englishTerm: 'Algebraic Expression',
    definition: 'عبارة رياضية تتكون من رموز (متغيرات) وأرقام (ثوابت) تفصل بينها عمليات حسابية أساسية مثل الجمع أو الطرح أو الضرب (مثال: ٢س + ٥٠).',
    unitId: 'unit_4',
    unitName: 'الوحدة الرابعة: الجبر والمعادلات',
    category: 'algebra',
    keywords: ['مقدار', 'حدود', 'ثوابت', 'رموز', 'تركيب جبري'],
    interactiveType: 'algebra-box'
  },
  {
    id: 'term_equation',
    term: 'المعادلة الرياضية',
    englishTerm: 'Mathematical Equation',
    definition: 'هي علاقة تعادل رياضي تتضمن كفتين تفصل بينهما علامة التساوي (=)، وتحوي في كفة منها على الأقل كمية مجهولة؛ والهدف هو البحث عن قيمة المجهول التي تحقق صدق المعادلة.',
    unitId: 'unit_4',
    unitName: 'الوحدة الرابعة: الجبر والمعادلات',
    category: 'algebra',
    keywords: ['معادلة', 'تساوي', 'كفة', 'ميزان', 'حل المعادلة'],
    interactiveType: 'algebra-box'
  },
  {
    id: 'term_pythagoras',
    term: 'نظرية فيثاغورث',
    englishTerm: 'Pythagorean Theorem',
    definition: 'قاعدة هندسية ذهبية تنص على أنه في أي مثلث قائم الزاوية، يكون مجموع مساحتي المربعين المنشأين على ضلعي القائمة مساوياً لمساحة المربع المنشأ على الوتر المائل (مربع الوتر = مجموع مربعي الضلعين الآخرين).',
    unitId: 'unit_5',
    unitName: 'الوحدة الخامسة: الهندسة والقياس',
    category: 'geometry',
    keywords: ['فيثاغورث', 'قائم الزاوية', 'وتر', 'مثلث قائم', 'ضلع', 'شراع'],
    interactiveType: 'angle-draw'
  },
  {
    id: 'term_square_num',
    term: 'مربع العدد',
    englishTerm: 'Square of a Number',
    definition: 'حاصل ضرب العدد الصحيح في نفسه مرة واحدة (العدد × نفسه)، ونكتبه مرفوعاً للقوة الثانية (أس ٢) مثل: ٣² = ٣ × ٣ = ٩. يعبر بيانياً بمساحة مربع هندسي طول ضلعه يساوي هذا العدد.',
    unitId: 'unit_5',
    unitName: 'الوحدة الخامسة: الهندسة والقياس',
    category: 'geometry',
    keywords: ['مربع', 'أس ٢', 'ضرب العدد في نفسه', 'قوة الثانية', 'square'],
    interactiveType: 'square-number'
  },
  {
    id: 'term_mean',
    term: 'المتوسط الحسابي',
    englishTerm: 'Arithmetic Mean',
    definition: 'هي القيمة الأكثر استخداماً عالمياً لتمثيل وتلخيص البيانات الإحصائية، وتحسب عن طريق إيجاد حاصل جمع كل القيم المعطاة مقسوماً بالكامل على عددها الفعلي.',
    unitId: 'unit_6',
    unitName: 'الوحدة السادسة: الإحصاء والاحتمالات',
    category: 'statistics',
    keywords: ['المتوسط', 'المعدل', 'مجموع القيم', 'تلخيص', 'mean'],
    interactiveType: 'stats-mean'
  },
  {
    id: 'term_mode',
    term: 'المنوال',
    englishTerm: 'Mode',
    definition: 'هو المقدار الإحصائي السهل الذي يعبر عن القيمة الأكثر تكراراً أو شيوعاً بين مجموعة البيانات الإحصائية المرصودة في دراسة ميدانية معينة.',
    unitId: 'unit_6',
    unitName: 'الوحدة السادسة: الإحصاء والاحتمالات',
    category: 'statistics',
    keywords: ['منوال', 'تكرار', 'درجات شائعة', 'الأكثر شيوعا', 'mode'],
    interactiveType: 'stats-mean'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'الكل ✨', color: 'indigo' },
  { id: 'sets', name: 'المجموعات 🌐', color: 'emerald' },
  { id: 'numbers', name: 'الأعداد الصحيحة 🔢', color: 'amber' },
  { id: 'fractions', name: 'الكسور والنسبة 🛍️', color: 'red' },
  { id: 'algebra', name: 'الجبر والمعادلات ⚖️', color: 'cyan' },
  { id: 'geometry', name: 'الهندسة والقياس 📐', color: 'indigo' },
  { id: 'statistics', name: 'الإحصاء والاحتمالات 📊', color: 'violet' }
];

export const MathGlossary: React.FC<{ isArabicNumeral: boolean }> = ({ isArabicNumeral }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [activeInteractiveStates, setActiveInteractiveStates] = useState<Record<string, any>>({});
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.speechSynthesis) {
      setSpeechSynthesisSupported(false);
    }
  }, []);

  // Stop TTS speaking on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const printNum = (num: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(num) : num.toString();
  };

  // Speaks definition using standard HTML5 speech synthesis
  const handleSpeak = (id: string, textToSpeak: string) => {
    if (!speechSynthesisSupported) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel(); // limit concurrency

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.9; // clear educational spacing
    utterance.pitch = 1.05;

    // Handle end and error to restore state
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  };

  // Filter conditions
  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      item.term.includes(searchTerm) || 
      item.englishTerm.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.definition.includes(searchTerm) ||
      item.keywords.some(kw => kw.includes(searchTerm));
    
    return matchesCategory && matchesSearch;
  });

  // State handles for components
  const updateInteractiveState = (termId: string, stateUpdate: any) => {
    setActiveInteractiveStates(prev => ({
      ...prev,
      [termId]: {
        ...(prev[termId] || {}),
        ...stateUpdate
      }
    }));
  };

  // Render individual live sandbox based on term behavior
  const renderInteractiveSandbox = (term: GlossaryTerm) => {
    const state = activeInteractiveStates[term.id] || {};

    switch (term.interactiveType) {
      case 'empty-set': {
        const elements: string[] = state.elements ?? ['🍋', '🌴', '📖', '⚽'];
        const isEmpty = elements.length === 0;
        return (
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200/50 mt-4 space-y-3">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">معمل المجموعات التفاعلي 🧪</span>
            <div className="flex flex-col items-center justify-center p-3 py-4 bg-white dark:bg-slate-900 border border-emerald-100 rounded-lg">
              <span className="text-xs text-slate-500 font-bold mb-2">المجموعة أ = {`{ ${isEmpty ? '' : elements.join(' ، ')} }`}</span>
              
              <div className="w-40 h-24 border-2 border-emerald-400 border-dashed rounded-full flex items-center justify-center relative p-3 gap-2 overflow-hidden bg-emerald-50/20 shadow-inner">
                {isEmpty ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-extrabold text-emerald-500"
                  >
                    ∅
                  </motion.span>
                ) : (
                  elements.map((el, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ y: -20, opacity: 0 }} 
                      animate={{ y: 0, opacity: 1 }}
                      className="text-2xl"
                    >
                      {el}
                    </motion.span>
                  ))
                )}
                <span className="absolute bottom-1 right-3 text-[10px] text-emerald-600 font-black">شكل فِن</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateInteractiveState(term.id, { elements: [] })}
                  className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 text-red-700 text-[10px] font-black py-1.5 px-3 rounded-lg border border-red-200 transition active:scale-95"
                >
                  🧹 تفريغ المجموعة (أصبح خالية ∅)
                </button>
                <button
                  onClick={() => updateInteractiveState(term.id, { elements: ['🍋', '🌴', '📖', '⚽'] })}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black py-1.5 px-3 rounded-lg transition active:scale-95 shadow-sm"
                >
                  🔄 ملء العناصر
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'number-line': {
        const activeValue: number = state.value ?? 3;
        const absValue = Math.abs(activeValue);
        return (
          <div className="bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200/50 mt-4 space-y-3">
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">محاكي خط الأعداد والقيمة المطلقة 🔢</span>
            
            <div className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/40 p-3 rounded-lg flex flex-col items-center">
              {/* Distance label */}
              <div className="text-center space-y-1 mb-3">
                <span className="text-[10px] block text-slate-400 font-bold">القيمة الحالية المحددة:</span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                  العدد الصحيح: {activeValue > 0 ? `+${printNum(activeValue)}` : activeValue === 0 ? '٠' : printNum(activeValue)} 
                  {' | '}
                  المطلق: |{printNum(activeValue)}| = <span className="text-emerald-600 font-black">{printNum(absValue)}</span> غامرة مسافة خطية غامض!
                </p>
              </div>

              {/* Graphical Line SVG */}
              <div className="w-full overflow-x-auto py-4">
                <div className="min-w-[280px] flex flex-col items-center">
                  <svg width="280" height="50" className="text-slate-400">
                    {/* Line path */}
                    <line x1="10" y1="25" x2="270" y2="25" stroke="currentColor" strokeWidth="2" strokeDasharray="none" />
                    {/* Arrow left */}
                    <polyline points="15,20 10,25 15,30" fill="none" stroke="currentColor" strokeWidth="2" />
                    {/* Arrow right */}
                    <polyline points="265,20 270,25 265,30" fill="none" stroke="currentColor" strokeWidth="2" />

                    {/* Ticks -5 to 5 */}
                    {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((val) => {
                      const xPos = 140 + val * 24;
                      const isZero = val === 0;
                      const isSelected = val === activeValue;
                      return (
                        <g key={val}>
                          <line x1={xPos} y1="20" x2={xPos} y2="30" stroke={isZero ? '#ef4444' : 'currentColor'} strokeWidth={isZero ? '2' : '1'} />
                          <text x={xPos} y="44" textAnchor="middle" fontSize="9" className={`font-mono font-black ${isSelected ? 'fill-indigo-600 font-bold' : isZero ? 'fill-red-500' : 'fill-slate-400 dark:fill-slate-500'}`}>
                            {val > 0 ? `+${val}` : val}
                          </text>
                          {isSelected && (
                            <circle cx={xPos} cy="25" r="5" className="fill-indigo-600 shadow-sm animate-ping" />
                          )}
                          {isSelected && (
                            <circle cx={xPos} cy="25" r="4.5" className="fill-indigo-600" />
                          )}
                        </g>
                      );
                    })}

                    {/* Absolute value bracket visualization (distance highlights) */}
                    {activeValue !== 0 && (
                      <path
                        d={`M 140 18 Q ${140 + (activeValue * 24) / 2} 4 ${140 + activeValue * 24} 18`}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="w-full max-w-xs px-4 mt-2">
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={activeValue}
                  onChange={(e) => updateInteractiveState(term.id, { value: parseInt(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>سالب (-)</span>
                  <span>الصفر المحايد</span>
                  <span>موجب (+)</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'square-number': {
        const side: number = state.value ?? 4;
        const total = side * side;
        return (
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-250 mt-4 space-y-3">
            <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-bold">حسابات ومجال مربع العدد 📐</span>
            
            <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 p-3 rounded-lg flex flex-col items-center">
              <div className="text-center mb-3">
                <span className="text-[11px] block text-slate-400 font-bold">الضلع = {printNum(side)} طوابع</span>
                <p className="text-xs font-black text-indigo-700 dark:text-indigo-400">
                  المربع: {printNum(side)}² = {printNum(side)} × {printNum(side)} = <span className="text-emerald-600 font-black">{printNum(total)}</span> وحدة مربعة
                </p>
              </div>

              {/* Visual squares grid */}
              <div className="p-2 border border-dashed border-indigo-200 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 mb-3">
                <div 
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${side}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: total }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.1 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: (i % side) * 0.02 + Math.floor(i / side) * 0.02 }}
                      className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-800 rounded shadow-sm text-[8px] flex items-center justify-center text-white font-mono"
                    >
                      {printNum(i + 1)}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Controller */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => updateInteractiveState(term.id, { value: num })}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${side === num ? 'bg-indigo-650 text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    {printNum(num)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'percentage': {
        const percent: number = state.value ?? 25;
        return (
          <div className="bg-red-50/50 dark:bg-red-950/20 p-4 rounded-xl border border-red-200/50 mt-4 space-y-3">
            <span className="text-[10px] bg-red-101 text-red-800 px-2 py-0.5 rounded-md font-bold">التمثيل البصري للنسبة المئوية 📊</span>
            
            <div className="bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/40 p-3 rounded-lg flex flex-col items-center">
              <div className="text-center mb-3">
                <span className="text-[10px] block text-slate-400 font-bold">القيمة المختارة:</span>
                <p className="text-xs font-black text-rose-700 dark:text-rose-400">
                  {printNum(percent)}% = {printNum(percent)} / ١٠٠ = الكسر {printNum(percent/100)}
                </p>
              </div>

              {/* Bar progress visual */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded-full overflow-hidden relative border border-slate-200 dark:border-slate-700 mb-3 shadow-inner">
                <motion.div 
                  className="bg-red-500 h-full bg-gradient-to-r from-red-500 to-rose-600"
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.3 }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-white mix-blend-difference">
                  {printNum(percent)}% من الإجمالي الكلي
                </span>
              </div>

              {/* Grid 10x10 representation */}
              <div className="grid grid-cols-10 gap-0.5 border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-950/40 rounded-lg">
                {Array.from({ length: 100 }).map((_, i) => {
                  const isActive = i < percent;
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-xs transition-colors duration-200 ${isActive ? 'bg-red-500 shadow-xs' : 'bg-slate-200 dark:bg-slate-800'}`}
                    />
                  );
                })}
              </div>

              {/* Slider */}
              <div className="w-full max-w-xs mt-3 px-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={percent}
                  onChange={(e) => updateInteractiveState(term.id, { value: parseInt(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>٠%</span>
                  <span>٥٠% (النصف)</span>
                  <span>١٠٠% (الكل)</span>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'algebra-box': {
        const valueX: number = state.value ?? 8;
        const addValue = 4;
        const total = valueX * 2 + addValue;
        return (
          <div className="bg-cyan-50/50 dark:bg-cyan-950/20 p-4 rounded-xl border border-cyan-200/50 mt-4 space-y-3">
            <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-md font-bold">ميزان الحل الجبري للقيم المجهولة ⚖️</span>
            
            <div className="bg-white dark:bg-slate-900 border border-cyan-100 dark:border-cyan-900/40 p-3 rounded-lg flex flex-col items-center">
              <div className="text-center mb-3">
                <span className="text-[10px] block text-slate-400 font-bold">نموذج المعادلة: ٢س + ٤ = {printNum(total)}</span>
                <p className="text-xs font-black text-cyan-700 dark:text-cyan-400">
                  إذا كانت س = <span className="text-indigo-600 font-black">{printNum(valueX)}</span> فإن الكفتين متوازنتين تماماً بالعدل!
                </p>
              </div>

              {/* Scale balance drawing */}
              <div className="flex items-center justify-between w-full max-w-xs px-4 h-16 relative">
                {/* Left side: variable blocks */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400 font-bold">الكفة اليمين (٢س + ٤)</span>
                  <div className="flex items-center gap-1 bg-cyan-50 dark:bg-slate-800 p-1.5 rounded-lg border border-cyan-200">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">س ({printNum(valueX)})</span>
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">س ({printNum(valueX)})</span>
                    <span className="bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded">+{printNum(addValue)}</span>
                  </div>
                </div>

                {/* Pivot Balance Arm */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/6 h-0.5 bg-slate-400">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 border-l-4 border-r-4 border-b-8 border-transparent border-b-slate-600" />
                </div>

                {/* Right side: constant blocks */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400 font-bold">الكفة اليسار (= {printNum(total)})</span>
                  <div className="bg-emerald-50 dark:bg-slate-800 p-1.5 rounded-lg border border-emerald-250">
                    <span className="text-emerald-800 dark:text-emerald-400 text-xs font-mono font-black">{printNum(total)} غرام</span>
                  </div>
                </div>
              </div>

              {/* Selector to change X value */}
              <div className="w-full max-w-xs mt-4">
                <span className="text-[10px] block text-slate-400 font-bold text-center mb-1">اختر قيمة س لمشاهدة الميزان المتكافئ:</span>
                <div className="flex justify-center gap-1.5">
                  {[2, 5, 8, 10, 15].map((val) => (
                    <button
                      key={val}
                      onClick={() => updateInteractiveState(term.id, { value: val })}
                      className={`px-2.5 py-1 text-xs rounded-lg font-black transition ${valueX === val ? 'bg-cyan-600 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                    >
                      س={printNum(val)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'angle-draw': {
        const baseA: number = state.valA ?? 3;
        const baseB: number = state.valB ?? 4;
        const hypotenuse = Math.sqrt(baseA * baseA + baseB * baseB);
        return (
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-250 mt-4 space-y-3">
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">الرسم الهندسي لفيثاغورث 📐⛵</span>
            
            <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 p-3 rounded-lg flex flex-col items-center">
              <div className="text-center mb-2">
                <p className="text-xs font-black text-indigo-800 dark:text-indigo-400">
                  القاعدة = {printNum(baseA)}م | الارتفاع = {printNum(baseB)}م
                </p>
                <span className="text-[11px] block text-emerald-600 font-bold mt-1">
                  الوتر المائل (س) = √({printNum(baseA)}² + {printNum(baseB)}²) = √{printNum(baseA * baseA + baseB * baseB)} = <span className="font-extrabold">{printNum(hypotenuse)} متر</span>
                </span>
              </div>

              {/* Triangular geometric dynamic canvas */}
              <svg width="180" height="150" viewBox="0 0 120 100" className="text-indigo-600 dark:text-indigo-400 my-2">
                {/* Perpendicular Guidelines */}
                <line x1="20" y1="80" x2="100" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="20" y1="20" x2="20" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />

                {/* Right angle square indicator */}
                <rect x="20" y="72" width="8" height="8" fill="none" stroke="#6366f1" strokeWidth="1" />

                {/* Base side (A) */}
                <line x1="20" y1="80" x2="20 + baseA * 15" y2="80" stroke="#f59e0b" strokeWidth="3" />
                {/* Height side (B) */}
                <line x1="20" y1="80 - baseB * 12" x2="20" y2="80" stroke="#ef4444" strokeWidth="3" />
                {/* Hypotenuse (C) */}
                <line x1="20" y1="80 - baseB * 12" x2="20 + baseA * 15" y2="80" stroke="#10b981" strokeWidth="4" />

                {/* Text Labels */}
                <text x="20 + (baseA * 15) / 2" y="94" textAnchor="middle" fontSize="7" className="font-bold fill-amber-600">القاعدة {printNum(baseA)}م</text>
                <text x="8" y="80 - (baseB * 12) / 2" textAnchor="middle" fontSize="7" className="font-bold fill-red-500">الارتفاع {printNum(baseB)}م</text>
                <text x="20 + (baseA * 15) / 2 + 10" y="80 - (baseB * 12) / 2 - 5" textAnchor="middle" fontSize="8" className="font-black fill-emerald-600 animate-pulse">الوتر: {printNum(hypotenuse)}م 📏</text>
              </svg>

              {/* Set dimensions buttons */}
              <div className="flex gap-1">
                {[
                  { a: 3, b: 4, label: '٣ × ٤' },
                  { a: 6, b: 8, label: '٦ × ٨' },
                  { a: 5, b: 12, label: '٥ × ١٢' }
                ].map((tri, i) => (
                  <button
                    key={i}
                    onClick={() => updateInteractiveState(term.id, { valA: tri.a, valB: tri.b })}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition ${baseA === tri.a ? 'bg-indigo-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    أبعاد: {tri.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'stats-mean': {
        const values: number[] = state.values ?? [12, 8, 15, 5, 20];
        const sum = values.reduce((a, b) => a + b, 0);
        const mean = sum / values.length;
        
        // Mode calculator
        const occurrences: Record<number, number> = {};
        values.forEach(v => { occurrences[v] = (occurrences[v] || 0) + 1; });
        let maxCount = 0;
        let modeVals: number[] = [];
        Object.entries(occurrences).forEach(([v, count]) => {
          if (count > maxCount) {
            maxCount = count;
            modeVals = [parseInt(v)];
          } else if (count === maxCount && count > 1) {
            modeVals.push(parseInt(v));
          }
        });
        const hasMode = maxCount > 1;

        return (
          <div className="bg-violet-50/50 dark:bg-violet-950/20 p-4 rounded-xl border border-violet-200 mt-4 space-y-3">
            <span className="text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded-md font-bold">مختبر التحليل الإحصائي المباشر 📊</span>
            
            <div className="bg-white dark:bg-slate-900 border border-violet-100 p-3 rounded-lg">
              <div className="text-center space-y-2 mb-3">
                <p className="text-xs text-slate-500 font-bold">العينات والبيانات الإحصائية المعروضة:</p>
                <div className="flex justify-center gap-1">
                  {values.map((v, i) => (
                    <span key={i} className="bg-violet-50 text-violet-800 border border-violet-200 text-xs font-black px-2.5 py-1 rounded-md">
                      {printNum(v)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dynamic stats formulas display */}
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-[10px] space-y-1 md:text-xs">
                <div>
                  <span className="font-extrabold text-violet-800">🔣 قانون المجموع الكلي: </span>
                  <span className="font-mono text-slate-600 dark:text-slate-350">{values.join(' + ')} = <span className="font-extrabold text-slate-800 dark:text-white">{printNum(sum)}</span></span>
                </div>
                <div>
                  <span className="font-extrabold text-violet-800">🎯 المتوسط الحسابي: </span>
                  <span>المجموع ÷ العدد = {printNum(sum)} ÷ {printNum(values.length)} = <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded">{printNum(mean)}</span></span>
                </div>
                <div>
                  <span className="font-extrabold text-violet-800">📈 المنوال (الأكثر تكراراً): </span>
                  <span>{hasMode ? `القيمة الأكثر تكراراً هي: [ ${modeVals.map(mv => printNum(mv)).join(' ، ')} ]` : 'لا يوجد منوال متكرر في هذه القيم'}</span>
                </div>
              </div>

              {/* Generator inputs control */}
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={() => {
                    const randomSet = Array.from({ length: 5 }, () => Math.floor(Math.random() * 20) + 5);
                    updateInteractiveState(term.id, { values: randomSet });
                  }}
                  className="bg-violet-650 hover:bg-violet-750 text-white text-[10px] font-black py-1.5 px-3 rounded-lg transition active:scale-95 inline-flex items-center gap-1"
                >
                  🎲 توليد عينات إحصائية عشوائية جديدة
                </button>
              </div>
            </div>
          </div>
        );
      }

      case 'venn-subset': {
        const isSubsetSelected: boolean = state.isSubset ?? true;
        return (
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-250 mt-4 space-y-3">
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-bold">تمثيل المجموعات ش، أ، ب 🌐</span>
            
            <div className="bg-white dark:bg-slate-900 border border-indigo-100 p-3 rounded-lg flex flex-col items-center">
              <div className="text-center mb-3">
                <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                  {isSubsetSelected 
                    ? 'المجموعة (أ) محتواة بالكامل داخل المجموعة الشاملة (ش)' 
                    : 'المجموعة (أ) والمجموعة (ب) متقاطعتان داخل المجموعة الشاملة (ش)'
                  }
                </p>
              </div>

              {/* SVG Venn diagram illustration */}
              <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl mb-3">
                <svg width="220" height="120" className="text-indigo-600 dark:text-indigo-400">
                  {/* Universal Set boundary */}
                  <rect x="10" y="10" width="200" height="100" rx="10" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="20" y="24" fontSize="10" className="font-black fill-slate-500">المجموعة الشاملة (ش)</text>

                  {isSubsetSelected ? (
                    <g>
                      {/* Set A (Outer circles) */}
                      <circle cx="110" cy="60" r="36" fill="rgba(99, 102, 241, 0.08)" stroke="#6366f1" strokeWidth="2" />
                      <text x="110" y="44" fontSize="8" className="font-extrabold fill-indigo-600" textAnchor="middle">المجموعة الأم (ب)</text>
                      
                      {/* Subset B (Inner circles) */}
                      <circle cx="110" cy="65" r="18" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="2" />
                      <text x="110" y="68" fontSize="8" className="font-extrabold fill-emerald-600" textAnchor="middle">أ ⊂ ب</text>
                    </g>
                  ) : (
                    <g>
                      {/* Intersecting Set A */}
                      <circle cx="90" cy="60" r="30" fill="rgba(99, 102, 241, 0.08)" stroke="#6366f1" strokeWidth="2" />
                      <text x="75" y="64" fontSize="9" className="font-black fill-indigo-600">أ</text>
                      
                      {/* Intersecting Set B */}
                      <circle cx="130" cy="60" r="30" fill="rgba(16, 185, 129, 0.08)" stroke="#10b981" strokeWidth="2" />
                      <text x="140" y="64" fontSize="9" className="font-black fill-emerald-600">ب</text>

                      {/* Intersection highlight */}
                      <path d="M 110 38 A 30 30 0 0 0 110 82 A 30 30 0 0 0 110 38 Z" fill="rgba(245, 158, 11, 0.25)" />
                      <text x="110" y="63" fontSize="8" className="font-black fill-amber-700" textAnchor="middle">تقاطع</text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Toggles */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateInteractiveState(term.id, { isSubset: true })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${isSubsetSelected ? 'bg-indigo-650 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  🔄 عرض الاحتواء والجزئية (أ ⊂ ب)
                </button>
                <button
                  onClick={() => updateInteractiveState(term.id, { isSubset: false })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${!isSubsetSelected ? 'bg-indigo-650 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                >
                  🤝 عرض التقاطع (أ ∩ ب)
                </button>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 text-right" id="glossary_main_container">
      {/* Search Header visual card */}
      <div className="bg-gradient-to-tr from-indigo-900 via-indigo-850 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بوابة المعرفة والبرهان المعتمد للأذكياء</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            موسوعة المصطلحات الرياضية 📖✨
          </h2>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-semibold">
            استكشف المعاني اللغوية والهندسية للمصطلحات والمفاهيم المقررة بأسلوب مبسط مدعوم بالصوت والصورة، والتفاعل الحي مع الرسوم والمسائل الإيضاحية الخاضعة للمنهج!
          </p>
        </div>

        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shrink-0 shadow-lg animate-pulse">
          <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-indigo-300" />
        </div>
      </div>

      {/* Grid search and category selections filter */}
      <div className="bg-white dark:bg-[#13130e] border border-slate-100 dark:border-[#2e2e24] p-5 rounded-2xl space-y-4 shadow-sm">
        {/* Search bar input action */}
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن مصطلح، كلمة مفتاحية، أو مفهوم رياضي (مثال: فاي، فيثاغورث، موجب)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#181814] text-slate-800 dark:text-slate-100 pr-11 pl-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filter Scrollable Badges bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`py-2 px-4 rounded-xl text-xs font-black shrink-0 transition active:scale-95 cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-650 text-white shadow-md' 
                    : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-slate-750 dark:text-slate-300 border border-slate-100 dark:border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results terms display count and alert */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-bold">
        <span>نتائج الموسوعة المصفاة: {printNum(filteredTerms.length)} مصطلحاً معتمداً</span>
        {searchTerm && <span>تصفية بالبحث عن " <span className="text-indigo-600">{searchTerm}</span> "</span>}
      </div>

      {/* Main Glossary terms listing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term, tIdx) => {
              const isActiveSpeaker = speakingId === term.id;
              
              // Color formatting helper
              let badgeTheme = 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300 border-slate-200';
              if (term.category === 'sets') badgeTheme = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/25 dark:text-emerald-300 border-emerald-100';
              if (term.category === 'numbers') badgeTheme = 'bg-amber-50 text-amber-850 dark:bg-amber-950/25 dark:text-amber-305 border-amber-100';
              if (term.category === 'fractions') badgeTheme = 'bg-red-50 text-red-800 dark:bg-red-950/25 dark:text-red-305 border-red-100';
              if (term.category === 'algebra') badgeTheme = 'bg-cyan-50 text-cyan-850 dark:bg-cyan-950/25 dark:text-cyan-305 border-cyan-100';
              if (term.category === 'geometry') badgeTheme = 'bg-indigo-50 text-indigo-750 dark:bg-indigo-950/25 dark:text-indigo-305 border-indigo-100';
              if (term.category === 'statistics') badgeTheme = 'bg-violet-50 text-violet-800 dark:bg-violet-950/25 dark:text-violet-305 border-violet-100';

              return (
                <motion.div
                  key={term.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: tIdx * 0.02 }}
                  className="bg-white dark:bg-[#13130e] rounded-2xl border border-slate-100 dark:border-[#2e2e24] shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between"
                  id={`term_card_${term.id}`}
                >
                  {/* Top content area of term */}
                  <div className="p-5 space-y-3">
                    {/* Header: Badge category and sound read aloud */}
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border ${badgeTheme}`}>
                        {term.unitName}
                      </span>
                      
                      {speechSynthesisSupported && (
                        <button
                          onClick={() => handleSpeak(term.id, `المصطلح: ${term.term}. بالإنجليزية: ${term.englishTerm}. التعريف الرياضي البسيط هو: ${term.definition}`)}
                          className={`p-2 rounded-xl border flex items-center justify-center transition active:scale-95 cursor-pointer ${
                            isActiveSpeaker
                              ? 'bg-red-50 dark:bg-red-950 text-red-650 border-red-200 animate-pulse'
                              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
                          }`}
                          title={isActiveSpeaker ? "إيقاف الصوت المؤقت" : "استمع للتعريف الصوتي باللغة العربية"}
                        >
                          {isActiveSpeaker ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Middle: Name Term & Translation with voice */}
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{term.term}</span>
                        <span className="text-slate-400 font-bold font-mono text-xs">({term.englishTerm})</span>
                      </h3>
                      <p className="text-[11px] text-[#4a4a40] dark:text-slate-300 leading-relaxed font-semibold">
                        {term.definition}
                      </p>
                    </div>

                    {/* Key term tags */}
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      {term.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-[9px] text-slate-505 dark:text-slate-400 px-1.5 py-0.5 rounded-md font-bold">
                          #{kw}
                        </span>
                      ))}
                    </div>

                    {/* Dynamic live interactive sandbox tool */}
                    {renderInteractiveSandbox(term)}
                  </div>

                  {/* Visual bottom bar highlight indicating real curriculum compatibility */}
                  <div className="bg-slate-50 dark:bg-slate-950/50 py-2.5 px-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      متوافق مع المنهج السوداني المعتمد
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400">الصف السادس 📐</span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full bg-slate-50 dark:bg-slate-950/20 py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-400 mx-auto animate-bounce" />
              <p className="text-xs text-slate-500 font-extrabold">المصطلح أو المفهوم الذي تبحث عنه غير مدرج حالياً في الموسوعة!</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-[10px] py-1.5 px-4 rounded-xl transition shadow"
              >
                إبراز كافة المصطلحات المقررة 🔄
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio guide details floating card */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 p-4 rounded-2xl flex items-start gap-3">
        <span className="text-xl shrink-0 mt-0.5">💡</span>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-300">نصيحة نقلة للمناهج الإلكترونية للأذكياء:</h4>
          <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed font-bold">
            التكرار يعلم الشطار! استمع دائماً لنطق التعريف بالضغط على أيقونة المكبر 🗣️ لتعتاد على صياغة براهين وقطع لغوية رياضية ممتازة تساعدك في نيل الدرجات الكاملة في اختبارات شهادة المرحلة الابتدائية.
          </p>
        </div>
      </div>
    </div>
  );
};
