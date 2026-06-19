import { useState, useEffect } from 'react';
import {
  Layers,
  Percent,
  Calculator,
  User,
  Bell,
  MessageCircle,
  Home,
  BookOpen,
  Award,
  Shield,
  Wifi,
  Smartphone,
  Eye,
  Check,
  Star,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ClipboardList,
  Sparkles,
  Brain,
  Gamepad2
} from 'lucide-react';

import { curriculumData, toEasternArabicNumerals } from './curriculumData';
import { generateCustomQuiz } from './utils/quizGenerator';
import { StudentProgress, Notification, ParentGoal, Achievement, Unit, Lesson } from './types';

// Importing Custom Subcomponents
import { StudentDashboard } from './components/StudentDashboard';
import { LessonView } from './components/LessonView';
import { QuizSystem } from './components/QuizSystem';
import { ParentDashboard } from './components/ParentDashboard';
import { VirtualTeacher } from './components/VirtualTeacher';
import { NotificationDrawer } from './components/NotificationDrawer';
import { MathGames } from './components/MathGames';

// Pre-defined Achievements list
const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_lessons_3',
    title: 'تلميذ مواهب مجتهد',
    description: 'أكمل دراسة ٣ دروس من كتاب الرياضيات بنجاح',
    icon: '📚',
    pointsReward: 100,
    maxProgress: 3,
    currentProgress: 0,
  },
  {
    id: 'ach_points_500',
    title: 'جامع الكنوز البرونزية',
    description: 'احصل على ٥٠٠ درجة تفوق في المنصة الدراسية',
    icon: '💎',
    pointsReward: 200,
    maxProgress: 500,
    currentProgress: 0,
  },
  {
    id: 'ach_quiz_100',
    title: 'علامة المائة الكاملة',
    description: 'سجل درجة كاملة ١٠٠% في أي اختبار دوري للمنهج',
    icon: '🔥',
    pointsReward: 300,
    maxProgress: 1,
    currentProgress: 0,
  },
  {
    id: 'ach_goals_parent',
    title: 'رضا الوالدين فوز كبير',
    description: 'أنجز أول واجب دراسي يكلفك به ولي الأمر',
    icon: '💖',
    pointsReward: 150,
    maxProgress: 1,
    currentProgress: 0,
  },
];

export default function App() {
  // Config States
  const [isArabicNumeral, setIsArabicNumeral] = useState<boolean>(() => {
    return localStorage.getItem('sudanese_math_num_format') === 'arabic';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sudanese_math_dark_mode') === 'true';
  });

  // Database States
  const [progress, setProgress] = useState<StudentProgress>(() => {
    const saved = localStorage.getItem('sudanese_math_progress');
    if (saved) return JSON.parse(saved);
    return {
      points: 80, // give some initial starting points for visual juice
      stars: 3,
      streak: 2,
      level: 1,
      completedLessons: [],
      unitScores: {},
      completedQuizzes: {},
      lastStudyDate: new Date().toISOString().split('T')[0],
    };
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('sudanese_math_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'welcome_alert',
        title: 'أهلاً بك يا بطل في دوري التفوق! 🇸🇩',
        message: 'تم تفعيل وضع الدراسة دون اتصال بالإنترنت بنجاح. يمكنك المذاكرة، قراءة الأمثلة وحل التمارين التفاعلية وحفظ درجاتك أينما كنت بالسودان!',
        date: 'تحذير اليوم',
        read: false,
        type: 'success',
      },
    ];
  });

  const [parentGoals, setParentGoals] = useState<ParentGoal[]>(() => {
    const saved = localStorage.getItem('sudanese_math_parent_goals');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('sudanese_math_achievements');
    if (saved) return JSON.parse(saved);
    return INITIAL_ACHIEVEMENTS;
  });

  // Navigation states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'quizzes' | 'parents' | 'teacher' | 'games'>('dashboard');
  const [selectedUnitIdStr, setSelectedUnitIdStr] = useState<string | null>(null);
  const [selectedLessonIdStr, setSelectedLessonIdStr] = useState<string | null>(null);
  const [activeQuizUnitIdStr, setActiveQuizUnitIdStr] = useState<string | null>(null);

  // Customized Quiz Generator States
  const [quizScope, setQuizScope] = useState<'all' | 'unit' | 'lesson'>('all');
  const [quizTargetUnitId, setQuizTargetUnitId] = useState<string>('unit_1');
  const [quizTargetLessonId, setQuizTargetLessonId] = useState<string>('u1_l1');
  const [quizQuestionCount, setQuizQuestionCount] = useState<number>(10);
  const [customQuizQuestions, setCustomQuizQuestions] = useState<any[] | null>(null);
  const [customQuizTitle, setCustomQuizTitle] = useState<string>('');

  // Toggle UI Drawers
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [alertMessageStr, setAlertMessageStr] = useState<string | null>(null);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('sudanese_math_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('sudanese_math_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sudanese_math_parent_goals', JSON.stringify(parentGoals));
  }, [parentGoals]);

  useEffect(() => {
    localStorage.setItem('sudanese_math_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('sudanese_math_num_format', isArabicNumeral ? 'arabic' : 'english');
  }, [isArabicNumeral]);

  useEffect(() => {
    localStorage.setItem('sudanese_math_dark_mode', isDarkMode ? 'true' : 'false');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Utility to convert number printing format across entire app
  const printNum = (num: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(num) : num.toString();
  };

  const handleStartCustomQuiz = () => {
    let titleStr = '';
    if (quizScope === 'all') {
      titleStr = 'كامل المنهج الدراسي';
    } else if (quizScope === 'unit') {
      const u = curriculumData.find((item) => item.id === quizTargetUnitId);
      titleStr = `اختبار الوحدة: ${u ? u.title : ''}`;
    } else {
      const u = curriculumData.find((item) => item.id === quizTargetUnitId);
      const l = u?.lessons.find((item) => item.id === quizTargetLessonId);
      titleStr = `اختبار درس: ${l ? l.title : ''}`;
    }

    const generated = generateCustomQuiz({
      scope: quizScope,
      unitId: quizTargetUnitId,
      lessonId: quizScope === 'lesson' ? quizTargetLessonId : undefined,
      count: quizQuestionCount,
    });

    setCustomQuizTitle(titleStr);
    setCustomQuizQuestions(generated);
  };

  // Gamification: points to level up mapping
  const pointsNeededForNextLevel = progress.level * 150;

  const pushNotification = (title: string, message: string, type: 'info' | 'success' | 'alert' | 'parent-goal') => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      date: new Date().toLocaleTimeString('ar-SD', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Complete a Study Lesson Handler
  const handleLessonComplete = (lessonId: string) => {
    if (progress.completedLessons.includes(lessonId)) return;

    const newCompleted = [...progress.completedLessons, lessonId];
    const rewardedPoints = progress.points + 25;
    const rewardedStars = progress.stars + 1;

    // Check level up
    let currentLvl = progress.level;
    const needed = currentLvl * 150;
    if (rewardedPoints >= needed) {
      currentLvl += 1;
      pushNotification(
        '🏆 تهانينا! ارتقيت إلى مرتبة أعلى!',
        `أحسنت المساعي! لقد ارتقيت إلى المستوى الأكاديمي الرقم (${printNum(currentLvl)}) وصارت معلوماتك ممتازة!`,
        'success'
      );
    }

    setProgress((prev) => ({
      ...prev,
      completedLessons: newCompleted,
      points: rewardedPoints,
      stars: rewardedStars,
      level: currentLvl,
    }));

    // Update achievements on lesson completions
    setAchievements((prevAch) =>
      prevAch.map((ach) => {
        if (ach.id === 'ach_lessons_3') {
          const newProg = Math.min(ach.maxProgress, newCompleted.length);
          return { ...ach, currentProgress: newProg };
        }
        if (ach.id === 'ach_points_500') {
          return { ...ach, currentProgress: Math.min(ach.maxProgress, rewardedPoints) };
        }
        return ach;
      })
    );

    pushNotification(
      '🌟 درس جديد اكتمل بنجاح',
      `لقد أتممت دراسة الفصول والمفاهيم بنجاح وحصلت على ٢٥ نقطة جديدة ونجمة استحقاق!`,
      'info'
    );
  };

  // Complete a Topic Test Quiz Handler
  const handleQuizComplete = (scorePercentage: number) => {
    // Record scores database
    const currentQuizUnit = activeQuizUnitIdStr || 'custom_quiz';
    const oldScore = progress.completedQuizzes[currentQuizUnit] || 0;
    const newlyCompletedQuizzes = {
      ...progress.completedQuizzes,
      [currentQuizUnit]: Math.max(oldScore, scorePercentage),
    };

    const rewardedPoints = progress.points + 50; // extra bonus points for tests
    const rewardedStars = progress.stars + 2;

    setProgress((prev) => ({
      ...prev,
      completedQuizzes: newlyCompletedQuizzes,
      points: rewardedPoints,
      stars: rewardedStars,
    }));

    // Check custom achievements
    setAchievements((prevAch) =>
      prevAch.map((ach) => {
        if (ach.id === 'ach_quiz_100' && scorePercentage === 100) {
          return { ...ach, currentProgress: 1 };
        }
        if (ach.id === 'ach_points_500') {
          return { ...ach, currentProgress: Math.min(ach.maxProgress, rewardedPoints) };
        }
        return ach;
      })
    );

    // If there is any parent study goal active demanding points, complete it!
    setParentGoals((prevGoals) =>
      prevGoals.map((g) => {
        if (!g.completed && rewardedPoints >= g.targetPoints) {
          pushNotification(
            '💖 بارك الله فيك! أكملت واجب ولي أمرك',
            `لقد حققت الهدف الأكاديمي المطلوب لتكليفك المنزلي: "${g.goalText}" بجد ومثابرة واكتسبت أوسمة شجاعة ورضا عائلي كامل!`,
            'success'
          );
          // Unlock parent target achievement
          setAchievements((prevAc) =>
            prevAc.map((ac) => {
              if (ac.id === 'ach_goals_parent') return { ...ac, currentProgress: 1 };
              return ac;
            })
          );
          return { ...g, completed: true };
        }
        return g;
      })
    );

    pushNotification(
      '📝 تم تسجيل درجات اختبارك الأكاديمي!',
      `لقد تم تدوين رصيد نتيجتك المقدرة بـ (${printNum(scorePercentage)}%) لدى لوحة تحكم عائلتك لقياس مدى التطور المستمر ونقاط القوة والضعف.`,
      'success'
    );
  };

  // Award Points for Educational Interactive Games
  const handleAwardPoints = (additionalPoints: number) => {
    const rewardedPoints = progress.points + additionalPoints;
    let currentLvl = progress.level;
    const needed = currentLvl * 150;
    if (rewardedPoints >= needed) {
      currentLvl += 1;
      pushNotification(
        '🏆 تهانينا! ارتقيت إلى مرتبة أعلى!',
        `أحسنت المساعي! لقد ارتقيت إلى المستوى الأكاديمي الرقم (${printNum(currentLvl)}) بسبب تفوقك في المعامل والمسابقات التنشيطية!`,
        'success'
      );
    }
    setProgress((prev) => ({
      ...prev,
      points: rewardedPoints,
      level: currentLvl
    }));

    setAchievements((prevAch) =>
      prevAch.map((ach) => {
        if (ach.id === 'ach_points_500') {
          return { ...ach, currentProgress: Math.min(ach.maxProgress, rewardedPoints) };
        }
        return ach;
      })
    );
  };

  // Create customized Parent Goals Alerts
  const handleAddParentGoal = (goalText: string, targetPoints: number) => {
    const newGoal: ParentGoal = {
      id: `p_goal_${Date.now()}`,
      goalText,
      targetUnitId: 'unit_1',
      targetPoints,
      completed: false,
      createdAt: new Date().toLocaleDateString('ar-SD'),
    };
    setParentGoals((prev) => [newGoal, ...prev]);

    // Push immediate Alert warning notification to Child board
    pushNotification(
      '⚠️ تكليف واجب منزلي جديد من والديك!',
      `يرجى المذاكرة وحل التمارين الآن لتحقيق الهدف: "${goalText}" والحصول على (${printNum(targetPoints)}) نقطة المطلوبة!`,
      'parent-goal'
    );
  };

  const handleRemoveParentGoal = (id: string) => {
    setParentGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleResetAllProgress = () => {
    localStorage.removeItem('sudanese_math_progress');
    localStorage.removeItem('sudanese_math_notifications');
    localStorage.removeItem('sudanese_math_parent_goals');
    localStorage.removeItem('sudanese_math_achievements');
    window.location.reload();
  };

  // Find details for active studied unit
  const activeUnit = curriculumData.find((u) => u.id === selectedUnitIdStr);
  const activeLesson = activeUnit?.lessons.find((l) => l.id === selectedLessonIdStr);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-right relative flex flex-col" dir="rtl">
      {/* Upper Status strip for Offline Verification and Custom Options */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-[10px] md:text-xs flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold shrink-0">
          <Wifi className="w-3.5 h-3.5" />
          <span>وضع المدارس الأوفلاين: نشط ✔️ (بياناتك محفوظة محلياً)</span>
        </div>
        <div className="hidden md:block text-slate-400 font-medium">
          🇸🇩 وزارة التربية والتعليم - وزارة المناهج والبحث التربوي بخت الرضا
        </div>
        <div className="flex items-center gap-3">
          {/* Numbers type selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-450 hover:text-white cursor-pointer transition select-none flex items-center gap-1" onClick={() => setIsArabicNumeral(!isArabicNumeral)}>
              <Settings className="w-3 h-3 text-indigo-400" />
              نمط الأرقام: <span className="font-extrabold text-[#8e8e7a] text-indigo-400">{isArabicNumeral ? 'أرقام عربية (١٢٣)' : 'أرقام إنجليزية (123)'}</span>
            </span>
          </div>

          {/* Dark Mode toggler */}
          <div className="flex items-center gap-1 border-r border-slate-750 border-slate-800 pr-3 mr-1">
            <span className="text-slate-450 hover:text-white cursor-pointer transition select-none flex items-center gap-1.5" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isDarkMode ? 'الوضع المضيء ☀️' : 'الدراسة الليلية 🌙'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Educational Application Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black text-sm md:text-lg text-slate-850">الرياضيات الذكية للمنهج السوداني</h1>
              <p className="text-[10px] text-slate-400 font-bold">الصف السادس الابتدائي - المرحلة الابتدائية 📐</p>
            </div>
          </div>

          {/* Center Navbar tabs for Student/Parent routing */}
          <nav className="hidden lg:flex items-center gap-1 text-slate-600 font-extrabold text-xs">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedUnitIdStr(null);
                setSelectedLessonIdStr(null);
                setActiveQuizUnitIdStr(null);
              }}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl transition ${
                activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Home className="w-4 h-4" /> الرئيسية
            </button>
            <button
              onClick={() => {
                setActiveTab('lessons');
                setSelectedLessonIdStr(null);
                setActiveQuizUnitIdStr(null);
              }}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl transition ${
                activeTab === 'lessons' ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" /> فصول الدروس
            </button>
            <button
              onClick={() => {
                setActiveTab('quizzes');
                setSelectedUnitIdStr(null);
                setSelectedLessonIdStr(null);
              }}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl transition ${
                activeTab === 'quizzes' ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Award className="w-4 h-4" /> اختبارات دورية
            </button>
            <button
              onClick={() => {
                setActiveTab('games');
                setSelectedUnitIdStr(null);
                setSelectedLessonIdStr(null);
                setActiveQuizUnitIdStr(null);
              }}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl transition ${
                activeTab === 'games' ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Gamepad2 className="w-4 h-4" /> ألعاب وتسلية 🎮
            </button>
            <button
              onClick={() => {
                setActiveTab('teacher');
                setSelectedUnitIdStr(null);
                setSelectedLessonIdStr(null);
                setActiveQuizUnitIdStr(null);
              }}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl transition ${
                activeTab === 'teacher' ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" /> المعلم الافتراضي
            </button>
            <button
              onClick={() => {
                setActiveTab('parents');
                setSelectedUnitIdStr(null);
                setSelectedLessonIdStr(null);
                setActiveQuizUnitIdStr(null);
              }}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl transition ${
                activeTab === 'parents' ? 'bg-indigo-50 text-indigo-650' : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" /> أولياء الأمور
            </button>
          </nav>

          {/* Quick status bar on right with notification alerts triggers */}
          <div className="flex items-center gap-2">
            {/* Quick score tracker */}
            <div className="bg-slate-50 rounded-xl py-1.5 px-3 border border-slate-100 hidden md:flex items-center gap-1 text-[11px] font-bold text-slate-600">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>النقاط: {printNum(progress.points)}</span>
            </div>

            {/* Notification Drawer Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition bg-white"
              >
                <Bell className="w-4.5 h-4.5 text-slate-600" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Drawer Dropdown overlay absolute */}
              {showNotifications && (
                <div className="absolute left-0 mt-2 z-50 w-80 md:w-96">
                  <NotificationDrawer
                    notifications={notifications}
                    onMarkAsRead={(id) => {
                      setNotifications((prev) =>
                        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                      );
                    }}
                    onClearAll={() => setNotifications([])}
                    isArabicNumeral={isArabicNumeral}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container screen area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* TAB 1: Main Dashboard (Default) */}
        {activeTab === 'dashboard' && !selectedUnitIdStr && (
          <StudentDashboard
            progress={progress}
            units={curriculumData}
            parentGoals={parentGoals}
            achievements={achievements}
            onSelectUnit={(unitId) => {
              setSelectedUnitIdStr(unitId);
              setActiveTab('lessons');
            }}
            isArabicNumeral={isArabicNumeral}
            onResetProgress={handleResetAllProgress}
          />
        )}

        {/* TAB 2: Lessons Explorer View */}
        {activeTab === 'lessons' && (
          <div>
            {!selectedUnitIdStr ? (
              // Unit selection layout list
              <div className="space-y-6">
                <div className="text-right">
                  <h3 className="font-extrabold text-slate-800 text-base">منهج الرياضيات الدراسي - تصفح الوحدات</h3>
                  <p className="text-xs text-slate-500">اختر إحدى الوحدات التعليمية السبعة في منهج السودان لحل تمارينها ومحاكاتها الحية.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {curriculumData.map((unit) => {
                    const complCount = unit.lessons.filter((l) => progress.completedLessons.includes(l.id)).length;
                    return (
                      <div
                        key={unit.id}
                        onClick={() => setSelectedUnitIdStr(unit.id)}
                        className="bg-white p-5 rounded-2xl border border-slate-120 hover:border-indigo-200 transition cursor-pointer text-right flex flex-col justify-between hover:shadow-sm"
                      >
                        <div>
                          <span className="text-[10px] font-black bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded-md inline-block">
                            الوحدة {printNum(unit.number)}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-850 mt-2">
                            {unit.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-1 lines-2">
                            تحتوي على {printNum(unit.lessons.length)} موضوعاً مفصلاً.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-50 mt-4 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                          <span>الدروس المكتملة:</span>
                          <span className="text-indigo-655 font-black text-indigo-650">
                            {printNum(complCount)} / {printNum(unit.lessons.length)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : !selectedLessonIdStr ? (
              // Inside selected Unit -> Display lessons lists
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] bg-indigo-50 text-indigo-650 px-2 py-0.5 rounded font-bold">
                      الوحدة {printNum(activeUnit!.number)}
                    </span>
                    <h3 className="font-extrabold text-slate-800 text-sm md:text-base mt-1">منهج {activeUnit!.title}</h3>
                  </div>

                  <button
                    onClick={() => setSelectedUnitIdStr(null)}
                    className="text-xs text-slate-500 hover:text-indigo-650 font-semibold"
                  >
                    ← العودة لقائمة الوحدات
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Left layout checklist lessons */}
                  <div className="lg:col-span-3 space-y-3">
                    {activeUnit!.lessons.map((les, lIndex) => {
                      const complete = progress.completedLessons.includes(les.id);
                      return (
                        <div
                          key={les.id}
                          className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right hover:border-indigo-150 transition"
                        >
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-400 block font-bold">الدرس {printNum(lIndex + 1)}</span>
                            <h4 className="font-extrabold text-xs md:text-sm text-slate-800">{les.title}</h4>
                            <p className="text-[11px] text-slate-500">{les.description}</p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                            <button
                              onClick={() => setSelectedLessonIdStr(les.id)}
                              className="bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-indigo-650 text-[10px] py-1.5 px-3 rounded-lg font-bold"
                            >
                              دراسة ومحاكاة تفاعلية
                            </button>
                            {complete && (
                              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">
                                مكتمل ✔️
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right layout sidebar information (Quiz and summary) */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-gradient-to-br from-indigo-650 to-indigo-800 rounded-3xl p-5 text-white text-right space-y-3 shadow-md">
                      <h4 className="font-black text-xs">هل أنت مستعد لقياس مستواك؟</h4>
                      <p className="text-[11px] text-indigo-100 leading-relaxed font-medium">
                        بعد الفراغ من دراسة دروس {activeUnit!.title}، يمكنك بدء الاختبار الدوري الرسمي لتسجيل مستواك ونقاط قوتك الشرفية.
                      </p>
                      <button
                        onClick={() => {
                          setActiveQuizUnitIdStr(activeUnit!.id);
                          setActiveTab('quizzes');
                        }}
                        className="w-full bg-white text-indigo-900 font-extrabold text-xs py-3 rounded-xl hover:bg-slate-50 transition shadow-inner"
                      >
                        ✍️ ابدأ اختبار الوحدة الآن
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Actual Lesson slide detailed study
              <LessonView
                lesson={activeLesson!}
                progress={progress}
                onLessonComplete={handleLessonComplete}
                onGoBack={() => setSelectedLessonIdStr(null)}
                isArabicNumeral={isArabicNumeral}
              />
            )}
          </div>
        )}

        {/* TAB 3: Quizzes periodic testing screen */}
        {activeTab === 'quizzes' && (
          <div>
            {customQuizQuestions ? (
              // Custom Quiz Active Screen
              <QuizSystem
                unitTitle={customQuizTitle}
                questions={customQuizQuestions}
                isArabicNumeral={isArabicNumeral}
                onQuizComplete={handleQuizComplete}
                onGoBack={() => setCustomQuizQuestions(null)}
              />
            ) : activeQuizUnitIdStr ? (
              // Selected Unit Quiz Screen Active
              <QuizSystem
                unitTitle={curriculumData.find((u) => u.id === activeQuizUnitIdStr)!.title}
                questions={curriculumData.find((u) => u.id === activeQuizUnitIdStr)!.quizzes}
                isArabicNumeral={isArabicNumeral}
                onQuizComplete={handleQuizComplete}
                onGoBack={() => setActiveQuizUnitIdStr(null)}
              />
            ) : (
              // Quiz selection hub and Custom quiz settings card!
              <div className="space-y-8">
                {/* Header */}
                <div className="text-right">
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">الاختبارات الفورية والامتحانات الذكية المخصصة</h3>
                  <p className="text-xs text-slate-400">ابدأ الاختبار الفوري لكل وحدة لمتابعة دراستك، أو قم ببناء اختبار ذكي مخصص لك بالكامل لقياس مستوى الفهم وتحدي الصعوبات.</p>
                </div>

                {/* Custom Quiz Build Tool Container */}
                <div className="bg-white dark:bg-[#171712] border border-slate-100 dark:border-[#2e2e24] p-6 rounded-3xl shadow-sm space-y-5 text-right transition">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-50 dark:border-[#25251d]">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-100/10 rounded-xl text-indigo-600 dark:text-indigo-500">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        منشّئ الاختبارات المخصصة والامتحانات الشاملة 
                        <span className="text-[10px] py-0.5 px-2 bg-indigo-600 text-white rounded-full">ميزة النوابغ</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">حدد نطاق الأسئلة بدقة للدرس، الوحدة، أو كامل المنهج بحد أقصى ٤٠ سؤالاً تفاعلياً.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Column 1: Choose Scope */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-350">1. نطاق مادة الاختبار:</label>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => setQuizScope('all')}
                          className={`text-right p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            quizScope === 'all'
                              ? 'bg-indigo-650 hover:bg-indigo-750 text-white border-indigo-650'
                              : 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-150 dark:border-[#2e2e24]'
                          }`}
                        >
                          <span>كامل منهج الصف السادس 📚</span>
                          {quizScope === 'all' && <span>✓</span>}
                        </button>
                        <button
                          onClick={() => setQuizScope('unit')}
                          className={`text-right p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            quizScope === 'unit'
                              ? 'bg-indigo-650 hover:bg-indigo-750 text-white border-indigo-650'
                              : 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-150 dark:border-[#2e2e24]'
                          }`}
                        >
                          <span>حسب وحدة دراسية كاملة 🗂️</span>
                          {quizScope === 'unit' && <span>✓</span>}
                        </button>
                        <button
                          onClick={() => setQuizScope('lesson')}
                          className={`text-right p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                            quizScope === 'lesson'
                              ? 'bg-indigo-650 hover:bg-indigo-750 text-white border-indigo-650'
                              : 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-150 dark:border-[#2e2e24]'
                          }`}
                        >
                          <span>حسب درس دراسي معين 📝</span>
                          {quizScope === 'lesson' && <span>✓</span>}
                        </button>
                      </div>
                    </div>

                    {/* Column 2: Scope Selectors */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-350">2. اختيار الوحدة أو الدرس مخصصاً:</label>
                      {quizScope === 'all' ? (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-2xl text-xs text-slate-500/85 dark:text-slate-400 flex items-center justify-center text-center h-[120px] leading-relaxed">
                          ستؤخذ الأسئلة وتولد عشوائياً من كامل فصول الكتاب ودروسه السبعة المترابطة بالتأكيد لتقديم تمرين قوي وشامل ومميز.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1 font-bold">اختر الوحدة:</span>
                            <select
                              value={quizTargetUnitId}
                              onChange={(e) => {
                                const uid = e.target.value;
                                setQuizTargetUnitId(uid);
                                const u = curriculumData.find((item) => item.id === uid);
                                if (u && u.lessons.length > 0) {
                                  setQuizTargetLessonId(u.lessons[0].id);
                                }
                              }}
                              className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white dark:bg-[#1c1c16] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                            >
                              {curriculumData.map((u) => (
                                <option key={u.id} value={u.id}>
                                  الوحدة {printNum(u.number)}: {u.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {quizScope === 'lesson' && (
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-1 font-bold">اختر الدرس الفرعي:</span>
                              <select
                                value={quizTargetLessonId}
                                onChange={(e) => setQuizTargetLessonId(e.target.value)}
                                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white dark:bg-[#1c1c16] text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                              >
                                {(curriculumData.find((u) => u.id === quizTargetUnitId) || curriculumData[0]).lessons.map((l) => (
                                  <option key={l.id} value={l.id}>
                                    {l.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Column 3: Count configuration */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-350">3. عدد الأسئلة المطلوبة في التحدي:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[5, 10, 20, 30, 40].map((c) => (
                          <button
                            key={c}
                            onClick={() => setQuizQuestionCount(c)}
                            style={{ id: `count_btn_${c}` }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition text-center ${
                              quizQuestionCount === c
                                ? 'bg-indigo-650 hover:bg-indigo-750 text-white border-indigo-650 font-black scale-[1.02] shadow-sm'
                                : 'bg-slate-50/50 hover:bg-slate-100/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 border-slate-150 dark:border-[#2e2e24]'
                            } ${c === 40 ? 'col-span-2 border-dashed border-indigo-300 dark:border-indigo-500/55' : ''}`}
                          >
                            {printNum(c)} {c === 40 ? 'سؤالاً كحد أقصى للذكاء 💥' : 'أسئلة'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submission Row */}
                  <div className="pt-4 border-t border-slate-50 dark:border-[#25251d] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50/30 px-3 py-1.5 rounded-full dark:text-indigo-400">
                      <Sparkles className="w-4 h-4 ml-1" />
                      <span>امتحان مولد عشوائياً بدقة وحكمة لشحذ الذكاء تفاعلياً!</span>
                    </div>
                    <button
                      onClick={handleStartCustomQuiz}
                      className="bg-indigo-650 hover:bg-indigo-750 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-black text-xs py-3.5 px-8 rounded-2xl shadow-md transform hover:-translate-y-0.5 transition active:translate-y-0"
                    >
                      🚀 ابدأ الاختبار المخصص الآن
                    </button>
                  </div>
                </div>

                {/* Instant Unit Quizzes heading */}
                <div className="text-right pt-2 border-t border-slate-100 dark:border-[#25251d] pt-6">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5 justify-end">
                    <span>الاختبارات الفورية المصنفة حسب الوحدات الفردية</span>
                    <ClipboardList className="w-4.5 h-4.5 text-indigo-650" />
                  </h4>
                  <p className="text-[11px] text-slate-400">امتحانات تمهيدية منسقة لكل وحدة من الكتاب المدرسي لمتابعة مسيرة تحصيلك خطوة بخطوة.</p>
                </div>

                {/* Quick Unit Quizzes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {curriculumData.map((unit) => {
                    const score = progress.completedQuizzes[unit.id];
                    return (
                      <div
                        key={unit.id}
                        className="bg-white dark:bg-[#171712] p-5 rounded-2xl border border-slate-100 dark:border-[#2e2e24] text-right flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-[#13130f] px-2 py-1 rounded">
                            الوحدة {printNum(unit.number)}
                          </span>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{unit.title}</h4>
                          <p className="text-[11px] text-slate-500">
                            يحتوي الاختبار على أسئلة اختيارية مبسطة بالمنهج لتقييم الفهم الحقيقي للوحدة.
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-50 dark:border-[#25251d] mt-4 flex items-center justify-between">
                          {score !== undefined ? (
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 dark:bg-[#1a2e1f] dark:text-[#baf7bc] px-2.5 py-1 rounded-full">
                                آخر درجة: %{printNum(score)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">ولم يتم التجربة بعد</span>
                          )}

                          <button
                            onClick={() => {
                              setActiveQuizUnitIdStr(unit.id);
                              setCustomQuizQuestions(null); // clear any active custom quiz
                            }}
                            className="bg-indigo-650 hover:bg-indigo-750 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-inner transition"
                          >
                            بدء تقديم الامتحان
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Parents Unlocked Controlling Dashboard */}
        {activeTab === 'parents' && (
          <ParentDashboard
            progress={progress}
            units={curriculumData}
            parentGoals={parentGoals}
            onAddGoal={handleAddParentGoal}
            onRemoveGoal={handleRemoveParentGoal}
            isArabicNumeral={isArabicNumeral}
          />
        )}

        {/* TAB 5: Virtual Classroom Smart Chat Search-based */}
        {activeTab === 'teacher' && (
          <VirtualTeacher
            units={curriculumData}
            isArabicNumeral={isArabicNumeral}
            onSelectUnit={(unitId) => {
              setSelectedUnitIdStr(unitId);
              setActiveTab('lessons');
            }}
          />
        )}

        {/* TAB 6: Games Arena and Interactive Simulations */}
        {activeTab === 'games' && (
          <MathGames
            isArabicNumeral={isArabicNumeral}
            onAwardPoints={handleAwardPoints}
            studentName={localStorage.getItem('sudanese_math_custom_name') || 'أحمد النابغة'}
          />
        )}
      </main>

      {/* Footer bar */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-[10px] md:text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {printNum(2026)} الرياضيات الذكية - جميع الحقوق محفوظة لجمهورية السودان والمركز القومي للمناهج والبحث التربوي بخت الرضا.</p>
          <p className="text-slate-600 font-medium">سلسلة المناهج المعتمدة للدراسة الابتدائية. تم دمج كافة المعامل بنمط تخزين محلي أوفلاين حماية وتحقيقاً لأفضل تفاعل دراسي.</p>
        </div>
      </footer>

      {/* Lower Touch navigation for small responsive screens */}
      <div className="lg:hidden bg-white border-t border-slate-100 flex items-center justify-around py-3 sticky bottom-0 z-40 shadow-xl">
        <button
          onClick={() => {
            setActiveTab('dashboard');
            setSelectedUnitIdStr(null);
            setSelectedLessonIdStr(null);
            setActiveQuizUnitIdStr(null);
          }}
          className={`flex flex-col items-center text-[10px] font-black ${
            activeTab === 'dashboard' ? 'text-indigo-650' : 'text-slate-400'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span>الرئيسية</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('lessons');
            setSelectedLessonIdStr(null);
            setActiveQuizUnitIdStr(null);
          }}
          className={`flex flex-col items-center text-[10px] font-black ${
            activeTab === 'lessons' ? 'text-indigo-650' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-1" />
          <span>الدروس</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('quizzes');
            setSelectedUnitIdStr(null);
            setSelectedLessonIdStr(null);
          }}
          className={`flex flex-col items-center text-[10px] font-black ${
            activeTab === 'quizzes' ? 'text-indigo-650' : 'text-slate-400'
          }`}
        >
          <Award className="w-5 h-5 mb-1" />
          <span>الاختبارات</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('games');
            setSelectedUnitIdStr(null);
            setSelectedLessonIdStr(null);
            setActiveQuizUnitIdStr(null);
          }}
          className={`flex flex-col items-center text-[10px] font-black ${
            activeTab === 'games' ? 'text-indigo-650' : 'text-slate-400'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mb-1" />
          <span>الألعاب</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('teacher');
            setSelectedUnitIdStr(null);
            setSelectedLessonIdStr(null);
            setActiveQuizUnitIdStr(null);
          }}
          className={`flex flex-col items-center text-[10px] font-black ${
            activeTab === 'teacher' ? 'text-indigo-650' : 'text-slate-400'
          }`}
        >
          <MessageCircle className="w-5 h-5 mb-1" />
          <span>المعلم</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('parents');
            setSelectedUnitIdStr(null);
            setSelectedLessonIdStr(null);
            setActiveQuizUnitIdStr(null);
          }}
          className={`flex flex-col items-center text-[10px] font-black ${
            activeTab === 'parents' ? 'text-indigo-650' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5 mb-1" />
          <span>الوالدين</span>
        </button>
      </div>
    </div>
  );
}
