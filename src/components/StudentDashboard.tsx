import React, { useState } from 'react';
import { Award, Zap, Star, Trophy, ArrowLeftRight, BookOpen, Smile, Sparkles, AlertCircle } from 'lucide-react';
import { StudentProgress, Achievement, Unit, ParentGoal } from '../types';
import { toEasternArabicNumerals } from '../curriculumData';

interface StudentDashboardProps {
  progress: StudentProgress;
  units: Unit[];
  achievements: Achievement[];
  parentGoals: ParentGoal[];
  onSelectUnit: (unitId: string) => void;
  isArabicNumeral: boolean;
  onResetProgress: () => void;
}

const AVATARS = [
  { id: '1', name: 'أحمد النابغة', emoji: '🧑‍🎓' },
  { id: '2', name: 'منى المتفوقة', emoji: '👩‍🎓' },
  { id: '3', name: 'عمر الذكي', emoji: '👦' },
  { id: '4', name: 'فاطمة العبقرية', emoji: '👧' },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  progress,
  units,
  parentGoals,
  achievements,
  onSelectUnit,
  isArabicNumeral,
  onResetProgress,
}) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(() => {
    return localStorage.getItem('sudanese_math_avatar_id') || '1';
  });

  const [customName, setCustomName] = useState<string>(() => {
    return localStorage.getItem('sudanese_math_custom_name') || '';
  });

  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  const saveAvatar = (id: string) => {
    setSelectedAvatarId(id);
    localStorage.setItem('sudanese_math_avatar_id', id);
  };

  const activeAvatar = AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0];
  const displayName = customName.trim() || activeAvatar.name;

  // Level names reflecting encouragement in Sudan
  const getLevelName = (lvl: number) => {
    if (lvl <= 1) return 'نجم البداية 🌟';
    if (lvl === 2) return 'نابغ الخلاوي والمدارس 📝';
    if (lvl === 3) return 'مستكشف الهندسة والرموز 📐';
    if (lvl === 4) return 'بروفيسور السادس الابتدائي 🎓';
    return 'عبقري الرياضيات السودانية 🏆';
  };

  // Calculate current unit score out of lessons
  const getUnitCompletionPercent = (unit: Unit) => {
    const totalLessons = unit.lessons.length;
    const completedCount = unit.lessons.filter((l) =>
      progress.completedLessons.includes(l.id)
    ).length;
    if (totalLessons === 0) return 0;
    return Math.round((completedCount / totalLessons) * 100);
  };

  const levelProgress = (progress.points % 100);

  return (
    <div id="student_dashboard_main" className="space-y-6">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl text-white p-6 shadow-xl border border-indigo-100/10">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-xl"></div>
        <div className="absolute left-0 bottom-0 -translate-x-12 translate-y-12 w-48 h-48 bg-emerald-500 rounded-full opacity-10 blur-xl"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-right">
            <div className="text-4xl p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-inner">
              ✨
            </div>
            <div>
              <span className="bg-white/10 text-xs px-2.5 py-1 rounded-full font-bold border border-white/10 inline-block mb-1">
                الصف السادس الابتدائي - المنهج السوداني
              </span>
              <h2 className="text-xl md:text-2xl font-black mt-1">
                مرحباً بك يا {displayName} في منصة الأرقام الذكية!
              </h2>
              <p className="text-sm text-indigo-100 mt-2 font-medium">
                رتب خطواتك، حل التمارين وتتبع مسيرتك المليئة بالثقافة والرياضيات.
              </p>
            </div>
          </div>

          {/* Gamified quick stats */}
          <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 text-center">
              <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1 animate-pulse" />
              <div className="font-extrabold text-lg">{formatNum(progress.points)}</div>
              <span className="text-[10px] text-indigo-100">درجة / نقطة</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 text-center">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 mx-auto mb-1" />
              <div className="font-extrabold text-lg">{formatNum(progress.stars)}</div>
              <span className="text-[10px] text-indigo-100">نجم الفهم</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/15 text-center">
              <Trophy className="w-5 h-5 text-rose-300 mx-auto mb-1" />
              <div className="font-extrabold text-lg">{formatNum(progress.streak)}</div>
              <span className="text-[10px] text-indigo-100">يوم متتالي</span>
            </div>
          </div>
        </div>

        {/* Level metrics bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-semibold text-xs text-indigo-150">المستـــوى الراقي:</span>
            <span className="text-xs bg-indigo-500 font-bold px-3 py-1 rounded-full">
              {formatNum(progress.level)}
            </span>
            <span className="text-xs text-amber-305 font-extrabold text-white">{getLevelName(progress.level)}</span>
          </div>
          <div className="w-full bg-black/20 rounded-full h-3.5 overflow-hidden border border-white/10 relative p-[2px]">
            <div
              className="bg-indigo-100 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(8, levelProgress))}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-indigo-50">
              {formatNum(levelProgress)} / {formatNum(100)} نقطة للارتقاء التالي
            </span>
          </div>
        </div>
      </div>

      {/* Parent goals notification (Smart reminders) */}
      {parentGoals.some((g) => !g.completed) && (
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-right flex-1">
            <h4 className="text-xs font-bold text-amber-900">واجب منزلي ذكي من ولي الأمر:</h4>
            <div className="mt-1 space-y-1">
              {parentGoals
                .filter((g) => !g.completed)
                .map((goal) => (
                  <p key={goal.id} className="text-xs text-amber-800 leading-relaxed">
                    ⏱️ {goal.goalText} ! (اجمع النقاط لتدخل قائمة المتفوقين)
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Select and Avatar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Curriculum selection lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-650" />
              أقسام المنهج الدراسي السوداني الرسمي
            </h3>
            <span className="text-xs text-slate-500">
              اكتمل {formatNum(progress.completedLessons.length)} / {formatNum(15)} درساً
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {units.map((unit) => {
              const compPercent = getUnitCompletionPercent(unit);
              return (
                <div
                  key={unit.id}
                  onClick={() => onSelectUnit(unit.id)}
                  id={`unit_card_${unit.id}`}
                  className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition duration-300 cursor-pointer text-right flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                      الوحدة {formatNum(unit.number)}
                    </span>
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center font-bold">
                      {formatNum(unit.number)}
                    </div>
                  </div>

                  <div className="mt-2">
                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-650 transition">
                      {unit.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      تحتوي على {formatNum(unit.lessons.length)} دروساً تفاعلية واختبارات لترتيب الفهم.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-650"></div>
                      <span className="text-[10px] font-bold text-slate-600">
                        {compPercent === 100 ? 'تم الإكمال بنجاح 🎉' : `اكتمل بنسبة ${formatNum(compPercent)}%`}
                      </span>
                    </div>

                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-650 h-full transition-all duration-300"
                        style={{ width: `${compPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar avatar chooser & Reward checklist */}
        <div className="space-y-6">
          {/* Avatar customized choosing */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-right">
            <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
              شخصية النابغة الخاصة بي
            </h3>
            <div className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
              <span className="text-3xl">{activeAvatar.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-indigo-900 truncate">{displayName}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">تلميذ نجيب بالسنة السادسة</p>
              </div>
            </div>

            {/* Renaming Input Block */}
            <div className="mt-3.5 space-y-1.5 text-right bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <label className="text-[10px] font-black text-slate-500 block">اكتب اسمك الحقيقي المسجّل بالمدرسة ✍️:</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomName(val);
                  localStorage.setItem('sudanese_math_custom_name', val);
                }}
                placeholder="مثال: منى محمد عثمان"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800 placeholder:text-slate-400 font-bold"
              />
              <span className="text-[9px] text-[#8e8e7a] block leading-normal">
                سيتم استخدام هذا الاسم في لوحة الشرف وفي نتائج رول التفوق والامتحانات المخصصة.
              </span>
            </div>

            <p className="text-[11px] text-slate-500 my-3 pt-1 border-t border-slate-50">هل تود تغيير رمزك للمدارس؟ اختر رمزاً:</p>
            <div className="grid grid-cols-2 gap-2">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => saveAvatar(avatar.id)}
                  className={`text-xs py-2 px-2 rounded-xl text-center border font-bold transition flex items-center justify-center gap-1.5 ${
                    selectedAvatarId === avatar.id
                      ? 'border-indigo-600 bg-indigo-100/10 text-indigo-650'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{avatar.emoji}</span>
                  <span className="text-[11px]">{avatar.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Gamified Achievements achievements checklists */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm text-right">
            <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>الأوسمة والميداليات الشرفية</span>
              <Award className="w-4 h-4 text-emerald-500" />
            </h3>

            <div className="space-y-3.5">
              {achievements.map((ach) => {
                const percent = Math.min(100, Math.round((ach.currentProgress / ach.maxProgress) * 100));
                const isUnlocked = ach.currentProgress >= ach.maxProgress;

                return (
                  <div key={ach.id} className="p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition">
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{ach.icon}</span>
                        <div>
                          <h4 className={`text-xs font-bold ${isUnlocked ? 'text-indigo-900' : 'text-slate-600'}`}>
                            {ach.title}
                          </h4>
                          <p className="text-[9px] text-slate-400 mt-1">{ach.description}</p>
                        </div>
                      </div>
                      <span className="text-[9.5px] font-black text-rose-500 whitespace-nowrap bg-rose-50 px-2 py-0.5 rounded-full shrink-0">
                        {formatNum(ach.pointsReward)}+ نقطة
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 whitespace-nowrap">
                        {formatNum(ach.currentProgress)} / {formatNum(ach.maxProgress)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset progress feature */}
          <div className="text-center">
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين كافة درجاتك وعودتك لبداية العام الدراسي؟')) {
                  onResetProgress();
                }
              }}
              className="text-[10px] text-slate-400 hover:text-rose-500 transition py-1 px-3 border border-dashed border-slate-200 rounded-lg"
            >
              إعادة تهيئة لوحة تلميذ الصف السـادس
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
