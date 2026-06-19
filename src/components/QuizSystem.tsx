import React, { useState } from 'react';
import { Award, Check, X, ArrowRight, RotateCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Question } from '../types';
import { toEasternArabicNumerals } from '../curriculumData';

interface QuizSystemProps {
  unitTitle: string;
  questions: Question[];
  isArabicNumeral: boolean;
  onQuizComplete: (scorePercentage: number) => void;
  onGoBack: () => void;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({
  unitTitle,
  questions,
  isArabicNumeral,
  onQuizComplete,
  onGoBack,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Array<{ qId: string; userAns: string; isCorrect: boolean }>>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  const activeQuestion = questions[currentIdx];

  const handleSelectOption = (opt: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || hasSubmitted) return;

    const isCorrect = selectedAnswer === activeQuestion.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setUserAnswers((prev) => [
      ...prev,
      { qId: activeQuestion.id, userAns: selectedAnswer, isCorrect },
    ]);

    setHasSubmitted(true);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setHasSubmitted(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      const pct = Math.round(( (score + (selectedAnswer === activeQuestion.correctAnswer ? 1 : 0)) / questions.length) * 100);
      onQuizComplete(pct);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedAnswer('');
    setHasSubmitted(false);
    setScore(0);
    setUserAnswers([]);
    setQuizFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-500">
        <AlertTriangle className="w-12 h-12 mx-auto text-amber-500 mb-3" />
        <p className="font-bold text-sm">عذراً، لا تتوفر اختبارات لهذه الوحدة حالياً.</p>
        <button onClick={onGoBack} className="mt-4 text-xs text-indigo-650 hover:underline">
          العودة للمناهج
        </button>
      </div>
    );
  }

  return (
    <div id="quiz_wrapper" className="max-w-2xl mx-auto space-y-6 text-right">
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onGoBack}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="text-xs text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg text-right cursor-pointer"
        >
          مغادرة الاختبار
        </motion.button>
        <span className="text-xs font-bold text-indigo-650">
          اختبار دوري: {unitTitle}
        </span>
      </div>

      {/* Screen 1: Quiz active status */}
      {!quizFinished ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
            <span className="text-[10px] font-bold text-slate-400">
              السؤال {formatNum(currentIdx + 1)} من أصل {formatNum(questions.length)}
            </span>
            <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-650 h-full transition-all duration-300"
                style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black text-indigo-500 tracking-wider">سؤال قياس الفهم:</span>
            <h3 className="font-extrabold text-sm md:text-base text-slate-800 leading-relaxed">
              {formatNum(activeQuestion.text)}
            </h3>
          </div>

          {/* Question Options or Text Inputs */}
          {activeQuestion.options && activeQuestion.options.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {activeQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedAnswer === opt;
                let optStyle = 'border-slate-100 hover:border-indigo-150 hover:bg-slate-50';

                if (hasSubmitted) {
                  if (opt === activeQuestion.correctAnswer) {
                    optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-extrabold shadow-sm';
                  } else if (isSelected) {
                    optStyle = 'border-rose-300 bg-rose-50 text-rose-800';
                  } else {
                    optStyle = 'border-slate-100 opacity-60';
                  }
                } else if (isSelected) {
                  optStyle = 'border-indigo-650 bg-indigo-50/50 text-indigo-800 font-bold';
                }

                // Interactive animations on click/feedback: Pulse if correct on submit, Shake if wrong on submit, click scale contraction
                let animateState: any = {};
                if (hasSubmitted) {
                  if (isSelected) {
                    if (selectedAnswer === activeQuestion.correctAnswer) {
                      animateState = { scale: [1, 1.05, 0.95, 1.03, 1], transition: { duration: 0.4 } };
                    } else {
                      animateState = { x: [0, -8, 8, -6, 6, -4, 4, 0], transition: { duration: 0.5 } };
                    }
                  } else if (opt === activeQuestion.correctAnswer) {
                    animateState = { scale: [1, 1.02, 1], transition: { duration: 0.3, delay: 0.1 } };
                  }
                } else if (isSelected) {
                  animateState = { scale: [1, 1.02, 1], transition: { duration: 0.2 } };
                }

                return (
                  <motion.button
                    key={oIdx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={hasSubmitted}
                    animate={animateState}
                    whileHover={!hasSubmitted ? { scale: 1.015, x: -4, transition: { duration: 0.2 } } : {}}
                    whileTap={!hasSubmitted ? { scale: 0.97, transition: { duration: 0.1 } } : {}}
                    className={`p-4 rounded-xl border text-right text-xs flex items-center justify-between cursor-pointer select-none ${optStyle}`}
                  >
                    <span>{formatNum(opt)}</span>
                    <span className="font-mono text-[10px] text-slate-400">
                      خيار {formatNum(oIdx + 1)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Explanatory validation popup on submit */}
          {hasSubmitted && (
            <div className={`p-4 rounded-2xl border ${
              selectedAnswer === activeQuestion.correctAnswer
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50/50 border-rose-200 text-rose-950'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                {selectedAnswer === activeQuestion.correctAnswer ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                )}
                <h4 className="font-bold text-xs">
                  {selectedAnswer === activeQuestion.correctAnswer ? 'إجابة مذهلة وصحيحة!' : 'إجابة غير صحيحة، لا تقلق!'}
                </h4>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-700">
                <span className="font-bold">مفتاح الفهم:</span> {formatNum(activeQuestion.explanation)}
              </p>
            </div>
          )}

          {/* Control bottom state */}
          <div className="pt-4 border-t border-slate-50 flex items-center justify-end gap-3">
            {!hasSubmitted ? (
              <motion.button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
                whileHover={selectedAnswer ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer ? { scale: 0.97 } : {}}
                className={`text-xs px-6 py-3 rounded-xl font-bold transition cursor-pointer ${
                  selectedAnswer
                    ? 'bg-indigo-650 text-white shadow-md'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                تأكيد الإجابة والتحقق من الحل
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNextQuestion}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="bg-indigo-650 hover:bg-indigo-750 text-white text-xs px-6 py-3 rounded-xl font-bold shadow-md cursor-pointer"
              >
                {currentIdx + 1 < questions.length ? 'السؤال التالي 👈' : 'إنهاء الاختبار وإرشاد النتائج'}
              </motion.button>
            )}
          </div>
        </div>
      ) : (
        /* Screen 2: Quiz Finished, Score display and analytics report */
        <div id="quiz_report_screen" className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6 text-center">
          <div className="relative inline-block py-2">
            <span className="text-5xl">🏆</span>
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs px-2 py-0.5 rounded-full font-bold text-slate-900 border-2 border-white">
              ممتاز
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-black text-lg text-slate-800">اكتمل اختبار {unitTitle}!</h3>
            <p className="text-xs text-slate-500">
              لقد سجلت {formatNum(score)} إجابة صحيحة من أصل {formatNum(questions.length)} أسئلة.
            </p>
          </div>

          {/* Circle scoring rate metric */}
          {(() => {
            const finalPct = Math.round((score / questions.length) * 100);
            return (
              <div className="bg-slate-50 p-6 rounded-2xl max-w-sm mx-auto border border-slate-100 space-y-3">
                <div className="text-3xl font-black text-indigo-650">{formatNum(finalPct)}%</div>
                <h4 className="font-bold text-xs text-slate-800">تحليل الأداء للأستاذ وأولياء الأمور:</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {finalPct >= 80
                    ? 'تحصيل ممتاز يستحق لوحة الشرف! تلميذ رائد ولديه فهم عميق بالمنهج.'
                    : finalPct >= 50
                    ? 'تحصيل جيد جداً، لديك بعض نقاط الضعف البسيطة. قم بمراجعة الفصول التفاعلية مجدداً.'
                    : 'تحصيل يحتاج لمزيد من المذاكرة والمحاكاة التفاعلية بالتأكيد. المعلم الافتراضي متاح لمساعدتك!'}
                </p>
              </div>
            );
          })()}

          {/* Step summary checklist */}
          <div className="max-w-md mx-auto divide-y divide-slate-100 bg-white/70 rounded-2xl border border-slate-100 text-right">
            {questions.map((q, idx) => {
              const ansCheck = userAnswers.find((ans) => ans.qId === q.id);
              return (
                <div key={q.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 max-w-[80%]">
                    <p className="font-bold text-slate-800 truncate">س {formatNum(idx + 1)}: {q.text}</p>
                    <p className="text-[10px] text-slate-400">الإجابة الصحيحة: {q.correctAnswer}</p>
                  </div>
                  {ansCheck?.isCorrect ? (
                    <span className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> صحيحة
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-800 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> خاطئة
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action bottom actions bar */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="text-xs text-slate-600 hover:text-slate-800 font-bold bg-slate-100 py-3 px-5 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-4 h-4 ml-1" /> إعادة المحاولة
            </motion.button>
            <motion.button
              onClick={onGoBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="text-xs text-white bg-indigo-650 hover:bg-indigo-750 font-bold py-3 px-6 rounded-xl shadow-md cursor-pointer"
            >
              الذهاب للقائمة الرئيسية
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
