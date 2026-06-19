import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Compass,
  Layers,
  HelpCircle,
  Activity,
  Star,
  Type,
  Eye,
  EyeOff
} from 'lucide-react';
import { Lesson, StudentProgress } from '../types';
import { toEasternArabicNumerals } from '../curriculumData';
import { LessonWorksheets } from './LessonWorksheets';

interface LessonViewProps {
  lesson: Lesson;
  progress: StudentProgress;
  onLessonComplete: (lessonId: string) => void;
  onGoBack: () => void;
  isArabicNumeral: boolean;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  progress,
  onLessonComplete,
  onGoBack,
  isArabicNumeral,
}) => {
  const [activeTab, setActiveTab] = useState<'study' | 'interactive' | 'worksheets'>('study');
  const [completeSuccess, setCompleteSuccess] = useState(false);

  // Sizing and focus reading states
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'xlarge'>('normal');
  const [isReadingMode, setIsReadingMode] = useState<boolean>(false);

  const getExplanationFontClass = () => {
    switch (fontSize) {
      case 'small': return 'text-[11px] md:text-xs leading-relaxed';
      case 'normal': return 'text-xs md:text-sm leading-relaxed';
      case 'large': return 'text-sm md:text-base leading-relaxed';
      case 'xlarge': return 'text-base md:text-lg leading-relaxed';
    }
  };

  const getExampleHeaderFontClass = () => {
    switch (fontSize) {
      case 'small': return 'text-[11px] md:text-xs font-bold leading-relaxed';
      case 'normal': return 'text-xs md:text-sm font-bold leading-relaxed';
      case 'large': return 'text-sm md:text-base font-bold leading-relaxed';
      case 'xlarge': return 'text-base md:text-lg font-bold leading-relaxed';
    }
  };

  const getExampleStepFontClass = () => {
    switch (fontSize) {
      case 'small': return 'text-[10px] md:text-[11px] leading-relaxed';
      case 'normal': return 'text-[11px] md:text-xs leading-relaxed';
      case 'large': return 'text-xs md:text-sm leading-relaxed';
      case 'xlarge': return 'text-sm md:text-base leading-relaxed';
    }
  };

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSpeechBlock, setCurrentSpeechBlock] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // States for interactive exercises
  // 1. Sets Venn Diagram State
  const [selectedVennRegion, setSelectedVennRegion] = useState<'none' | 'only_s' | 'only_y' | 'intersect' | 'union'>('none');
  
  // 2. Integers comparison state
  const [intA, setIntA] = useState<number>(3);
  const [intB, setIntB] = useState<number>(-4);

  // 3. Percentage box grid state
  const [percentageVal, setPercentageVal] = useState<number>(35);

  // 4. Algebra variables state
  const [varX, setVarX] = useState<number>(3);
  const [varY, setVarY] = useState<number>(2);

  // 5. Geometry layout base/height slider state
  const [geomBase, setGeomBase] = useState<number>(10);
  const [geomHeight, setGeomHeight] = useState<number>(6);
  const [selectedShape, setSelectedShape] = useState<'rectangle' | 'triangle' | 'circle' | 'parallelogram'>('rectangle');

  // 6. Pythagoras coordinates
  const [pythA, setPythA] = useState<number>(3);
  const [pythB, setPythB] = useState<number>(4);

  // Real-world problems: track which problem solutions/answers are revealed
  const [revealedProblems, setRevealedProblems] = useState<Record<string, boolean>>({});

  // Solved examples: track which final written results are revealed
  const [revealedExamples, setRevealedExamples] = useState<Record<string, boolean>>({});

  // Stop background speaking on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  const isCompleted = progress.completedLessons.includes(lesson.id);

  const handleComplete = () => {
    onLessonComplete(lesson.id);
    setCompleteSuccess(true);
    // Simple custom TTS congratulation when completed
    speakText("أحسنت يا بطل الأرقام! لقد أنجزت هذا الدرس وحصلت على خمسة وعشرين درجة إضافية!", "completion_voice");
    setTimeout(() => {
      setCompleteSuccess(false);
    }, 4500);
  };

  // Helper function to simplify fractions
  const getSimplifiedFraction = (numerator: number, denominator: number): string => {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };
    const commonFactor = gcd(numerator, denominator);
    const simpNum = numerator / commonFactor;
    const simpDen = denominator / commonFactor;
    
    if (simpDen === 1) return formatNum(simpNum);
    return `${formatNum(simpNum)} / ${formatNum(simpDen)}`;
  };

  // Text-To-Speech core audio narrator function
  const speakText = (textToSpeak: string, blockId: string) => {
    if (!('speechSynthesis' in window)) {
      alert("عذراً، متصفحك لا يدعم خاصية المساعد الصوتي الرقمي.");
      return;
    }

    // If same block clicked while speaking, treat as stop
    if (isPlaying && currentSpeechBlock === blockId && !isPaused) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSpeechBlock(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Remove markdown code symbols before reading for natural pronunciation
    const cleanedText = textToSpeak
      .replace(/[#*`{}]/g, '')
      .replace(/[\n\r]+/g, ' . ')
      .replace(/\s+/g, ' ')
      .replace(/س\s*=\s*/g, 'المجموعة سين تساوي ')
      .replace(/ص\s*=\s*/g, 'المجموعة صاد تساوي ')
      .replace(/=\s*/g, ' تساوي ')
      .replace(/-\s*/g, ' ناقص ')
      .replace(/\+\s*/g, ' زائد ')
      .replace(/×\s*/g, ' ضرب ')
      .replace(/÷\s*/g, ' تقسيم ');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'ar-SA';
    utterance.rate = speechRate;

    // Set voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setCurrentSpeechBlock(blockId);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSpeechBlock(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSpeechBlock(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseResumeSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStopSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSpeechBlock(null);
  };

  // Compile full lesson explanation for cassette lecture reading
  const getFullLessonText = () => {
    let t = `درس رياضيات المنهج السوداني، بعنوان: ${lesson.title}. الشرح العام للدرس: ${lesson.explanation}. `;
    if (lesson.examples && lesson.examples.length > 0) {
      t += " وإليك الآن مراجعة مفصلة لشرح المسائل والأمثلة بكتاب الوزارة: ";
      lesson.examples.forEach((ex, idx) => {
        t += `مثال رقم ${formatNum(idx + 1)}. المسألة هي: ${ex.question}. خطوات الحل: `;
        ex.steps.forEach((step, sIdx) => {
          t += `الخطوة ${formatNum(sIdx + 1)}، ${step}. `;
        });
        t += ` النتيجة النهائية والبرهان يعادل: ${ex.result}. `;
      });
    }
    t += " نتمى لك دوام التفوق والنجاح الباهر!";
    return t;
  };

  return (
    <div id={`lesson_screen_container_${lesson.id}`} className="space-y-6">
      {/* Back button and status area */}
      <div className="flex items-center justify-between">
        <button
          onClick={onGoBack}
          id="btn_back_to_lessons"
          className="flex items-center gap-1 text-xs text-[#5A5A40] hover:text-[#4a4a33] font-bold bg-[#f5f5f0] border border-[#e0e0d1] px-4 py-2 rounded-xl transition-all"
        >
          <ArrowRight className="w-4 h-4 ml-1" /> العودة لشجرة المنهج الدراسي
        </button>

        <span className="text-[11px] bg-white border border-[#e0e0d1] px-3.5 py-2 rounded-full font-bold text-[#8e8e7a]">
          🇸🇩 المنهج السوداني المعدل - الصف السادس
        </span>
      </div>

      {/* Lesson Hero and Title */}
      <div className="bg-white rounded-[24px] p-6 border border-[#e0e0d1] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#5A5A40] opacity-5 -mr-8 -mt-8 rounded-full"></div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-right space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#5A5A40] bg-[#f5f5f0] border border-[#e0e0d1] px-3 py-1 rounded-md">
              الوحدة الكِتابية والدروس التفاعلية
            </span>
            <h2 className="text-xl font-bold text-[#5A5A40] pt-1">
              📚 {lesson.title}
            </h2>
            <p className="text-xs text-[#8e8e7a] max-w-2xl">{lesson.description}</p>
          </div>

          {/* Level indicators */}
          <div className="shrink-0">
            {isCompleted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 font-extrabold text-xs px-4  py-3 rounded-2xl flex items-center gap-1.5 shadow-sm">
                <CheckCircle className="w-4 h-4" /> تَمَّ إكمال المذاكرة بنجاح
              </div>
            ) : (
              <button
                onClick={handleComplete}
                id="btn_complete_lesson_star"
                className="bg-[#5A5A40] hover:bg-[#4a4a33] text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center gap-2 shadow-sm transition active:scale-95"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" /> أكملت الدرس (+٢٥ درجة)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Success Alert after completion */}
      {completeSuccess && (
        <div id="complete_success_alert" className="bg-[#e9ece1] text-[#5A5A40] border border-[#d6dbcc] p-4 rounded-2xl leading-relaxed text-right flex items-center gap-3 animate-fade-in shadow-inner">
          <div className="text-3xl">🎖️</div>
          <div>
            <h4 className="font-bold text-sm">ممتاز جداً يا باحث المستقيل!</h4>
            <p className="text-[11px] text-[#6b6b5a] mt-1">
              تم تسجيل الدرس بنجاح في رصيدك الأكاديمي، لقد زاد مستوى فهمك المنهجي بمقدار خمسة وعشرين درجة إضافية!
            </p>
          </div>
        </div>
      )}

      {/* SYSTEM-WIDE INTEGRATED AUDIO EXPLAINER PLAYER CARD */}
      <div id="integrated_lesson_cassette_player" className="bg-white border border-[#e0e0d1] rounded-2xl p-4 shadow-sm text-right space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#f5f5f0] pb-3">
          <div className="flex items-center gap-3 w-full justify-start">
            <div className="w-10 h-10 bg-[#5A5A40] text-white rounded-xl flex items-center justify-center font-black animate-pulse shadow-sm">
              📢
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#5A5A40]">المعلم الصوتي التفاعلي المدرسي</h4>
              <p className="text-[10px] text-[#8e8e7a]">استمع لشرح الدرس وقرائة الأسئلة بالتفاصيل وطريقة الحل المبسطة</p>
            </div>
          </div>

          {/* Voice rate controllers */}
          <div className="flex items-center gap-2 shrink-0 bg-[#f5f5f0] p-1.5 rounded-xl border border-[#e0e0d1]">
            <span className="text-[9px] font-bold text-[#8e8e7a] px-2">سرعة القراءة:</span>
            {[0.8, 1.0, 1.25].map(rate => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg transition-all ${
                  speechRate === rate ? 'bg-[#5A5A40] text-white' : 'text-[#5A5A40] hover:bg-[#e0e0d1]'
                }`}
              >
                {formatNum(rate)}x
              </button>
            ))}
          </div>
        </div>

        {/* Cassette and simulation waves */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#fdfdfb] p-3 border border-[#e0e0d1] rounded-xl">
          <div className="flex items-center gap-2">
            {currentSpeechBlock === 'all' && isPlaying && !isPaused ? (
              <button
                onClick={handlePauseResumeSpeech}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2.5 rounded-lg transition shadow-sm"
                title="إيقاف مؤقت"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : currentSpeechBlock === 'all' && isPaused ? (
              <button
                onClick={handlePauseResumeSpeech}
                className="bg-[#5A5A40] hover:bg-[#4a4a33] text-white p-2.5 rounded-lg transition shadow-sm"
                title="استئناف الشرح"
              >
                <Play className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => speakText(getFullLessonText(), 'all')}
                className="bg-[#5A5A40] hover:bg-[#4a4a33] text-white px-4 py-2.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Volume2 className="w-4 h-4" /> استمع للدرس كاملاً
              </button>
            )}

            {isPlaying && currentSpeechBlock === 'all' && (
              <button
                onClick={handleStopSpeech}
                className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg transition"
                title="إيقاف كلي"
              >
                <Square className="w-4 h-4 fill-white" />
              </button>
            )}
          </div>

          {/* Sound waves visualization simulation */}
          {isPlaying && currentSpeechBlock === 'all' && (
            <div className="flex items-center gap-1 pr-3 py-1">
              <span className="text-[10px] text-[#5A5A40] font-bold ml-1">يقوم بالشرح الآن...</span>
              <div className="w-1.5 h-6 bg-[#5A5A40] rounded-sm animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 h-4 bg-[#5A5A40] rounded-sm animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-8 bg-[#5A5A40] rounded-sm animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1.5 h-3 bg-[#5A5A40] rounded-sm animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-1.5 h-6 bg-[#5A5A40] rounded-sm animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
          )}
        </div>
      </div>

      {/* Reading preferences toolbar */}
      <div className="bg-white border border-[#e0e0d1] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-right" id="reading_options_toolbar">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="text-xl p-2 bg-[#f5f5f0] border border-[#e0e0d1] text-[#5A5A40] rounded-xl shrink-0">
            📖
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#5A5A40]">تفضيلات القراءة والمطالعة المريحة 👁️✨</h4>
            <p className="text-[10px] text-[#8e8e7a]">تحكم في حجم خط المنهج وفعل وضع التركيز الذهني لتسهيل الفهم والمذاكرة</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-start sm:justify-end">
          {/* Font Sizer Controls */}
          <div className="flex items-center gap-2 bg-[#f5f5f0] p-1 rounded-xl border border-[#e0e0d1]">
            <span className="text-[10px] font-bold text-[#5A5A40] px-2 flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-[#8e8e7a]" /> حجم الخط:
            </span>
            <div className="flex items-center gap-1">
              {(['small', 'normal', 'large', 'xlarge'] as const).map((size) => {
                const label = size === 'small' ? 'A-' : size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++';
                const title = size === 'small' ? 'صغير' : size === 'normal' ? 'طبيعي' : size === 'large' ? 'كبير' : 'كبير جداً';
                return (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    title={title}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      fontSize === size 
                        ? 'bg-[#5A5A40] text-white shadow-xs' 
                        : 'text-[#5A5A40] hover:bg-[#e0e0d1]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reading Mode Toggle */}
          <button
            onClick={() => setIsReadingMode(!isReadingMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isReadingMode 
                ? 'bg-[#5A5A40] text-white border-[#5A5A40]' 
                : 'bg-white text-[#5A5A40] border-[#e0e0d1] hover:bg-[#f5f5f0]'
            }`}
          >
            {isReadingMode ? (
              <>
                <EyeOff className="w-4 h-4 text-white" />
                <span>إلغاء وضع التركيز</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 text-[#5A5A40]" />
                <span>تفعيل وضع التركيز (إخفاء العناصر الجانبية) 🧘</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[#e0e0d1]">
        <button
          onClick={() => setActiveTab('study')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'study'
              ? 'border-[#5A5A40] text-[#5A5A40]'
              : 'border-transparent text-[#8e8e7a] hover:text-[#4a4a40]'
          }`}
        >
          📖 الشرح النظري المنهجي
        </button>
        <button
          onClick={() => setActiveTab('interactive')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'interactive'
              ? 'border-[#5A5A40] text-[#5A5A40]'
              : 'border-transparent text-[#8e8e7a] hover:text-[#4a4a40]'
          }`}
        >
          🔬 محاكاة وتمثيل الصور التفاعلية
        </button>
        <button
          onClick={() => setActiveTab('worksheets')}
          className={`py-3 px-6 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'worksheets'
              ? 'border-[#5A5A40] text-[#5A5A40]'
              : 'border-transparent text-[#8e8e7a] hover:text-[#4a4a40]'
          }`}
        >
          🖨️ أوراق عمل مجهزة للطباعة (١٥ صفحة)
        </button>
      </div>

      {/* Screen Outputs based on tabs */}
      {activeTab === 'study' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right">
          
          {/* Theoretical Core explanations */}
          <div className={`${isReadingMode ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-6`}>
            
            {/* Textbook Explanation Block */}
            <div className="bg-white rounded-2xl p-6 border border-[#e0e0d1] shadow-sm relative">
              <div className="flex items-center justify-between mb-4 border-b border-[#f5f5f0] pb-2">
                <h3 className="font-bold text-[#5A5A40] text-sm flex items-center gap-2">
                  <span className="p-1 px-2.5 bg-[#f5f5f0] text-[#5A5A40] border border-[#e0e0d1] rounded-lg text-xs">١</span>
                  الشرح الكِتابي المنهجي المفصل
                </h3>

                {/* Granular tts listener */}
                <button
                  onClick={() => speakText(lesson.explanation, 'explanation')}
                  className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                    currentSpeechBlock === 'explanation' && isPlaying
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#e0e0d1] border-[#e0e0d1]'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  {currentSpeechBlock === 'explanation' && isPlaying ? "إيقاف الاستماع" : "استمع لهذه الفقرة"}
                </button>
              </div>

              {/* Text content representation */}
              <div className={`${getExplanationFontClass()} text-[#4a4a40] whitespace-pre-wrap space-y-3 font-medium`}>
                {lesson.explanation}
              </div>
            </div>

            {/* Solved Examples block */}
            <div className="bg-white rounded-2xl p-6 border border-[#e0e0d1] shadow-sm space-y-4">
              <h3 className="font-bold text-[#5A5A40] text-sm flex items-center gap-2">
                <span className="p-1 px-2.5 bg-[#f5f5f0] text-[#5A5A40] border border-[#e0e0d1] rounded-lg text-xs">٢</span>
                أمثلة محلولة وخطوات البرهان والحل
              </h3>

              {lesson.examples.map((ex, idx) => {
                const exBlockId = `ex_${idx}`;
                const exSpeechText = `مثال رقم ${idx + 1}. السؤال يقول: ${ex.question}. خطوات الحل كالتالي: ${ex.steps.join(' . ')}. النتيجة النهائية هي: ${ex.result}.`;
                
                return (
                  <div key={idx} className="bg-[#fdfdfb] p-5 rounded-2xl border border-[#e0e0d1] space-y-4 transition hover:bg-white">
                    <div className="flex items-center justify-between gap-4 border-b border-[#f5f5f0] pb-2">
                      <span className="text-xs font-bold text-[#5A5A40] bg-[#f5f5f0] border border-[#e0e0d1] px-3 py-1 rounded-lg">
                        مثال ({formatNum(idx + 1)})
                      </span>

                      {/* Example speaker button */}
                      <button
                        onClick={() => speakText(exSpeechText, exBlockId)}
                        className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                          currentSpeechBlock === exBlockId && isPlaying
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-[#f5f5f0] text-[#5A5A40] hover:bg-[#e0e0d1] border-[#e0e0d1]'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        {currentSpeechBlock === exBlockId && isPlaying ? "إيقاف" : "استمع للمثال"}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className={`${getExampleHeaderFontClass()} text-[#4a4a40]`}>{ex.question}</p>
                      
                      <div className="space-y-2 pl-2 border-r-2 border-[#5A5A40]/30 mr-1 pr-3">
                        <span className="text-[10px] font-bold text-[#8e8e7a] block">خطوات البرهان الرياضي:</span>
                        {ex.steps.map((step, sIdx) => (
                          <p key={sIdx} className={`${getExampleStepFontClass()} text-[#4a4a40] flex items-start gap-1`}>
                            <span className="text-[#5A5A40] font-black">{formatNum(sIdx + 1)}.</span>
                            <span>{step}</span>
                          </p>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#f5f5f0] flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#5A5A40]">النتيجة النهائية الكِتابية:</span>
                        {revealedExamples[`${lesson.id}_ex_${idx}`] ? (
                          <div className="flex items-center gap-2">
                            <span className="bg-green-50 text-green-800 font-extrabold px-3 py-1.5 rounded-lg border border-green-200 shadow-sm">
                              {ex.result}
                            </span>
                            <button
                              onClick={() => setRevealedExamples(prev => ({ ...prev, [`${lesson.id}_ex_${idx}`]: false }))}
                              className="text-[9px] text-[#8e8e7a] hover:text-[#5A5A40] hover:underline"
                              id={`hide_ex_${idx}`}
                            >
                              إخفاء ↩️
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRevealedExamples(prev => ({ ...prev, [`${lesson.id}_ex_${idx}`]: true }))}
                            className="bg-[#5A5A40] hover:bg-[#4a4a35] text-[#fdfdfb] font-bold px-3 py-1.5 rounded-lg text-[9px] shadow-sm transition active:scale-95 cursor-pointer"
                            id={`reveal_ex_${idx}`}
                          >
                            👁️ اضغط لإظهار النتيجة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* REAL-WORLD SUDANESE PROBLEMS SECTION */}
            {lesson.realWorldProblems && lesson.realWorldProblems.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50/20 via-white to-emerald-50/10 rounded-2xl p-6 border border-emerald-100 shadow-sm space-y-4 text-right">
                <div className="flex items-center justify-between border-b border-emerald-55 pb-2">
                  <h3 className="font-extrabold text-emerald-800 text-sm flex items-center gap-2">
                    <span className="p-1 px-2.5 bg-emerald-50 text-emerald-700 border border-emerald-150 rounded-lg text-xs">٣</span>
                    مسائل وتطبيقات من الواقع الحقيقي في السودان 🇸🇩
                  </h3>
                  <span className="text-[10px] font-bold py-0.5 px-2.5 bg-emerald-600 text-white rounded-full">الربط الحياتي الميداني</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  الرياضيات ليست مجرد أرقام صماء! إليك كيف نستخدم مفاهيم هذا الدرس لحل مشكلات عملية حقيقية في حقول، ومشاريع، وصناعة السودان:
                </p>

                {lesson.realWorldProblems.map((prob, pIdx) => {
                  const probBlockId = `prob_${pIdx}`;
                  const key = `${lesson.id}_prob_${pIdx}`;
                  const isRevealed = !!revealedProblems[key];
                  const probSpeechText = `تطبيق من الواقع الحي. سياق القصة: ${prob.scenario}. المسألة: ${prob.question}. طريقة الحل في الميدان: ${prob.explanation}. النتيجة النهائية: ${prob.answer}`;

                  return (
                    <div key={pIdx} className="bg-emerald-50/30 border border-emerald-100/50 p-5 rounded-xl space-y-4">
                      {/* Scenario Row with Speaker */}
                      <div className="flex items-center justify-between gap-4 border-b border-emerald-100/40 pb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base text-emerald-600">🌍</span>
                          <span className="text-xs font-extrabold text-[#5A5A40]">سياق القصة: {prob.scenario}</span>
                        </div>
                        <button
                          onClick={() => speakText(probSpeechText, probBlockId)}
                          className={`flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-lg border transition ${
                            currentSpeechBlock === probBlockId && isPlaying
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-emerald-100/40 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          {currentSpeechBlock === probBlockId && isPlaying ? "إيقاف" : "استمع للقصة"}
                        </button>
                      </div>

                      {/* Question */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-emerald-800 font-extrabold block">❓ المسألة والطلب الحياتي:</span>
                        <p className={`${getExampleHeaderFontClass()} text-slate-700 leading-relaxed`}>{prob.question}</p>
                      </div>

                      {/* Explanation & Result Toggle */}
                      {isRevealed ? (
                        <div className="space-y-4">
                          {/* Explanation */}
                          <div className="space-y-1.5 pl-2 border-r-2 border-emerald-400/50 mr-1 pr-3">
                            <span className="text-[10px] text-emerald-800 font-extrabold block">💡 الحل والبرهان الرياضي الميداني:</span>
                            <p className={`${getExplanationFontClass()} text-[#4a4a40] leading-relaxed`}>{prob.explanation}</p>
                          </div>

                          {/* Result */}
                          <div className="pt-2 border-t border-emerald-100/40 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-emerald-800">🎯 النتيجة الميدانية المعتمدة:</span>
                            <div className="flex items-center gap-3">
                              <span className="bg-emerald-600 text-white font-black px-3 py-1.5 rounded-lg shadow-sm">
                                {prob.answer}
                              </span>
                              <button
                                onClick={() => setRevealedProblems(prev => ({ ...prev, [key]: false }))}
                                className="text-[10px] text-emerald-700 hover:underline font-bold"
                              >
                                إخفاء الحل ↩️
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/80 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-emerald-250 text-center space-y-2">
                          <p className="text-[11px] text-slate-500 font-medium">
                            📝 فكّر في السؤال ومجرياته بعناية أولاً، وبعد حله في دفترك اضغط على الزر أدناه لمطابقة ومراجعة خطوات البرهان والحل المعتمد!
                          </p>
                          <button
                            onClick={() => setRevealedProblems(prev => ({ ...prev, [key]: true }))}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black py-2 px-5 rounded-xl transition shadow-md active:scale-95 inline-flex items-center gap-1"
                          >
                            💡 عرض الحل والبرهان الرياضي الميداني والنتيجة 🎯
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick study widgets column */}
          {!isReadingMode && (
            <div className="space-y-6">
              
              {/* Sudan math teacher advisory snippet */}
              <div className="bg-[#e9ece1] rounded-2xl p-5 border border-[#d6dbcc] space-y-2">
                <h4 className="font-bold text-xs text-[#5A5A40] flex items-center gap-1">
                  <span>💡 نصيحة أستاذ الرياضيات:</span>
                </h4>
                <p className="text-[11px] text-[#4a4a40] leading-relaxed">
                  "عزيزي الطالب، لحل أي مسألة حِسابية بنجاح: اقرأ المعطيات بعناية أولاً، حدد المطلوب بدقة، ثم اتبع خطوات البرهان ولا تتسرع في كتابة النتيجة دون كتابة القانون الرياضي المعتمد!"
                </p>
                <div className="pt-2.5 border-t border-[#d6dbcc] flex items-center justify-between text-[9px] font-bold text-[#5A5A40]">
                  <span>المعلم الافتراضي أحمد</span>
                  <span>الصف السَّادس 🇸🇩</span>
                </div>
              </div>

              {/* Symbols reference checklist card */}
              <div className="bg-white rounded-2xl p-5 border border-[#e0e0d1] space-y-3">
                <h4 className="font-bold text-xs text-[#5A5A40] border-b border-[#f5f5f0] pb-2">رموز أساسية في هذه الوحدة:</h4>
                <div className="space-y-2">
                  <div className="bg-[#f5f5f0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A5A40] font-mono">∈ , ∉</span>
                    <span className="text-[#4a4a40] text-[10px]">ينتمي / لا ينتمي للعنصر</span>
                  </div>
                  <div className="bg-[#f5f5f0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A5A40] font-mono">⊂ , ⊄</span>
                    <span className="text-[#4a4a40] text-[10px]">محتواة في / غير محتواة في</span>
                  </div>
                  <div className="bg-[#f5f5f0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A5A40] font-mono">∅</span>
                    <span className="text-[#4a4a40] text-[10px]">المجموعة الخالية (فاي)</span>
                  </div>
                  <div className="bg-[#f5f5f0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A5A40] font-mono">|س|</span>
                    <span className="text-[#4a4a40] text-[10px]">القيمة المطلقة للعدد صحيح</span>
                  </div>
                  <div className="bg-[#f5f5f0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5A5A40] font-mono">ط (π)</span>
                    <span className="text-[#4a4a40] text-[10px]">النسبة التقريبية الدائرية (٢٢/٧)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'interactive' && (
        /* TAB 2: ADVANCED MATH INTERACTIVE MODELLING AND ILLUSTRATIONS */
        <div className="bg-white rounded-2xl p-6 border border-[#e0e0d1] shadow-sm text-right space-y-6">
          <div className="flex items-center justify-between border-b border-[#f5f5f0] pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                🔬 مختبر ومحاكاة التمثيل الصوري التفاعلي
              </h3>
              <p className="text-[10px] text-[#8e8e7a] mt-0.5">رسومات وصور توضيحية لبرهنة القوانين وتثبيت الشرح بالكامل</p>
            </div>
            <span className="text-[11px] bg-[#f5f5f0] text-[#5A5A40] border border-[#e0e0d1] px-3 py-1.5 rounded-xl font-bold">
              تفاعلي ⚡
            </span>
          </div>

          {/* Fallback to custom sets render representation if lesson has no matching widget */}
          {(!lesson.interactiveType || lesson.id.startsWith('u1') || lesson.id.startsWith('u5')) && (
            <div className="space-y-4">
              <p className="text-xs text-[#4a4a40] leading-relaxed font-semibold">
                تمثيل أشكال فِن (Venn Diagrams) للعمليات على المجموعات: انقر على المناطق أو الأزرار لتلوين المجموعات ومشاهدة النتيجة فورياً بالصفة ورصد العناصر:
              </p>

              {/* Selection buttons */}
              <div className="flex flex-wrap gap-2 justify-start">
                <button
                  onClick={() => setSelectedVennRegion('only_s')}
                  className={`text-[11px] font-bold px-3 py-2 rounded-xl transition ${
                    selectedVennRegion === 'only_s' ? 'bg-[#5A5A40] text-white' : 'bg-[#f5f5f0] text-[#5A5A40]'
                  }`}
                >
                  المنفرد في س (س - ص)
                </button>
                <button
                  onClick={() => setSelectedVennRegion('intersect')}
                  className={`text-[11px] font-bold px-3 py-2 rounded-xl transition ${
                    selectedVennRegion === 'intersect' ? 'bg-[#5A5A40] text-white' : 'bg-[#f5f5f0] text-[#5A5A40]'
                  }`}
                >
                  التقاطع المشترك (س ∩ ص)
                </button>
                <button
                  onClick={() => setSelectedVennRegion('only_y')}
                  className={`text-[11px] font-bold px-3 py-2 rounded-xl transition ${
                    selectedVennRegion === 'only_y' ? 'bg-[#5A5A40] text-white' : 'bg-[#f5f5f0] text-[#5A5A40]'
                  }`}
                >
                  المنفرد في ص (ص - س)
                </button>
                <button
                  onClick={() => setSelectedVennRegion('union')}
                  className={`text-[11px] font-bold px-3 py-2 rounded-xl transition ${
                    selectedVennRegion === 'union' ? 'bg-[#5A5A40] text-white' : 'bg-[#f5f5f0] text-[#5A5A40]'
                  }`}
                >
                  الاتحاد الشامل (س ∪ ص)
                </button>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6 bg-[#fdfdfb] border border-[#e0e0d1] rounded-2xl">
                {/* SVG Venn drawing */}
                <svg className="w-64 h-48 rounded-xl object-center" viewBox="0 0 300 200">
                  <defs>
                    <clipPath id="overlay">
                      <circle cx="110" cy="100" r="50" />
                    </clipPath>
                  </defs>

                  {/* Rectangle for Universal set */}
                  <rect x="10" y="10" width="280" height="180" fill="#fcfcf9" stroke="#e0e0d1" strokeWidth="2" rx="12" />
                  <text x="25" y="32" fontSize="13" fontWeight="black" fill="#5A5A40" textAnchor="middle">ش</text>

                  {/* Left Circle - Set S */}
                  <circle
                    cx="110"
                    cy="100"
                    r="55"
                    fill={selectedVennRegion === 'only_s' || selectedVennRegion === 'union' ? '#dcdcc6' : '#f5f5f0'}
                    stroke="#5A5A40"
                    strokeWidth="2"
                    className="cursor-pointer transition hover:opacity-90"
                    onClick={() => setSelectedVennRegion('only_s')}
                  />

                  {/* Right Circle - Set Y */}
                  <circle
                    cx="190"
                    cy="100"
                    r="55"
                    fill={selectedVennRegion === 'only_y' || selectedVennRegion === 'union' ? '#e9ece1' : '#fcfcf9'}
                    stroke="#8e8e7a"
                    strokeWidth="2"
                    className="cursor-pointer transition hover:opacity-90"
                    onClick={() => setSelectedVennRegion('only_y')}
                  />

                  {/* Central Intersection region clipping */}
                  {(selectedVennRegion === 'intersect' || selectedVennRegion === 'union') && (
                    <circle
                      cx="190"
                      cy="100"
                      r="55"
                      fill="#5A5A40"
                      fillOpacity="0.4"
                      clipPath="url(#overlay)"
                      className="cursor-pointer transition"
                      onClick={() => setSelectedVennRegion('intersect')}
                    />
                  )}
                  {/* Fine border over overlapping */}
                  <circle cx="110" cy="100" r="55" fill="none" stroke="#5A5A40" strokeWidth="1.5" />

                  {/* Elements names */}
                  <text x="80" y="100" fontSize="10" fontWeight="bold" fill="#4a4a40">أحمد 👨‍🎓</text>
                  <text x="85" y="125" fontSize="10" fontWeight="bold" fill="#4a4a40">خالد</text>

                  <text x="150" y="92" fontSize="10" fontWeight="bold" fill="#5A5A40">سليمان 🤝</text>
                  <text x="150" y="117" fontSize="10" fontWeight="bold" fill="#5A5A40">تقوى</text>

                  <text x="210" y="100" fontSize="10" fontWeight="bold" fill="#8e8e7a">الطاهر</text>
                  <text x="215" y="125" fontSize="10" fontWeight="bold" fill="#8e8e7a">أنوار</text>

                  {/* Set Letters */}
                  <text x="110" y="38" fontSize="12" fontWeight="bold" fill="#5A5A40" textAnchor="middle">س</text>
                  <text x="190" y="38" fontSize="12" fontWeight="bold" fill="#8e8e7a" textAnchor="middle">ص</text>
                </svg>

                {/* Analytical explanations below diagram */}
                <div className="flex-1 w-full bg-white p-5 rounded-2xl border border-[#e0e0d1]">
                  <h4 className="font-extrabold text-xs text-[#5A5A40] mb-2">توصيف المنطقة الرياضية المظللة:</h4>
                  {selectedVennRegion === 'none' && (
                    <p className="text-[11px] text-[#8e8e7a] leading-relaxed">
                      انقر على الأزرار العلوية أو دوائر أشكال فن لتلوين المنطقة هندسياً ورؤية التغييرات المنهجية وحل المجموعة الفعلي.
                    </p>
                  )}
                  {selectedVennRegion === 'only_s' && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] bg-slate-100 text-slate-800 font-extrabold px-3 py-1 rounded-full border border-[#cbd5e1]">
                        س - ص (الفرق)
                      </span>
                      <p className="text-[11px] text-[#4a4a40] leading-relaxed">
                        وهو مجموعة العناصر الموجودة في س ولكنها لا تتواجد في المجموعة ص مطلقاً.
                      </p>
                      <p className="text-xs font-mono font-bold text-[#5A5A40] pt-1">
                        الرصد = {"{ أحمد، سليمان }"}
                      </p>
                    </div>
                  )}
                  {selectedVennRegion === 'only_y' && (
                    <div className="space-y-1">
                      <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
                        الفرق (ص - س)
                      </span>
                      <p className="text-[11px] text-[#4a4a40] leading-relaxed mt-2">
                        العناصر المنفردة للمجموعة ص فقط، والتي تم إبعاد الـ س عنها بالكامل.
                        <br />الأعضاء: {"{ الطاهر، أنوار }"}
                      </p>
                    </div>
                  )}
                  {selectedVennRegion === 'intersect' && (
                    <div className="space-y-1">
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                        س ∩ ص (التقاطع)
                      </span>
                      <p className="text-[11px] text-[#4a4a40] leading-relaxed mt-2">
                        المنطقة المشتركة التي تضم عناصر المجموعتين معاً في آن واحد.
                        <br />الأعضاء: {"{ سليمان، تقوى }"}
                      </p>
                    </div>
                  )}
                  {selectedVennRegion === 'union' && (
                    <div className="space-y-1">
                      <span className="text-xs bg-indigo-100 text-indigo-805 px-3 py-1 rounded-full font-bold">
                        س ∪ ص (الاتحاد)
                      </span>
                      <p className="text-[11px] text-[#4a4a40] leading-relaxed mt-2">
                        ضم كل العناصر في قائمة واحدة دون تكرار الأعضاء المتواجدين في النص.
                        <br />الرصد = {"{ خالد، أحمد، تقوى، سليمان، أنوار، الطاهر }"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Unit 2 widget: Integers line representation */}
          {lesson.interactiveType === 'integers' && (
            <div className="space-y-6">
              <p className="text-xs text-[#4a4a40] leading-relaxed font-semibold">
                حرك منزلقات الأعداد الصحيحة أ وب لبرمجتهما على خط الأعداد، وشاهد القيمة المطلقة (المسافة عن الصفر دائماً موجبة):
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>العدد الأول (أ)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(intA)}</span>
                  </label>
                  <input
                    type="range"
                    min="-7"
                    max="7"
                    value={intA}
                    onChange={(e) => setIntA(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>

                <div className="space-y-2 bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>العدد الثاني (ب)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(intB)}</span>
                  </label>
                  <input
                    type="range"
                    min="-7"
                    max="7"
                    value={intB}
                    onChange={(e) => setIntB(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Number line representation */}
              <div className="p-6 bg-[#fdfdfb] border border-[#e0e0d1] rounded-2xl flex flex-col items-center">
                <span className="text-[10px] text-[#8e8e7a] mb-8">خط الأعداد الصحيحة (اليمين موجب واليسار سالب)</span>
                
                <div className="relative w-full max-w-xl h-20 flex items-center justify-between border-b-2 border-slate-400 py-2 px-4 shadow-sm rounded-lg bg-white">
                  {/* Central line and ticks */}
                  {[-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map((tick) => {
                    const isZero = tick === 0;
                    const isA = tick === intA;
                    const isB = tick === intB;
                    return (
                      <div key={tick} className="flex flex-col items-center relative">
                        {/* Upper indicators */}
                        {isA && (
                          <span className="absolute -top-7 bg-[#5A5A40] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                            أ
                          </span>
                        )}
                        {isB && (
                          <span className="absolute -top-7 bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                            ب
                          </span>
                        )}

                        {/* Tick mark */}
                        <div className={`w-[2px] h-3.5 ${isZero ? 'bg-indigo-600 h-5 w-[3px]' : 'bg-slate-400'}`}></div>

                        {/* Tick label */}
                        <span className={`text-[9px] font-black mt-2 ${isZero ? 'text-indigo-600 font-extrabold text-xs' : 'text-slate-500'}`}>
                          {formatNum(tick)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Calculation of absolute values */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-8 pt-4 border-t border-[#e0e0d1] text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-[#e0e0d1]">
                    <span className="text-[10px] font-bold text-[#8e8e7a] block">القيمة المطلقة لـ أ:</span>
                    <p className="font-extrabold text-[#5A5A40] pt-1">| {formatNum(intA)} | = {formatNum(Math.abs(intA))} خطوات </p>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-[#e0e0d1]">
                    <span className="text-[10px] font-bold text-[#8e8e7a] block">القيمة المطلقة لـ ب:</span>
                    <p className="font-extrabold text-amber-700 pt-1">| {formatNum(intB)} | = {formatNum(Math.abs(intB))} خطوات </p>
                  </div>
                  <div className="bg-[#f5f5f0] p-3.5 rounded-xl border border-[#e0e0d1] flex items-center justify-center">
                    <span className="font-extrabold text-slate-700">
                      بالمقارنة: {formatNum(intA)} {intA > intB ? ' > ' : intA < intB ? ' < ' : ' = '} {formatNum(intB)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unit 3 widget: Percentages 100 squares grid */}
          {lesson.id.includes('u3') && (
            <div className="space-y-6">
              <p className="text-xs text-[#4a4a40] leading-relaxed font-semibold">
                تمثيل النسبة المئوية بشبكة المئة مربع (كتاب الوزارة صفحة ٧٩): حرك المنزلق لتمثيل النسبة مئوياً وعشرياً وكسرياً:
              </p>

              <div className="bg-[#f5f5f0] p-5 rounded-2xl border border-[#e0e0d1] space-y-2">
                <label className="text-xs font-bold text-[#5A5A40] flex justify-between">
                  <span>النسبة المئوية المراد تلوينها:</span>
                  <span className="font-bold text-sm text-[#5A5A40]">{formatNum(percentageVal)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentageVal}
                  onChange={(e) => setPercentageVal(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
                
                {/* 10x10 squares grid */}
                <div className="w-56 h-56 mx-auto grid grid-cols-10 gap-1 p-2 bg-white border border-[#e0e0d1] rounded-xl shadow-sm">
                  {Array.from({ length: 100 }).map((_, idx) => {
                    const isShaded = idx < percentageVal;
                    return (
                      <div
                        key={idx}
                        className={`w-full aspect-square rounded-sm transition-all duration-300 ${
                          isShaded ? 'bg-[#5A5A40]' : 'bg-[#f5f5f0]'
                        }`}
                      ></div>
                    );
                  })}
                </div>

                {/* Analytical equivalent representations */}
                <div className="space-y-4 bg-[#fdfdfb] p-5 rounded-2xl border border-[#e0e0d1] text-xs">
                  <h4 className="font-bold text-[#5A5A40] text-sm">مكافئات النسبة المختارة:</h4>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#f5f5f0] pb-2">
                      <span className="text-[#8e8e7a]">كبسط ومقام كسر عادي:</span>
                      <span className="font-extrabold text-[#5A5A40] font-mono text-sm">
                        {formatNum(percentageVal)} / {formatNum(100)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#f5f5f0] pb-2">
                      <span className="text-[#8e8e7a]">بعد التبسيط الرياضي (الكسر الأبسط):</span>
                      <span className="font-extrabold text-[#5A5A40] font-mono text-sm bg-white border px-2 py-0.5 rounded text-left">
                        {getSimplifiedFraction(percentageVal, 100)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-[#f5f5f0] pb-2">
                      <span className="text-[#8e8e7a]">في صورة كسر عشري:</span>
                      <span className="font-extrabold text-[#5A5A40] font-mono text-sm">
                        {formatNum((percentageVal / 100).toFixed(2))}
                      </span>
                    </div>

                    <div className="text-[10px] text-[#8e8e7a] leading-relaxed pt-2">
                      * التفسير الهندسي: لقد قمت بتظليل عدد {formatNum(percentageVal)} مربعاً، وبقي {formatNum(100 - percentageVal)} مربعاً غير مظلل من أصل مئة.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Unit 4 widget: Algebra weight scale */}
          {lesson.id.includes('u4') && (
            <div className="space-y-6">
              <p className="text-xs text-[#4a4a40] leading-relaxed font-semibold">
                ميزان المقادير الجبرية لتوصيف الحدود والمعالجات الرقمية للتعبير: (٣س + ٢ص)
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>قيمة الرمز المجهول (س)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(varX)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={varX}
                    onChange={(e) => setVarX(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>

                <div className="space-y-2 bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>قيمة الرمز المجهول (ص)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(varY)}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={varY}
                    onChange={(e) => setVarY(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Graphical block weight */}
              <div className="p-5 bg-[#fdfdfb] border border-[#e0e0d1] rounded-2xl flex flex-col items-center">
                <div className="w-full max-w-sm flex items-end justify-between border-b-4 border-[#5A5A40] h-24 pb-1 relative">
                  
                  {/* Left scale pan */}
                  <div className="flex flex-col items-center w-24">
                    <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                      {Array.from({ length: varX * 3 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 bg-[#5A5A40] rounded-sm text-[6px] text-white flex items-center justify-center font-bold">س</div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold mt-2 text-[#5A5A40]">الحد الأول: ٣س</span>
                  </div>

                  {/* Middle pivot scale point */}
                  <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-[#5A5A40] rotate-45"></div>

                  {/* Right scale pan */}
                  <div className="flex flex-col items-center w-24">
                    <div className="flex flex-wrap gap-1 justify-center max-w-[80px]">
                      {Array.from({ length: varY * 2 }).map((_, i) => (
                        <div key={i} className="w-2.5 h-2.5 bg-amber-600 rounded-full text-[6px] text-white flex items-center justify-center font-bold">ص</div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold mt-2 text-amber-700">الحد الثاني: ٢ص</span>
                  </div>
                </div>

                {/* Quantitative summary sheet below */}
                <div className="w-full bg-white p-4 rounded-xl border border-[#e0e0d1] mt-6 text-xs text-right space-y-2">
                  <span className="font-extrabold text-[#5A5A40] block">حساب القيمة الإجمالية للمقدار الجبري:</span>
                  <p className="font-mono text-slate-700">
                    ٣س + ٢ص = ٣ × ({formatNum(varX)}) + ٢ × ({formatNum(varY)})
                  </p>
                  <p className="font-mono font-bold text-slate-800">
                    = {formatNum(varX * 3)} + {formatNum(varY * 2)} = {formatNum((varX * 3) + (varY * 2))}
                  </p>
                  <p className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-150 px-2 py-1 rounded inline-block">
                    * ٣ هو لمعامل الحد الأول و ٢ هو معامل الثاني، س وص يمثلا الرموز المتبدلة.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Unit 6 widget: Shape geometry visual calculations */}
          {lesson.id.includes('u6') && (
            <div className="space-y-6">
              <p className="text-xs text-[#4a4a40] leading-relaxed font-semibold">
                اكتشف مساحات الأشكال الهندسية للصف السادس بالشرح التفاعلي (المستطيل والمثلث والدائرة وصيغة ط):
              </p>

              {/* TABS to choose which shape representation to render */}
              <div className="flex justify-start gap-2 border-b border-[#f5f5f0] pb-2">
                {[
                  { id: 'rectangle', label: 'المستطيل والمربع' },
                  { id: 'triangle', label: 'المثلث وقاعدته' },
                  { id: 'circle', label: 'الدائرة ونصف القطر' },
                  { id: 'parallelogram', label: 'متوازي الأضلاع' }
                ].map((sh) => (
                  <button
                    key={sh.id}
                    onClick={() => setSelectedShape(sh.id as any)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition ${
                      selectedShape === sh.id ? 'bg-[#5A5A40] text-white border-[#5A5A40]' : 'bg-white text-[#5A5A40] border-[#cbd5e1]'
                    }`}
                  >
                    {sh.label}
                  </button>
                ))}
              </div>

              {/* Adjustable inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-[#f5f5f0] p-3.5 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>
                      {selectedShape === 'circle' ? 'نصف القطر (نق) (سم)' : 'القاعدة / الطول (سم)'}
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(geomBase)}</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="14"
                    value={geomBase}
                    onChange={(e) => setGeomBase(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>

                {selectedShape !== 'circle' && (
                  <div className="space-y-2 bg-[#f5f5f0] p-3.5 rounded-xl border border-[#e0e0d1]">
                    <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                      <span>الارتفاع العمودي / العرض (سم)</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(geomHeight)}</span>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="14"
                      value={geomHeight}
                      onChange={(e) => setGeomHeight(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                    />
                  </div>
                )}
              </div>

              {/* Displaying visual and steps */}
              <div className="flex flex-col md:flex-row items-center gap-6 bg-[#fdfdfb] border border-[#e0e0d1] p-5 rounded-2xl">
                
                {/* SVG drawings scaled dynamically */}
                <div className="w-56 h-40 bg-white rounded-xl border border-[#e0e0d1] flex items-center justify-center p-4">
                  <svg className="w-full h-full" viewBox="0 0 100 80">
                    {/* Rectangle rendering */}
                    {selectedShape === 'rectangle' && (
                      <g>
                        <rect
                          x="20"
                          y="20"
                          width={geomBase * 3.5}
                          height={geomHeight * 3.5}
                          fill="#e9ece1"
                          stroke="#5A5A40"
                          strokeWidth="2"
                        />
                        <text x={20 + (geomBase * 1.75)} y="15" fontSize="6" fontWeight="bold" fill="#5A5A40" textAnchor="middle">
                          {formatNum(geomBase)} سم (ل)
                        </text>
                        <text x="12" y={20 + (geomHeight * 1.75) + 2} fontSize="6" fontWeight="bold" fill="#5A5A40">
                          {formatNum(geomHeight)} سم
                        </text>
                      </g>
                    )}

                    {/* Triangle rendering model */}
                    {selectedShape === 'triangle' && (
                      <g>
                        <polygon
                          points={`15,${20 + (geomHeight*3.5)} ${15 + (geomBase*5)},${20 + (geomHeight*3.5)} ${15 + (geomBase*2.5)},20`}
                          fill="#fdf2e9"
                          stroke="#ea580c"
                          strokeWidth="2"
                        />
                        <line
                          x1={15 + (geomBase*2.5)}
                          y1="20"
                          x2={15 + (geomBase*2.5)}
                          y2={20 + (geomHeight*3.5)}
                          stroke="#dc2626"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <text x={15 + (geomBase * 2.5)} y={20 + (geomHeight * 3.5) + 10} fontSize="6" fontWeight="bold" fill="#ea580c" textAnchor="middle">
                          القاعدة = {formatNum(geomBase)} سم
                        </text>
                        <text x={15 + (geomBase * 2.5) + 4} y={20 + (geomHeight * 1.75)} fontSize="6" fontWeight="bold" fill="#dc2626">
                          ع={formatNum(geomHeight)} سم
                        </text>
                      </g>
                    )}

                    {/* Circle rendering with radius line */}
                    {selectedShape === 'circle' && (
                      <g>
                        <circle
                          cx="50"
                          cy="40"
                          r={geomBase * 2.2}
                          fill="#f0f0f5"
                          stroke="#4f46e5"
                          strokeWidth="2"
                        />
                        <circle cx="50" cy="40" r="2.5" fill="#4f46e5" />
                        <line
                          x1="50"
                          y1="40"
                          x2={50 + (geomBase * 2.2)}
                          y2="40"
                          stroke="#4f46e5"
                          strokeWidth="1.5"
                        />
                        <text x={50 + (geomBase * 1.1)} y="36" fontSize="6" fontWeight="bold" fill="#4f46e5" textAnchor="middle">
                          نق = {formatNum(geomBase)} سم
                        </text>
                        <text x="50" y="47" fontSize="5" fill="#8e8e7a" textAnchor="middle">مركز الدائرة</text>
                      </g>
                    )}

                    {/* Parallelogram rendering */}
                    {selectedShape === 'parallelogram' && (
                      <g>
                        <polygon
                          points={`25,20 ${25 + (geomBase*3.5)},20 ${10 + (geomBase*3.5)},${20 + (geomHeight*3.5)} 10,${20 + (geomHeight*3.5)}`}
                          fill="#e9ece1"
                          stroke="#5A5A40"
                          strokeWidth="2"
                        />
                        <line
                          x1="25"
                          y1="20"
                          x2="25"
                          y2={20 + (geomHeight*3.5)}
                          stroke="#ef4444"
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <text x={15 + (geomBase * 1.75)} y={20 + (geomHeight * 3.5) + 8} fontSize="6" fontWeight="bold" fill="#5A5A40" textAnchor="middle">
                          القاعدة = {formatNum(geomBase)} سم
                        </text>
                        <text x="28" y={20 + (geomHeight * 1.75)} fontSize="6" fontWeight="bold" fill="#ef4444">
                          ع={formatNum(geomHeight)} سم
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* Formula details */}
                <div className="flex-1 w-full bg-white p-4 rounded-xl border border-[#e0e0d1] text-xs">
                  <h4 className="font-extrabold text-[#5A5A40] mb-2">طريقة البرهان وحساب المساحة:</h4>
                  {selectedShape === 'rectangle' && (
                    <div className="space-y-1">
                      <p className="text-[#8e8e7a]">المعادلة المقررة: مساحة المستطيل = الطول × العرض</p>
                      <p className="font-bold text-[#5A5A40] font-mono text-sm pt-1">
                        الحساب: {formatNum(geomBase)} × {formatNum(geomHeight)} = {formatNum(geomBase * geomHeight)} سم²
                      </p>
                    </div>
                  )}
                  {selectedShape === 'triangle' && (
                    <div className="space-y-1">
                      <p className="text-[#8e8e7a]">المعادلة المقررة: مساحة المثلث = ١/٢ × القاعدة × الارتفاع</p>
                      <p className="font-bold text-amber-700 font-mono text-sm pt-1">
                        الحساب: ١/٢ × {formatNum(geomBase)} × {formatNum(geomHeight)} = {formatNum(0.5 * geomBase * geomHeight)} سم²
                      </p>
                    </div>
                  )}
                  {selectedShape === 'circle' && (
                    <div className="space-y-1">
                      <p className="text-[#8e8e7a]">المعادلة المقررة: مساحة الدائرة = ط × نق² (حيث ط ≈ ٢٢ / ٧)</p>
                      <p className="font-bold text-blue-700 font-mono text-sm pt-1">
                        الحساب: (٢٢ / ٧) × {formatNum(geomBase)} × {formatNum(geomBase)}
                      </p>
                      <p className="font-bold font-mono text-[#5A5A40]">
                        النتيجة ≈ {formatNum(Math.round((22 / 7) * geomBase * geomBase))} سم²
                      </p>
                    </div>
                  )}
                  {selectedShape === 'parallelogram' && (
                    <div className="space-y-1">
                      <p className="text-[#8e8e7a]">المعادلة المقررة: مساحة متوازي الأضلاع = القاعدة × الارتفاع العمودي</p>
                      <p className="font-bold text-[#5A5A40] font-mono text-sm pt-1">
                        الحساب: {formatNum(geomBase)} × {formatNum(geomHeight)} = {formatNum(geomBase * geomHeight)} سم²
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Unit 7 widget: Pythagoras visual grid proof */}
          {lesson.id.includes('u7') && (
            <div className="space-y-6">
              <p className="text-xs text-[#4a4a40] leading-relaxed font-semibold">
                تمثيل شبكة برهان مساحات المربعات لنظرية فيثاغورث (كتاب المنهج صفحة ١٥٧): حرك المنزلقات وسيتغير حجم المثلث والشبكات الصورية المربوطة بالأضلاع تلقائياً:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>ضلع القائمة الرأسي (أ)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(pythA)} سم</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="5"
                    value={pythA}
                    onChange={(e) => setPythA(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>

                <div className="space-y-2 bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1]">
                  <label className="text-[11px] font-bold text-[#5A5A40] flex justify-between">
                    <span>ضلع القائمة الأفقي (ب)</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#e0e0d1]">{formatNum(pythB)} سم</span>
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="6"
                    value={pythB}
                    onChange={(e) => setPythB(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-[#cbd5e1] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                  />
                </div>
              </div>

              {/* Dynamic spreadsheet results */}
              {(() => {
                const sqA = pythA * pythA;
                const sqB = pythB * pythB;
                const sqC = sqA + sqB;
                const hypotenuse = Math.sqrt(sqC);

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* Visual Triangles Grid Drawing */}
                    <div className="w-full h-56 bg-white rounded-2xl border border-[#e0e0d1] flex items-center justify-center p-2">
                      <svg className="w-full h-full max-w-[200px]" viewBox="0 0 120 120">
                        {/* Right angled triangle */}
                        <polygon
                          points="30,30 30,80 90,80"
                          fill="#e9ece1"
                          stroke="#5A5A40"
                          strokeWidth="2"
                        />
                        {/* Right angle rect */}
                        <rect x="30" y="75" width="5" height="5" fill="none" stroke="#5A5A40" strokeWidth="1.5" />

                        {/* Connected square on horizontal side (b) */}
                        <rect
                          x="30"
                          y="80"
                          width={pythB * 8}
                          height={pythB * 8}
                          fill="none"
                          stroke="#ea580c"
                          strokeWidth="1"
                          strokeDasharray="1 1"
                        />

                        {/* Connected square on vertical side (a) */}
                        <rect
                          x={30 - (pythA * 8)}
                          y={80 - (pythA * 8)}
                          width={pythA * 8}
                          height={pythA * 8}
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="1"
                          strokeDasharray="1 1"
                        />

                        {/* Labels */}
                        <text x="24" y="55" fontSize="6" fontWeight="black" fill="#4f46e5">أ = {formatNum(pythA)}</text>
                        <text x="60" y="88" fontSize="6" fontWeight="black" fill="#ea580c">ب = {formatNum(pythB)}</text>
                        <text x="64" y="50" fontSize="5" fontWeight="black" fill="#5A5A40">الوتر (ج) ≈ {formatNum(hypotenuse.toFixed(1))}</text>
                      </svg>
                    </div>

                    <div className="bg-[#fcfcf9] p-5 rounded-2xl border border-[#e0e0d1] text-xs space-y-3">
                      <h4 className="font-extrabold text-[#5A5A40]">عملية الحساب خطوة بخطوة بالبرهان:</h4>
                      <p className="text-[#4a4a40] leading-relaxed">
                        ١- مربع الضلع الرأسي (أ²) = {formatNum(pythA)} × {formatNum(pythA)} = <span className="font-bold text-[#4f46e5]">{formatNum(sqA)}</span> سم²
                      </p>
                      <p className="text-[#4a4a40] leading-relaxed">
                        ٢- مربع الضلع الأفقي (ب²) = {formatNum(pythB)} × {formatNum(pythB)} = <span className="font-bold text-[#ea580c]">{formatNum(sqB)}</span> سم²
                      </p>
                      <div className="p-3 bg-white border border-[#e0e0d1] rounded-xl">
                        <span className="text-[10px] font-bold text-[#8e8e7a] block">صيغة فيثاغورث: ج² = أ² + ب²</span>
                        <p className="font-extrabold text-[#5A5A40] pt-1 text-sm">
                          ج² = {formatNum(sqA)} + {formatNum(sqB)} = {formatNum(sqC)} سم²
                        </p>
                        <p className="text-[11px] font-[#4a4a40] pt-1">
                          طول الوتر الفعلي (ج) = جذر {formatNum(sqC)} ≈ <span className="underline decoration-double">{formatNum(hypotenuse.toFixed(2))}</span> سم.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Return button */}
          <div className="text-center pt-4 border-t border-[#f5f5f0]">
            <button
              onClick={() => setActiveTab('study')}
              className="text-xs text-[#5A5A40] hover:underline font-bold inline-flex items-center gap-1"
            >
              <ArrowRight className="w-4 h-4" /> العودة لقراءة فصول الدرس وشرح المسائل
            </button>
          </div>
        </div>
      )}

      {activeTab === 'worksheets' && (
        <LessonWorksheets
          lesson={lesson}
          isArabicNumeral={isArabicNumeral}
          onBackToStudy={() => setActiveTab('study')}
        />
      )}
    </div>
  );
};
