import React, { useState } from 'react';
import { Send, User, Search, BookOpen, AlertCircle, HelpCircle, GraduationCap } from 'lucide-react';
import { Unit } from '../types';
import { toEasternArabicNumerals } from '../curriculumData';

interface VirtualTeacherProps {
  units: Unit[];
  isArabicNumeral: boolean;
  onSelectUnit: (unitId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'teacher';
  text: string;
  timestamp: string;
  matchedLessonId?: string;
  matchedUnitId?: string;
}

export const VirtualTeacher: React.FC<VirtualTeacherProps> = ({
  units,
  isArabicNumeral,
  onSelectUnit,
}) => {
  const [teacherType, setTeacherType] = useState<'ahmed' | 'layla'>('ahmed');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      sender: 'teacher',
      text: 'مرحباً بك يا بطل! أنا المعلم الافتراضي أحمد، خبير رياضيات الصف السادس الابتدائي بالمنهج السوداني. اكتب لي أي موضوع أو كلمة تبحث عنها في كتاب الرياضيات (مثل: "فيثاغورث"، "أشكال فن"، "القيمة المطلقة") وسأقوم بالبحث الفوري وعرض الشرح والأمثلة الميسرة لك بلا ذكاء اصطناعي مكلف!',
      timestamp: 'الآن',
    },
  ]);
  const [inputVal, setInputVal] = useState<string>('');

  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  const handleSwitchTeacher = (type: 'ahmed' | 'layla') => {
    setTeacherType(type);
    const welcomeText =
      type === 'ahmed'
        ? 'مرحباً بك يا بطل! أنا الأستاذ أحمد. اسألني عن أي قانون أو مثال في مقرر السادس وسأجيبك فورياً.'
        : 'أهلاً بك يا بني مع الأستاذة ليلى لتبسيط الرياضيات الهندسية والمجموعات. اكتب سؤالك لنبحث معاً!';
    setMessages([
      {
        id: `switch_${Date.now()}`,
        sender: 'teacher',
        text: welcomeText,
        timestamp: 'الآن',
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;

    const userQuery = inputVal.trim();
    const timestampStr = new Date().toLocaleTimeString('ar-SD', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const studentMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      sender: 'student',
      text: userQuery,
      timestamp: timestampStr,
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputVal('');

    // Execute text search index over Units and Lessons database representing custom search
    setTimeout(() => {
      const lowerQuery = userQuery.toLowerCase();
      let bestLessonFound: any = null;
      let parentUnitFound: any = null;

      // Scan textbook data
      for (const unit of units) {
        for (const lesson of unit.lessons) {
          if (
            lesson.title.toLowerCase().includes(lowerQuery) ||
            lesson.description.toLowerCase().includes(lowerQuery) ||
            lesson.explanation.toLowerCase().includes(lowerQuery)
          ) {
            bestLessonFound = lesson;
            parentUnitFound = unit;
            break;
          }
        }
        if (bestLessonFound) break;
      }

      let responseText = '';
      let lessonIdToLink = undefined;
      let unitIdToLink = undefined;

      const teacherWord = teacherType === 'ahmed' ? 'الأستاذ أحمد' : 'الأستاذة ليلى';

      if (bestLessonFound && parentUnitFound) {
        responseText = `يا تلميذي العزيز، لقد بحثت في كتاب الرياضيات للصف السادس ووجدت لك درساً دقيقاً حول "${bestLessonFound.title}" بالوحدة [${parentUnitFound.title}]. \n\n**الشرح السريع:**\n${bestLessonFound.explanation.substring(0, 300)}... \n\n**هل تود مراجعة هذا الفصل التفاعلي وحل تمارينه الحية الآن؟** انقر على زر الدراسة أدناه للذهاب فورياً للدرس!`;
        lessonIdToLink = bestLessonFound.id;
        unitIdToLink = parentUnitFound.id;
      } else {
        // Fallback guide responses if no direct lesson is found
        if (lowerQuery.includes('مرحبا') || lowerQuery.includes('أهلا') || lowerQuery.includes('سلام')) {
          responseText = `أهلاً بك وسهلاً! يسعدني جداً فضولك العلمي. اسألني عن موضوعات الرياضيات مثل: "تقاطع المجموعات"، "الأعداد الصحيحة وتلوين خط الأعداد"، "مساحة المستطيل والمربع والدائرة"، "كيفية إيجاد المتوسط الحسابي".`;
        } else if (lowerQuery.includes('خطة') || lowerQuery.includes('دراسة') || lowerQuery.includes('امتحان')) {
          responseText = `لتفوق باهر بالامتحان النهائي للشهادة الابتدائية بالسودان، يوصي ${teacherWord} باتباع الخطوات الشرفية التالية:\n١. مراجعة الوحدة الأولى والمجموعات بدقة.\n٢. حل كافة تمارين القيمة المطلقة والجمع والطرح الصحيح.\n٣. التعود على رسم أشكال الهندسية وربط قاعدة شبه المنحرف والمثلث.`;
        } else {
          responseText = `لم أجد موضوعاً يطابق الاستعلام "${userQuery}" نصياً بدقة بكتاب مادة الرياضيات المعتمد للشهادة الابتدائية بالسودان.\n\n💡 نصائح بحث لنتائج ممتازة:\n- اكتب كلمات بسيطة مثل: "تقاطع"، "مساحة"، "فيثاغورث"، "اتحاد"، "نسبة"، "المجموعات"، "أشكال فن".\n- تأكد من صحة إملاء الكلمات لتسهيل البحث بالمنهج!`;
        }
      }

      const teacherMsg: ChatMessage = {
        id: `msg_${Date.now()}_t`,
        sender: 'teacher',
        text: responseText,
        timestamp: timestampStr,
        matchedLessonId: lessonIdToLink,
        matchedUnitId: unitIdToLink,
      };

      setMessages((prev) => [...prev, teacherMsg]);
    }, 800);
  };

  return (
    <div id="virtual_teacher_screen" className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-right">
      {/* Sidebar: select expert profile */}
      <div className="space-y-4 lg:col-span-1">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-right space-y-4">
          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <GraduationCap className="w-4 h-4 text-indigo-650" />
            اختر مرشدك الأكاديمي لشرح المسائل
          </h3>

          <div
            onClick={() => handleSwitchTeacher('ahmed')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              teacherType === 'ahmed'
                ? 'border-indigo-600 bg-indigo-50/20'
                : 'border-slate-50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-755 text-indigo-700">
                👨‍🏫
              </div>
              <div>
                <h4 className="font-bold text-xs text-indigo-950">أستاذ أحمد</h4>
                <p className="text-[10px] text-slate-400">خبير الجبر والأعداد الصحيحة</p>
              </div>
            </div>
          </div>

          <div
            onClick={() => handleSwitchTeacher('layla')}
            className={`p-3 rounded-xl border cursor-pointer transition ${
              teacherType === 'layla'
                ? 'border-indigo-600 bg-indigo-50/20'
                : 'border-slate-50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center font-bold text-pink-700">
                👩‍🏫
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-850">أستاذة ليلى</h4>
                <p className="text-[10px] text-slate-400">خبيرة الهندسة وأشكال فن والدائرة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggest terms helper box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-2 text-xs">
          <p className="font-bold text-indigo-950 text-[11px]">مواضيع مقترحة للاستقصاء:</p>
          <div className="flex flex-wrap gap-1.5">
            {['تقاطع', 'فيثاغورث', 'الدائرة', 'المربع', 'القيمة المطلقة', 'الصفة المميزة'].map((term) => (
              <button
                key={term}
                onClick={() => setInputVal(term)}
                className="bg-white border border-slate-200 text-[10px] py-1 px-2.5 rounded-full hover:border-indigo-400 hover:text-indigo-650 transition font-bold"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main chat UI */}
      <div className="lg:col-span-3 flex flex-col h-[500px] bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-md">
        <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3.5 h-3.5 rounded-full ${teacherType === 'ahmed' ? 'bg-indigo-650' : 'bg-pink-500'} animate-pulse`}></div>
            <h3 className="font-bold text-xs text-slate-800">
              محادثة ذكية حرة مع {teacherType === 'ahmed' ? 'أستاذ أحمد' : 'أستاذة ليلى'}
            </h3>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
            متصل بالمنهج أوفلاين 🇸🇩
          </span>
        </div>

        {/* Chat message content box */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'student' ? 'mr-auto flex-row-reverse text-left' : 'ml-auto text-right'
              }`}
            >
              <div className="mt-1">
                {msg.sender === 'student' ? (
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-650 rounded-full flex items-center justify-center font-bold text-xs">
                    ت
                  </div>
                ) : (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                    teacherType === 'ahmed' ? 'bg-indigo-150 bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'
                  }`}>
                    {teacherType === 'ahmed' ? '👨‍🏫' : '👩‍🏫'}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-slate-400 block px-1">
                  {msg.sender === 'student' ? 'أنت' : teacherType === 'ahmed' ? 'الأستاذ أحمد' : 'الأستاذة ليلى'} • {msg.timestamp}
                </span>

                <div className={`p-3.5 rounded-2xl text-[11px] leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'student'
                    ? 'bg-indigo-600 text-white rounded-tl-none font-bold'
                    : 'bg-slate-100 text-slate-800 rounded-tr-none'
                }`}>
                  {msg.text}

                  {/* If searched lesson matches correctly, render dynamic study button */}
                  {msg.matchedUnitId && (
                    <div className="mt-3 pt-3 border-t border-slate-200/50 flex">
                      <button
                        onClick={() => onSelectUnit(msg.matchedUnitId!)}
                        className="bg-indigo-600 text-white text-[10px] font-black px-4 py-2.5 rounded-xl block hover:bg-indigo-750 transition"
                      >
                        🚀 اذهب لدراسة هذا الدرس بالوحدة المخصصة فوراً
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action input bar */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex gap-2">
          <input
            type="text"
            placeholder="اكتب رسالتك أو ابحث عن درس (مثال: أشكال فن)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 p-3 text-xs bg-white rounded-xl border border-slate-150 focus:border-indigo-400 focus:outline-none text-right"
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="p-3 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl shadow transition"
          >
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
