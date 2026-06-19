import React, { useState } from 'react';
import { Shield, Lock, Award, Key, Play, Plus, Trash, Check, FileText } from 'lucide-react';
import { StudentProgress, Unit, ParentGoal } from '../types';
import { toEasternArabicNumerals } from '../curriculumData';

interface ParentDashboardProps {
  progress: StudentProgress;
  units: Unit[];
  parentGoals: ParentGoal[];
  onAddGoal: (goalText: string, pointsTarget: number) => void;
  onRemoveGoal: (id: string) => void;
  isArabicNumeral: boolean;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  progress,
  units,
  parentGoals,
  onAddGoal,
  onRemoveGoal,
  isArabicNumeral,
}) => {
  const [parentPin, setParentPin] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<boolean>(false);

  // New goal input values
  const [newGoalText, setNewGoalText] = useState<string>('');
  const [targetPoints, setTargetPoints] = useState<number>(100);

  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  // Pre-determined correct Pin code is simple "1234"
  const handleVerifyPin = () => {
    if (parentPin === '1234') {
      setIsUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setIsUnlocked(false);
    }
  };

  const handleAddNewGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    onAddGoal(newGoalText, targetPoints);
    setNewGoalText('');
  };

  // Determine strengths & weaknesses based on completion percent of lessons
  const analyticsReport = units.map((unit) => {
    const completedCount = unit.lessons.filter((l) =>
      progress.completedLessons.includes(l.id)
    ).length;
    const ratio = unit.lessons.length ? completedCount / unit.lessons.length : 0;
    const percent = Math.round(ratio * 100);

    let levelLabel = 'لم يتم البدء بعد ⏳';
    let levelColor = 'text-slate-400 bg-slate-50';

    if (percent > 80) {
      levelLabel = 'نقطة قوة ممتازة 🚀';
      levelColor = 'text-emerald-800 bg-emerald-50';
    } else if (percent > 40) {
      levelLabel = 'أداء مستقر وجيد 👍';
      levelColor = 'text-blue-800 bg-blue-50';
    } else if (percent > 0) {
      levelLabel = 'يحتاج لمزيد من المراجعة والتدريب ⚠️';
      levelColor = 'text-amber-800 bg-amber-50';
    }

    return {
      unitId: unit.id,
      title: unit.title,
      percentStr: `${percent}%`,
      percent,
      label: levelLabel,
      colorClass: levelColor,
    };
  });

  return (
    <div id="parent_dashboard_container" className="max-w-3xl mx-auto space-y-6 text-right">
      {/* Screen 1: Pin locked entry */}
      {!isUnlocked ? (
        <div id="pin_locked_screen" className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl max-w-md mx-auto text-center space-y-6">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-base text-slate-800">بوابة المتابعة الشرفية لأولياء الأمور</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              يرجى إدخال رمز المرور العائلي المسجل مسبقاً للدخول وتعديل أهداف الدراسة والواجبات.
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              placeholder="أدخل الرمز الافتراضي (١٢٣٤)"
              value={parentPin}
              onChange={(e) => setParentPin(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 text-center font-bold tracking-widest text-slate-700 bg-slate-50 focus:bg-white transition"
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
            />

            {pinError && (
              <p className="text-[10px] text-rose-500 font-bold bg-rose-50 p-2 rounded-lg">
                ❌ رمز المرور خاطئ! جرب إدخال الرمز الرقمي الافتراضي: 1234
              </p>
            )}

            <button
              onClick={handleVerifyPin}
              className="w-full bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs py-4 rounded-xl shadow-md transition"
            >
              فك قفل الإعدادات العائلية
            </button>
          </div>

          <div className="pt-2 text-[10px] text-slate-400">
            * هذا لحماية معدلات طفلك والواجبات من التعديل العشوائي. الرمز الافتراضي هو: <span className="font-mono font-bold">1234</span>
          </div>
        </div>
      ) : (
        /* Screen 2: Parent Panel unlocked fully */
        <div id="parent_dashboard_main" className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-base md:text-lg font-black text-slate-850 flex items-center gap-2">
                🛡️ لوحة توجيه ومراقبة ولي الأمر
              </h2>
              <p className="text-xs text-slate-450 text-slate-500 mt-1">
                تتبع كفاءة طفلك بجميع فصول المنهج السوداني واكتب أهداف الواجب المنزلي.
              </p>
            </div>

            <button
              onClick={() => {
                setIsUnlocked(false);
                setParentPin('');
              }}
              className="text-xs bg-slate-50 text-slate-500 hover:text-rose-500 px-4 py-2 border border-slate-100 rounded-xl transition"
            >
              إعادة قفل لوحة ولي الأمر
            </button>
          </div>

          {/* Quick Statistics details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 text-right space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">الدروس التي تم إنجازها</span>
              <div className="text-xl font-black text-indigo-650">
                {formatNum(progress.completedLessons.length)} / {formatNum(15)} درساً
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                مستوى الاستجابة العام ممتاز ومترابط.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 text-right space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">الحصيلة التراكمية الكلية</span>
              <div className="text-xl font-black text-amber-500">
                {formatNum(progress.points)} نقطة
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                معدل تجميع النجوم: {formatNum(progress.stars)} نجمة شرفية.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 text-right space-y-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">الأيام المتتالية للنشاط</span>
              <div className="text-xl font-black text-rose-500">
                {formatNum(progress.streak)} أيام متواصلة
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                مؤشر رائع للمداومة اليومية.
              </p>
            </div>
          </div>

          {/* Strength and Weaknesses analytical charts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              📈 تقرير تحليل الكفاءة ونقاط القوة والضعف للأداء الأكاديمي
            </h3>

            <div className="divide-y divide-slate-100">
              {analyticsReport.map((rep) => (
                <div key={rep.unitId} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-slate-850">{rep.title}</h4>
                    <span className={`text-[10px] inline-block font-bold px-2 py-0.5 rounded ${rep.colorClass}`}>
                      {rep.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <span className="text-xs font-black text-indigo-650 min-w-[50px] text-left">
                      {formatNum(rep.percent)}%
                    </span>
                    <div className="w-36 bg-slate-100 h-2.5 rounded-full overflow-hidden shrink-0">
                      <div
                        className="bg-indigo-650 h-full rounded-full transition-all duration-300"
                        style={{ width: `${rep.percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Write Homework Alerts & Custom Guidelines */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-sm">
              🎯 أضف تكليفاً تاديبياً أو واجباً دراسياً لطفلك (تنبيهات ذكية):
            </h3>

            <form onSubmit={handleAddNewGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">نص الواجب (مثال: أكمل مراجعة مساحة المثلث):</label>
                  <input
                    type="text"
                    placeholder="امتحان الوحدة الرابعة والتعابير الجبرية..."
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-150 focus:bg-white text-right"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">النقاط المستهدفة للطفل عند الإكمال:</label>
                  <input
                    type="number"
                    value={targetPoints}
                    onChange={(e) => setTargetPoints(parseInt(e.target.value))}
                    className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-150 focus:bg-white text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-indigo-650 hover:bg-indigo-750 text-white text-xs px-6 py-3 rounded-xl font-bold flex items-center gap-1.5 shadow-md transition mr-auto"
              >
                <Plus className="w-4 h-4 ml-1" /> اعتماد وإرسال كشعار للطفل
              </button>
            </form>

            {/* List active goals */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-bold text-xs text-indigo-950">التكاليف المنزلية المعتمدة حالياً:</h4>
              {parentGoals.length === 0 ? (
                <p className="text-[11px] text-slate-400">لا توجد تكاليف خاصة مسجلة حالياً، استخدم النموذج للتكليف بواجب.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {parentGoals.map((goal) => (
                    <div key={goal.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`p-1 rounded-md text-[10px] font-bold ${
                          goal.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {goal.completed ? 'مكتمل بنجاح!' : 'تحت العمل'}
                        </span>
                        <p className="text-[11px] text-slate-700 font-semibold">{goal.goalText}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-indigo-650">{formatNum(goal.targetPoints)} نقطة شرف</span>
                        <button
                          onClick={() => onRemoveGoal(goal.id)}
                          className="p-1 px-2 border border-slate-200 text-slate-400 hover:text-rose-500 rounded bg-white hover:bg-rose-50 transition"
                        >
                          حذف التكليف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
