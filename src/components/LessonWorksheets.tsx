import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Award, 
  CheckCircle,
  Clock,
  BookOpen,
  Map,
  BadgeAlert,
  ArrowRight,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Lesson } from '../types';
import { curriculumData, toEasternArabicNumerals } from '../curriculumData';

interface LessonWorksheetsProps {
  lesson: Lesson;
  isArabicNumeral: boolean;
  onBackToStudy: () => void;
}

export const LessonWorksheets: React.FC<LessonWorksheetsProps> = ({
  lesson,
  isArabicNumeral,
  onBackToStudy
}) => {
  const [activePage, setActivePage] = useState<number>(1);
  const [showAllPagesForPrint, setShowAllPagesForPrint] = useState<boolean>(false);
  const [revealedSolutions, setRevealedSolutions] = useState<boolean>(false);
  
  // Scope and Pages choice states
  const [worksheetScope, setWorksheetScope] = useState<'lesson' | 'unit' | 'curriculum'>('lesson');
  const [customPagesCount, setCustomPagesCount] = useState<number>(15);
  const pagesCount = customPagesCount;

  // Find active unit
  const currentUnit = curriculumData.find((u) => u.lessons.some((l) => l.id === lesson.id));

  const handlePagesCountChange = (newCount: number) => {
    const count = Math.max(1, Math.min(15, newCount));
    setCustomPagesCount(count);
    if (activePage > count) {
      setActivePage(count);
    }
  };

  // Custom Watermark configuration
  const [isWatermarkDisabled, setIsWatermarkDisabled] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  // Student input state to make the sheets interactive on-screen before printing
  const [studentName, setStudentName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('السادس الابتدائي');
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [trueFalseAnswers, setTrueFalseAnswers] = useState<Record<string, 'true' | 'false' | null>>({});
  const [multipleChoiceSelected, setMultipleChoiceSelected] = useState<Record<string, number | null>>({});

  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  const handleVerifyPassword = () => {
    if (passwordInput === '20302060') {
      setIsWatermarkDisabled(true);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('❌ كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.');
    }
  };

  const handlePrint = () => {
    // Show premium print view & invoke window.print
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('الرجاء تمثيل النوافذ المنبثقة لفتح نموذج الطباعة الشاملة!');
      return;
    }

    const compiledPagesHtml = Array.from({ length: pagesCount }, (_, i) => i + 1).map((pageNum) => {
      // Conditionally generate the watermark background division
      const watermarkHtml = !isWatermarkDisabled 
        ? `
          <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span style="font-size: 80px; font-weight: 900; transform: rotate(-45deg);"> نقلة للمناهج الالكترونية -  </span>
          </div>
        ` 
        : '';

      const scopeTitle = worksheetScope === 'lesson'
        ? `للدرس: ${lesson.title}`
        : worksheetScope === 'unit'
        ? `للوحدة (${currentUnit?.number || ''}): ${currentUnit?.title || ''}`
        : `لكامل المنهج الدراسي المطور`;

      return `
        <div class="print-page bg-white p-10 max-w-[210mm] min-h-[297mm] mx-auto border border-gray-300 shadow-md relative text-right flex flex-col justify-between mb-8 break-after-page" style="direction: rtl; font-family: 'Inter', sans-serif;">
          <!-- SVG Watermark background -->
          ${watermarkHtml}

          <!-- Document Header -->
          <div class="border-b-4 border-[#5A5A40] pb-4 mb-6">
            <div class="flex justify-between items-start">
              <div class="text-xs space-y-1 font-bold text-gray-700">
                <p>جمهورية السودان</p>
                <p>وزارة التربية والتعليم الاتحادية</p>
                <p>ولاية الخرطوم</p>
                <p>مرحلة التعليم الابتدائي - الصف السادس</p>
              </div>
              <div class="text-center shrink-0 mx-2">
                <div class="w-16 h-16 bg-[#5A5A40] text-white flex items-center justify-center rounded-full font-black text-sm mx-auto shadow-sm border-2 border-amber-600">🇸🇩</div>
                <p class="text-[9px] font-black mt-1 text-[#5A5A40]">المركز القومي للمناهج - نقلة للمناهج الإلكترونية</p>
              </div>
              <div class="text-xs space-y-1 font-bold text-gray-700 text-left">
                <p>ورقة تقييم وتقويم الأداء</p>
                <p>المقرر: الرياضيات المطورة</p>
                <p>العام الدراسي: ٢٠٢٦م</p>
                <p>الدرجة القصوى: ٥٠ درجة</p>
              </div>
            </div>

            <!-- Subject Title Banner -->
            <div class="bg-[#5A5A40] text-white text-center py-2 px-4 rounded-xl mt-4">
              <h1 class="text-sm font-black tracking-wide">ورقة عمل شاملة ${scopeTitle} ([${formatNum(pagesCount)}] صفحة مجهزة للطباعة)</h1>
            </div>
          </div>

          <!-- Page Content -->
          <div class="flex-grow">
            ${getHtmlContentForPage(pageNum)}
          </div>

          <!-- Document Footer -->
          <div class="border-t border-gray-200 pt-3 text-center text-[10px] text-gray-500 flex justify-between items-center font-bold">
            <span>مقرر الرياضيات المطور - الصف السادس الابتدائي 🇸🇩</span>
            <span class="bg-[#5A5A40] text-white px-3 py-1 rounded-full text-xs font-black">الصفحة ${formatNum(pageNum)} من ${formatNum(pagesCount)}</span>
            <span>بوابة المعلم السوداني الرقمية</span>
          </div>
        </div>
      `;
    }).join('<div style="page-break-after: always; break-after: page;"></div>');

    const documentTitle = worksheetScope === 'lesson'
      ? `ورقة عمل رياضيات - ${lesson.title} - الصف السادس الابتدائي`
      : worksheetScope === 'unit'
      ? `ورقة عمل رياضيات - وحدة ${currentUnit?.title || ''} - الصف السادس الابتدائي`
      : `ورقة عمل رياضيات - كامل المنهج - الصف السادس الابتدائي`;

    printWindow.document.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body {
                background: white;
                margin: 0;
                padding: 0;
              }
              .print-page {
                box-shadow: none !important;
                border: none !important;
                margin: 0 auto !important;
                padding: 15mm 15mm !important;
                width: 210mm !important;
                height: 297mm !important;
                page-break-after: always;
                break-after: page;
              }
            }
            body {
              background-color: #f3f4f6;
              font-family: 'system-ui', -apple-system, sans-serif;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="py-8">
            ${compiledPagesHtml}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // HTML generators for printing (so they match exactly what is shown on screen)
  function getHtmlContentForPage(pNum: number): string {
    switch (pNum) {
      case 1:
        return `
          <div class="space-y-6 text-center py-4">
            <h2 class="text-xl font-black text-[#5A5A40] underline decoration-double">الصفحة الأولى: استمارة التسجيل والغلاف الرسمي</h2>
            <p class="text-xs text-gray-600 leading-relaxed max-w-xl mx-auto">
              أهلاً بك يا بطل المستقبل المتميز في مقرر مادة الرياضيات الجديد للصف السادس الابتدائي. تحتوي هذه الحقيبة على <b>[${formatNum(pagesCount)}] صفحة متتالية</b> من التمارين التدريبية والمسائل والبرمجيات المصممة وفق أدق معايير التقييم التربوي الوطني المطور بالسودان لرفع مستواك الأكاديمي.
            </p>

            <!-- Student Data Card Details -->
            <div class="border-2 border-dashed border-[#5A5A40] p-6 rounded-2xl bg-gray-50 max-w-lg mx-auto text-right space-y-4 font-bold text-xs text-gray-800">
              <div class="border-b border-gray-300 pb-2">
                اسم الطالب الرباعي: 
                <span class="text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block font-black">${studentName || '..........................................................'}</span>
              </div>
              <div class="border-b border-gray-300 pb-2">
                اسم المدرسة: 
                <span class="text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block font-black">${schoolName || '..........................................................'}</span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="border-b border-gray-300 pb-2">الصف الدراسي: <span class="text-blue-700 font-black">${studentClass || 'السادس الابتدائي'}</span></div>
                <div class="border-b border-gray-300 pb-2">رقم الجلوس: <span class="text-gray-400">........................</span></div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="border-b border-gray-300 pb-2">اسم المشرف: <span class="text-gray-400">........................</span></div>
                <div class="border-b border-gray-300 pb-2">العام الدراسي: <span>٢٠٢٦م - ٢٠٢٧م</span></div>
              </div>
            </div>

            <!-- Scoring Card Rubrics -->
            <div class="max-w-md mx-auto">
              <h3 class="font-extrabold text-[#5A5A40] mb-2 text-xs">جدول رصد الدرجات الأكاديمية (خاص بالمعلم المشرف):</h3>
              <table class="w-full border-collapse border border-gray-300 text-center text-xs font-bold bg-white">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="border border-gray-300 p-2">الباب وتقييم الصفحة</th>
                    <th class="border border-gray-300 p-2">الدرجة الكاملة</th>
                    <th class="border border-gray-300 p-2">الدرجة المستحقة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 p-1 text-right pr-3">المحور الأول: الأسئلة الموضوعية (ص/خ) والخيارات</td>
                    <td class="border border-gray-300 p-1">١٥</td>
                    <td class="border border-gray-300 p-1">........</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-1 text-right pr-3">المحور الثاني: إكمال الفراغات والرموز الرياضية</td>
                    <td class="border border-gray-300 p-1">١٠</td>
                    <td class="border border-gray-300 p-1">........</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-1 text-right pr-3">المحور الثالث: التمثيل الهندسي والحديث البرهاني</td>
                    <td class="border border-gray-300 p-1">١٥</td>
                    <td class="border border-gray-300 p-1">........</td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-1 text-right pr-3">المحور الرابع: التفكير الناقد ومسائل التفوق والأولمبياد</td>
                    <td class="border border-gray-300 p-1">١٠</td>
                    <td class="border border-gray-300 p-1">........</td>
                  </tr>
                  <tr class="bg-yellow-50 font-black">
                    <td class="border border-gray-300 p-2 text-right pr-3 text-[#5A5A40]">المجموع النهائي المكتسب</td>
                    <td class="border border-gray-300 p-2 text-[#5A5A40]">٥٠ درجة</td>
                    <td class="border border-gray-300 p-2 text-red-600">........</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 max-w-md mx-auto text-[10px] text-yellow-800 text-right leading-relaxed font-bold">
              ⚠️ <b>تعليمات إرشادية هامة للطالب:</b> يمنع استخدام الآلة الحاسبة منعاً باتاً للاعتماد على الحساب الذهني الذاتي. يجب استخدام الحبر الأزرق مع كتابة الخطوات كاملة لنيل الدرجة الكلية للتمرين.
            </div>
          </div>
        `;
      case 2:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الثانية: خريطة المفاهيم وخطة مسبقة الدراسة</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              تشتمل هذه الصفحة على الخطوط العريضة والمصطلحات والرموز الجوهرية ذات الارتباط المباشر بالدراسة المنهجية لتمكين الطالب من تثبيت القوانين قبل الانطلاق في المسائل وحل الألغاز.
            </p>

            <div class="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
              <div class="bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1] space-y-2">
                <h3 class="text-[#5A5A40] border-b pb-1">📚 المفاهيم والتعاريف الأساسية:</h3>
                <ul class="list-disc list-inside space-y-1.5 text-gray-700 text-[11px] pr-2">
                  <li>مفهوم التحصيل: يعتبر شرح ومسائل <b>${worksheetScope === 'lesson' ? `درس: ${lesson.title}` : worksheetScope === 'unit' ? `وحدة ${currentUnit?.title || ''}` : 'كامل مقرر الرياضيات المطورة'}</b> بؤرة ارتكاز هامة في المنهج القومي المطور.</li>
                  <li>المعطيات: تحديد المدخلات بدقة واستخراج الرموز الرياضية المناسبة قبل البدء.</li>
                  <li>البرهان: سلسلة الخطوات المنطقية المقنعة التي تؤدي لاستنباط الحل والنتيجة المطلوبة.</li>
                </ul>
              </div>

              <div class="bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1] space-y-2">
                <h3 class="text-[#5A5A40] border-b pb-1">💡 العلاقات والنظريات المرتبطة:</h3>
                <ul class="list-decimal list-inside space-y-1.5 text-gray-700 text-[11px] pr-2">
                  <li>خط الدفاع الأول: استرجاع القواعد الرياضية الأساسية للعمليات.</li>
                  <li>تنظيم المتغيرات: وضع الحدود المتشابهة جنباً إلى جنب في المعادلات.</li>
                  <li>التحقق الذاتي: تعويض المعطيات في الناتج النهائي لضمان تطابق البرهان وصلاحية القانون.</li>
                </ul>
              </div>
            </div>

            <!-- Visual Mind map layout mockup -->
            <div class="border border-gray-200 rounded-xl p-4 bg-[#fcfcf9] text-center space-y-3">
              <span class="text-[10px] text-gray-500 font-extrabold block">خريطة تسلسل المفاهيم الأكاديمية بالتحليل الهندسي والجبري:</span>
              <div class="flex items-center justify-around text-[10px] font-black text-gray-600 pt-2">
                <div class="bg-white border rounded p-2 text-center w-28 shadow-sm">
                  <p class="text-[#5A5A40]">[١] الفهم النظري</p>
                  <p class="text-[8px] text-gray-400 mt-0.5">دراسة المعنى وتفكيك الصيغ</p>
                </div>
                <div class="text-xl">⬅️</div>
                <div class="bg-white border rounded p-2 text-center w-28 shadow-sm">
                  <p class="text-amber-700">[٢] البرهان الصوري</p>
                  <p class="text-[8px] text-gray-400 mt-0.5">رسم شكل فِن والتمثيل الصوري</p>
                </div>
                <div class="text-xl">⬅️</div>
                <div class="bg-white border text-white bg-[#5A5A40] border-[#5A5A40] rounded p-2 text-center w-28 shadow-sm">
                  <p>[٣] الحل الميداني</p>
                  <p class="text-[8px] text-amber-200 mt-0.5">الاشتقاق والتعويض الذكي</p>
                </div>
              </div>
            </div>
          </div>
        `;
      case 3:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الثالثة: أولاً: اختبار صحة العبارات الرياضية (صح وخطأ)</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              ضع علامة (✔️) أمام العبارة الرياضية الصحيحة، وعلامة (❌) أمام العبارة الرياضية الخاطئة، مع ضرورة كتابة تبرير رياضي مختصر ومقنع في المساحة المخصصة دليلاً على فهمك للبرهان:
            </p>

            <div class="space-y-3.5 text-xs font-bold pt-2">
              <div class="bg-white border rounded-xl p-3 space-y-2">
                <div class="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                  <span>١. العملية الرياضية تعتمد على تمثيل العناصر في شكل نسق رياضي موحد.</span>
                  <span class="border-2 border-[#5A5A40] px-4 py-1 rounded bg-white font-mono text-[#5A5A40]"> ( &nbsp; &nbsp; &nbsp; ) </span>
                </div>
                <p class="text-[10px] text-gray-400">التبرير الرياضي والبرهان: ....................................................................................</p>
              </div>

              <div class="bg-white border rounded-xl p-3 space-y-2">
                <div class="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                  <span>٢. في مخرجات الرياضيات، المجموعات الخالية لا تحتوي على أي عنصر، وبالتالي لا تملك مجموعة جزئية.</span>
                  <span class="border-2 border-[#5A5A40] px-4 py-1 rounded bg-white font-mono text-[#5A5A40]"> ( &nbsp; &nbsp; &nbsp; ) </span>
                </div>
                <p class="text-[10px] text-gray-400">التبرير الرياضي والبرهان: ....................................................................................</p>
              </div>

              <div class="bg-white border rounded-xl p-3 space-y-2">
                <div class="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                  <span>٣. تتبدل نتائج المقارنة للأعداد الصحيحة عند ضرب الأطراف كافة في ثابت سالب القيمة.</span>
                  <span class="border-2 border-[#5A5A40] px-4 py-1 rounded bg-white font-mono text-[#5A5A40]"> ( &nbsp; &nbsp; &nbsp; ) </span>
                </div>
                <p class="text-[10px] text-gray-400">التبرير الرياضي والبرهان: ....................................................................................</p>
              </div>

              <div class="bg-white border rounded-xl p-3 space-y-2">
                <div class="flex justify-between items-center bg-gray-50 p-1.5 rounded">
                  <span>٤. العلاقة التناسبية العكسية تمثل تزايد متغير بتناقص قيمة المتغير الآخر بالنسبة الثابتة المقررة.</span>
                  <span class="border-2 border-[#5A5A40] px-4 py-1 rounded bg-white font-mono text-[#5A5A40]"> ( &nbsp; &nbsp; &nbsp; ) </span>
                </div>
                <p class="text-[10px] text-gray-400">التبرير الرياضي والبرهان: ....................................................................................</p>
              </div>
            </div>
          </div>
        `;
      case 4:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الرابعة: ثانياً: الأسئلة الموضوعية (الاختيار من متعدد)</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              اختر الإجابة الصحيحة من بين الخيارات المتاحة، تمعن جيداً في كل خيار ولا تتسرع، واكتب طريقة الحساب الذهني المعتمدة في الخانة الفرعية:
            </p>

            <div class="space-y-4 text-xs font-bold pt-2">
              <div class="bg-[#fcfcf9] border rounded-xl p-3 space-y-2">
                <p class="text-gray-800">السؤال الأول: أي الخيارات التالية تعبر عن ناتج دقيق لتبسيط الصيغة الرياضية للدرس؟</p>
                <div class="grid grid-cols-4 gap-2 text-center text-[11px] pt-1.5">
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">أ) المخرجات الصفرية</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">ب) النسبة الثابتة ط</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">ج) المجموعة الجزئية</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">د) المعيار المقابل</span>
                </div>
              </div>

              <div class="bg-[#fcfcf9] border rounded-xl p-3 space-y-2">
                <p class="text-gray-800">السؤال الثاني: إذا قمنا بنقل متغير ذي إشارة سالبة إلى الطرف الثاني من المعادلة، فإن الإشارة تتحول إلى:</p>
                <div class="grid grid-cols-4 gap-2 text-center text-[11px] pt-1.5">
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">أ) إشارة موجبة (+)</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">ب) ضرب في ثابت</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">ج) تظل كما هي (-)</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">د) قسمة على صفر</span>
                </div>
              </div>

              <div class="bg-[#fcfcf9] border rounded-xl p-3 space-y-2">
                <p class="text-gray-800">السؤال الثالث: النسبة التقريبية الدائرية (ط) المستخدمة في قياس محيط الدائرة تبلغ قيمتها الكسرية:</p>
                <div class="grid grid-cols-4 gap-2 text-center text-[11px] pt-1.5 font-mono">
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">أ) ٢٢ / ٧</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">ب) ٣ / ١٤</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">ج) ٧ / ٢٢</span>
                  <span class="border border-gray-300 p-1.5 rounded-lg bg-white">د) ١ / ٢</span>
                </div>
              </div>
            </div>
          </div>
        `;
      case 5:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الخامسة: ثالثاً: أسئلة إكمال الفراغات في المتن الرياضي</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              أكمل الفراغات التالية بالكلمات أو الرموز أو الأعداد الرياضية المناسبة لتكتمل العبارة منطقياً وصحيحاً:
            </p>

            <div class="space-y-4 text-xs font-bold pt-2 text-right">
              <div class="border border-gray-200 rounded-xl p-4 bg-white leading-relaxed text-gray-700 space-y-4">
                <p>
                  ١. يُطلق على المجموعة التي لا تحتوي على أي عناصر بالمجموعة ............................ ويرمز لها بالرمز الإغريقي الشهير ............................
                </p>
                <p>
                  ٢. القيمة المطلقة لأي عدد صحيح سالب هي دائماً عدد ............................ لأن المسافة على خط الأعداد يجب أن تكون ............................
                </p>
                <p>
                  ٣. في حساب المثلثات، يسمى الضلع المقابل للزاوية القائمة في المثلث قائم الزاوية بـ ............................ وهو أطول أضلاع المثلث بأكمله.
                </p>
                <p>
                  ٤. التناسب الطردي يعني تزايد نسبة كمية مع تزايد كمية أخرى، بحيث يظل ............................ بينهما دائماً ثابتاً لا يتغير.
                </p>
              </div>

              <div class="border border-dashed border-[#5A5A40] p-4 rounded-xl bg-[#fcfcf9] text-center space-y-2">
                <h4 class="text-[10px] text-[#5A5A40] font-black">🎓 بنك الكلمات المساعدة (استخدمها للتعبئة):</h4>
                <div class="flex flex-wrap gap-2 justify-center text-[10px] text-[#5A5A40]">
                  <span class="bg-white border rounded px-2.5 py-1 shadow-sm">الخالية (فاي)</span>
                  <span class="bg-white border rounded px-2.5 py-1 shadow-sm">موجبة</span>
                  <span class="bg-white border rounded px-2.5 py-1 shadow-sm">الوتر</span>
                  <span class="bg-white border rounded px-2.5 py-1 shadow-sm">خارج القسمة</span>
                  <span class="bg-white border rounded px-2.5 py-1 shadow-sm">مطلق القيمة</span>
                </div>
              </div>
            </div>
          </div>
        `;
      case 6:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة السادسة: رابعاً: التعبير والتدوين الرياضي واستخدام الرموز</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              حول العبارات والمسائل والنصوص اللفظية التالية إلى صيغ رياضية ورموز تخصصية دقيقة (مثال: محتواة في، ينتمي، لا ينتمي، القيمة المطلقة):
            </p>

            <table class="w-full border-collapse border border-gray-300 text-right text-xs font-bold mt-2">
              <thead>
                <tr class="bg-gray-100">
                  <th class="border border-gray-300 p-2 text-center w-12">مقطع</th>
                  <th class="border border-gray-300 p-2">العبارة الرياضية اللفظية بالعربية</th>
                  <th class="border border-gray-300 p-2 text-center w-48">الترجمة الرياضية بالرموز</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border border-gray-300 p-2 text-center font-mono">١</td>
                  <td class="border border-gray-300 p-2 text-gray-700">العدد الصحيح (سالب خمسة) ينتمي إلى مجموعة الأعداد الصحيحة ص.</td>
                  <td class="border border-gray-300 p-2 text-center font-mono text-gray-400">....................................</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2 text-center font-mono">٢</td>
                  <td class="border border-gray-300 p-2 text-gray-700">المجموعة س ليست محتواة في المجموعة ص.</td>
                  <td class="border border-gray-300 p-2 text-center font-mono text-gray-400">....................................</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2 text-center font-mono">٣</td>
                  <td class="border border-gray-300 p-2 text-gray-700">القيمة المطلقة للعدد الصحيح (سالب تسعة) تساوي تسعة.</td>
                  <td class="border border-gray-300 p-2 text-center font-mono text-gray-400">....................................</td>
                </tr>
                <tr>
                  <td class="border border-gray-300 p-2 text-center font-mono">٤</td>
                  <td class="border border-gray-300 p-2 text-gray-700">تقاطع المجموعة س مع المجموعة ص يساوي المجموعة الخالية فاي.</td>
                  <td class="border border-gray-300 p-2 text-center font-mono text-gray-400">....................................</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
      case 7:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة السابعة: خامساً: الرسم البياني وإعداد وتلوين التمثيل الصوري والهندسي</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              استخدم خطوط القلم والمسطرة بدقة للتمثيل والرسم بالأبعاد المتاحة. في حال كنت تستخدم الشاشة التفاعلية، يمكنك حلها ذهنياً أو طباعتها للتدريب العملي:
            </p>

            <div class="grid grid-cols-2 gap-4 text-xs font-bold pt-2">
              <div class="border border-dashed border-gray-300 p-4 rounded-xl bg-white text-center space-y-4 min-h-[160px] flex flex-col justify-between">
                <span class="text-[10px] text-[#5A5A40] font-extrabold block">١. مثل شكل فِن المجموعتين (س، ص) بحيث تكون س ∩ ص ≠ ∅:</span>
                <div class="w-full flex-grow border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 text-[10px]">
                  [مكان للرسم الهندسي اليدوي للأشكال الدائرية]
                </div>
              </div>

              <div class="border border-dashed border-gray-300 p-4 rounded-xl bg-white text-center space-y-4 min-h-[160px] flex flex-col justify-between">
                <span class="text-[10px] text-[#5A5A40] font-extrabold block">٢. مثل الأعداد التالية على خط الأعداد الموضح أدناه (-٣، ٠، ٤):</span>
                <div class="w-full flex-grow border border-gray-100 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-2">
                  <div class="w-full h-0.5 bg-gray-400 relative my-3">
                    <div class="absolute left-0 -top-1 w-2 h-2 border-l border-b border-gray-400 transform rotate-45"></div>
                    <div class="absolute right-0 -top-1 w-2 h-2 border-r border-t border-gray-400 transform rotate-45"></div>
                    <div class="absolute left-1/4 -top-1 w-0.5 h-2 bg-gray-600"></div>
                    <div class="absolute left-1/2 -top-1 w-0.5 h-2 bg-gray-600"></div>
                    <div class="absolute left-3/4 -top-1 w-0.5 h-2 bg-gray-600"></div>
                  </div>
                  <span class="text-[8px] text-gray-400">[ضع نقطة وحدد موقع كل عدد وحساب المسافة بدقة]</span>
                </div>
              </div>
            </div>
          </div>
        `;
      case 8:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الثامنة: سادساً: التمارين البرهانية المتسلسلة والبرهان الحسابي</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              أوجد قيمة المتغيرات وصحح الخطوات الرياضية بالتفصيل، موضحاً اسم النظرية أو القانون الفني المعتمد في كل سطر من سطور البرهان:
            </p>

            <div class="border border-gray-200 rounded-xl p-4 bg-[#fcfcf9] font-mono text-center text-xs space-y-2 text-[#5A5A40]">
              <p class="font-bold">المسألة النموذجية المطلوب برهنتها وحلها:</p>
              <div class="bg-white p-2.5 rounded-lg border border-gray-200">
                أوجد مساحة متوازي الأضلاع إذا تبيّن أن طول قاعدته = ${formatNum(12)} سم، وارتفاعه العمودي المقابل = ${formatNum(8)} سم.
              </div>
            </div>

            <div class="space-y-4 pt-2 text-xs font-bold text-right">
              <div class="space-y-1">
                <p class="text-gray-700">الخطوة الأولى: كتابة نص القانون الرياضي لمتوازي الأضلاع:</p>
                <p class="text-gray-400">القانون: .......................................................................................................</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-700">الخطوة الثانية: تعويض معطيات المسألة المدرجة بالأرقام:</p>
                <p class="text-gray-400">التعويض: المساحة = ..........................................................................................</p>
              </div>
              <div class="space-y-1">
                <p class="text-gray-700">الخطوة الثالثة: إيجاد الناتج النهائي بالحساب الدقيق مع وحدات القياس الصحيحة:</p>
                <p class="text-gray-400">النتيجة: ......................................................................................................</p>
              </div>
            </div>
          </div>
        `;
      case 9:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة التاسعة: سابعاً: المسائل اللفظية والمواقف الحياتية (المستوى الأول)</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              قم بحل المسألة الرياضية التطبيقية اللفظية المستوحاة من صميم بيئتنا وجغرافيتنا السودانية، مع تحديد المعطيات والمكتشفات الرياضية بدقة:
            </p>

            <div class="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 text-xs font-bold space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">🌾</span>
                <h3 class="text-amber-900 font-extrabold">موقف حياتي: إنتاجية محصول القطن في مشروع الجزيرة الزراعي</h3>
              </div>
              <p class="text-gray-700 leading-relaxed text-[11px]">
                في مشروع الجزيرة العظيم، أنتج حقل نموذجي محسّن ما يعادل ${formatNum(250)} شوالاً من القطن الطبيعي عالي الجودة. إذا تم تقسيم هذا الحقل بالتساوي على ثلاثة مزارعين مجتهدين هُم (أحمد، الفاتح، ومحمد)، كم يبلغ نصيب كل مزارع بالحل التناظري الدقيق، وكيف نمثل المتبقي بالكسور الرياضية؟
              </p>
            </div>

            <div class="space-y-3.5 pt-2 text-xs font-bold text-right">
              <div>
                <p class="text-gray-700">أولاً: تحديد المعطيات بالأقسام:</p>
                <p class="text-gray-400">المعطيات: .....................................................................................................</p>
              </div>
              <div>
                <p class="text-gray-700">ثانياً: العمليات الحسابية المطلوبة لحل التوزيع بالتساوي:</p>
                <p class="text-gray-400">طريقة الحل: ...................................................................................................</p>
              </div>
              <div>
                <p class="text-gray-700">ثالثاً: إيقاف المتبقي والتعبير الكسري عنه بالباقي من القسمة المباشرة:</p>
                <p class="text-gray-400">الناتج: نصيب كل مزارع = .................... شوالاً، والمتبقي هو ....................</p>
              </div>
            </div>
          </div>
        `;
      case 10:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة العاشرة: ثامناً: مسائل حية وتطبيقات حياتية معقدة بالرموز الكلية</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              تحديات رياضية متميزة للمواقف المركبة لحل أزمة التوزيع والإنتاج السريع بمصانع النسيج والإنتاج المحلي:
            </p>

            <div class="bg-blue-50/50 border border-blue-200 rounded-2xl p-4 text-xs font-bold space-y-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">⚙️</span>
                <h3 class="text-blue-900 font-extrabold">موقف صناعي: حركة عجلة التروس والتناسب العكسي التبادلي</h3>
              </div>
              <p class="text-gray-700 leading-relaxed text-[11px]">
                يدور ترس كبير في مصنع لتعليب الفواكه والبلح بالسودان بمعدل ${formatNum(80)} دورة في الدقيقة، وهو معشق بترس أصغر يدور بمعدل ${formatNum(240)} دورة في الدقيقة. إذا كان عدد أسنان الترس الكبير يبلغ ${formatNum(36)} سناً، احسب عدد أسنان الترس الصغير معتمداً على خاصية التناسب الفني العكسي.
              </p>
            </div>

            <div class="space-y-4 pt-2 text-xs font-bold text-right">
              <div>
                <p class="text-[#5A5A40] font-black">خطوات تفصيل البرهان الرياضي وعلاقة التناسب:</p>
                <p class="text-gray-400 leading-relaxed mt-2 text-[10px]">
                  الصيغة الرياضية: س١ × ص١ = س٢ × ص٢<br/>
                  التعويض بالأرقام: ......................................................................................................................<br/>
                  حساب الناتج لأسنان الترس الأصغر: .........................................................................................................
                </p>
              </div>
            </div>
          </div>
        `;
      case 11:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الحادية عشر: تاسعاً: مستويات مهارات التفكير العليا والتحليل الناقد</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              أسئلة مخصصة لقياس مهارات التحليل والاستدلال المنطقي والتركيب الإبداعي، تطلب توظيف العمليات العكسية لحل المشكلات الغامضة ذات الحلول المتعددة:
            </p>

            <div class="space-y-4 pt-2 text-xs font-bold text-right">
              <div class="bg-gray-50 p-4 rounded-xl space-y-2 border">
                <h4 class="text-red-700">🧩 المسألة الأولى: لغز الأرقام الصحيحة والترتيب التصاعدي المعكوس:</h4>
                <p class="text-gray-700 text-[11px] leading-relaxed">
                  إذا تم ترتيب خمسة أعداد صحيحة فردية مختلفة فكان متوسطها الحسابي يساوي سالب سبعة، فما هي القيم الممكنة للعدد الأصغر بينها على خط الأعداد إذا علمت أن جميعها سالبة بالتمام؟
                </p>
                <p class="text-gray-400 text-[10px] pt-1">مسار التفكير وكتابة البرهان المقنع: .............................................................................</p>
              </div>

              <div class="bg-gray-50 p-4 rounded-xl space-y-2 border">
                <h4 class="text-red-700">📐 المسألة الثانية: تباعد الأشكال الهندسية داخل الدائرة:</h4>
                <p class="text-gray-700 text-[11px] leading-relaxed">
                  إذا تقاطع مربع كامل مساحته ${formatNum(36)} سم² في مركزه تماماً مع دائرة نصف قطرها مساوٍ لطول ضلع المربع، احسب المساحة التقريبية للمنطقة غير المشتركة بينهما.
                </p>
                <p class="text-gray-400 text-[10px] pt-1">مسار التفكير وكتابة البرهان المقنع: .............................................................................</p>
              </div>
            </div>
          </div>
        `;
      case 12:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الثانية عشر: عاشراً: أولمبياد عباقرة الرياضيات وإشعاع الذكاء</h2>
            <p class="text-xs text-gray-600 leading-relaxed text-center">
              ⭐ <b>خاص بالنوابغ المبدعين</b> ⭐<br/>
              هنيئاً لك الوصول لهذه المحطة المتقدمة من التفوق. هذه المعضلة مستوحاة من أولمبياد الرياضيات الدولي واقتباسات امتحانات قبول مدارس التميز:
            </p>

            <div class="border-2 border-amber-500 rounded-2xl p-6 bg-amber-50/20 text-center space-y-4">
              <div class="inline-block bg-amber-200 text-amber-900 text-[10px] font-black px-3 py-1 rounded-full">
                مسابقة الأمل للرياضيات المتميزة 🏆
              </div>
              <h3 class="text-xs font-black text-[#5A5A40]">تحدي المجموعات غير المحدودة واللانهائية:</h3>
              <p class="text-xs text-gray-700 leading-relaxed max-w-lg mx-auto">
                لتكن المجموعة س تحتوي على الأعداد الطبيعية التي تقبل القسمة على ٧ بدون باقٍ، ولتكن ص مجموعة المضاعفات للرقم ٣. أوجد طريقة رياضية برهانية لوصف عناصر المجموعة المشتركة اللانهائية س ∩ ص بصفة مميزة تجمع بين خصائص المعايرة الدلالية للرقمين.
              </p>
              <div class="w-full h-24 border border-dashed border-amber-300 rounded-xl bg-white flex items-center justify-center text-gray-400 text-[10px]">
                [اكتب صيغة الصفة المميزة وحل المعادلة بدقة برهانية]
              </div>
            </div>
          </div>
        `;
      case 13:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الثالثة عشر: حادي عشر: النشاط المنزلي التطبيقي والبحث بمساعدة الأسرة</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              مهمة بحثية واستقصائية للقيام بها بالمنزل بالتعاون مع أسرتك الكريمة للاستكشاف واستنباط الأرقام من الحياة اليومية:
            </p>

            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4 text-xs font-bold text-right text-emerald-900">
              <h3 class="font-extrabold flex items-center gap-1.5">
                <span>🏡 مشروع الاستقصاء البيتي: ميزانية الغذاء والإنفاق المنزلي بالكسور</span>
              </h3>
              
              <div class="space-y-3 text-emerald-800 text-[11px] leading-relaxed">
                <p>
                  <b>الخطوة الأولى:</b> اطلب من والديك قائمة بمشتريات البقالة والخضروات الأساسية لهذا الأسبوع وتكلفتها الكلية بالجنيه السوداني.
                </p>
                <p>
                  <b>الخطوة الثانية:</b> احسب النسبة المئوية للمصروف من التكلفة الميزانية العامة للغذاء.
                </p>
                <p>
                  <b>الخطوة الثالثة:</b> قم بتمثيل توزيع بنود المجهود والسلع إما بشكل رسم هندسي بياني دائري أو بجدول تناسبي لتوزيع المصاريف.
                </p>
              </div>

              <div class="border-t border-emerald-200 pt-3 flex justify-between items-center text-[10px] text-emerald-700">
                <span>توقيع ولي الأمر المشرف: .............................</span>
                <span>علامة التقييم الأسري: ممتاز 👍</span>
              </div>
            </div>
          </div>
        `;
      case 14:
        return `
          <div class="space-y-4">
            <h2 class="text-sm font-black text-[#5A5A40] border-b pb-2">الصفحة الرابعة عشر: ثاني عشر: نماذج الإجابات الشارحة والحلول المعيارية للمطابقة الذاتية</h2>
            <p class="text-xs text-gray-600 leading-relaxed">
              استخدم هذه الصفحة فقط بعد الانتهاء التام من محاولاتك الشخصية، لغرض التقييم الذاتي والتأكد التام من تطابق خطواتك مع الحل الرياضي المعتمد:
            </p>

            <div class="bg-gray-100 rounded-xl p-4 text-xs font-bold space-y-3 leading-relaxed">
              <span class="text-[10px] text-red-700 block">⚠️ تنبيه تربوي: التطابق الذاتي يرفع مستوى الفهم والاستيعاب الفردي!</span>
              <div class="space-y-2 text-gray-800 text-[11px]">
                <p>✅ <b>حل تمرين الصفحة ٣:</b> العبارة الأولى صحيحة، العبارة الثانية خاطئة لأن فاي تملك مجمَوعة جزئية هي فاي نفسها، العبارة الثالثة موجبة.</p>
                <p>✅ <b>حل تمرين الصفحة ٤:</b> السؤال الأول: ج (المجموعة الجزئية)، السؤال الثاني: أ (موجبة)، السؤال الثالث: أ (٢٢/٧).</p>
                <p>✅ <b>حل تمرين الصفحة ٥:</b> ١. الخالية (فاي) ، ٢. موجبة / موجبة ، ٣. الوتر ، ٤. خارج القسمة.</p>
                <p>✅ <b>حل تمرين الصفحة ٨:</b> مساحة متوازي الأضلاع = القاعدة × الارتفاع = ١٢ × ٨ = ٩٦ سم².</p>
              </div>
            </div>
          </div>
        `;
      case 15:
        return `
          <div class="space-y-6 text-center py-4">
            <h2 class="text-lg font-black text-[#5A5A40] underline decoration-double">الصفحة الخامسة عشر: بطاقة الإتقان والتميز الأكاديمي والتقييم النهائي</h2>
            
            <div class="max-w-md mx-auto border-4 border-double border-[#5A5A40] p-6 rounded-2xl bg-[#fcfcf9] relative space-y-4">
              <!-- Laurel graphics mockup wrapper -->
              <span class="text-4xl block">🎓🎖️</span>
              <h3 class="text-sm font-black text-[#5A5A40]">شهادة إنجاز واجتياز كفاءة الأعداد</h3>
              <p class="text-xs text-gray-600 leading-relaxed">
                يشهد المركز القومي المطور للمناهج وإدارة المدرسة والطفل الذكي بأن البطل الأكاديمي قد أتم بنجاح وبجهد ذاتي بارز حل وتطبيق كافة أوراق العمل المدمجة:
              </p>
              <p class="text-sm font-black text-amber-700 my-2">${
                worksheetScope === 'lesson'
                  ? `للدرس: ${lesson.title}`
                  : worksheetScope === 'unit'
                  ? `لوحدة: ${currentUnit?.title || ''}`
                  : `لكامل المنهج الدراسي المطور (رياضيات الصف السادس)`
              }</p>
              <p class="text-[10px] text-gray-400">ولذلك يستحق هذا الوسام المدرسي والاعتراف بالتفوق الأكاديمي.</p>

              <!-- Stamp block -->
              <div class="flex justify-around items-center pt-4 border-t border-gray-200">
                <div class="text-center text-[10px] font-bold text-gray-500">
                  <p>توقيع معلم المادة</p>
                  <p class="mt-4 text-gray-400">.......................</p>
                </div>
                <div class="w-16 h-16 rounded-full border-2 border-dashed border-[#5A5A40] flex items-center justify-center text-[8px] font-black text-[#5A5A40] tracking-tighter shrink-0 select-none">
                  ختم ولاية الخرطوم المعتمد 🇸🇩
                </div>
                <div class="text-center text-[10px] font-bold text-gray-500">
                  <p>توقيع مدير المدرسة</p>
                  <p class="mt-4 text-gray-400">.......................</p>
                </div>
              </div>
            </div>

            <div class="text-[11px] text-[#5A5A40] font-bold">
              🎉 مبروك إنجاز رحلة الـ ١٥ صفحة كاملة! أنت فخر مادة الرياضيات! 🎉
            </div>
          </div>
        `;
      default:
        return '';
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#e0e0d1] shadow-sm text-right space-y-6" id="lesson_worksheets_tab_view">
      
      {/* Top Banner Content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#f5f5f0] pb-4">
        <div>
          <h3 className="font-bold text-[#5A5A40] text-sm flex items-center gap-2">
            <span className="p-1 px-2.5 bg-[#f5f5f0] border border-[#e0e0d1] rounded-lg text-xs shrink-0">🖨️</span>
            أوراق عمل تقويمية تفاعلية ومجهزة للطباعة
          </h3>
          <p className="text-[10px] text-[#8e8e7a] mt-0.5 leading-relaxed">
            مجموعة أوراق عمل مطورة ومصممة بدقة للطباعة أو الحل المباشر، متوافقة وموائمة بالكامل وممثلة لنقلة للمناهج الإلكترونية ومقرر الرياضيات السوداني المطور.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isWatermarkDisabled ? (
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-[#5A5A40] border border-amber-200 font-bold py-2 px-3.5 rounded-xl cursor-pointer transition shadow-sm"
              title="يتطلب الرقم السري المعتمد لإزالة علامة المنهج الخلفية عن الطباعة"
            >
              <span>🔓 إزالة العلامة المائية للطباعة</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-800 border border-[#bbf7d0] font-bold py-2 px-3.5 rounded-xl shadow-sm">
              <span>👑 تم إزالة العلامة المائية</span>
            </div>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs bg-[#5A5A40] hover:bg-[#4a4a40] text-white font-bold py-2 px-4 rounded-xl cursor-pointer transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>طباعة الورقة الشاملة (PDF) 🖨️</span>
          </button>

          <button
            onClick={onBackToStudy}
            className="flex items-center gap-1.5 text-xs bg-white text-[#5A5A40] border border-[#e0e0d1] hover:bg-[#f5f5f0] font-bold py-2 px-3.5 rounded-xl cursor-pointer transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للشرح</span>
          </button>
        </div>
      </div>

      {/* ⚙️ Worksheet Generation Options Panel */}
      <div className="bg-[#fbfcfa] p-4 rounded-xl border border-[#e5e5da] space-y-4">
        <span className="text-[11px] text-[#5A5A40] font-black flex items-center gap-1.5 border-b border-[#f5f5f0] pb-2">
          <span>⚙️ خيارات تخصيص وتوليد أوراق العمل المطلوبة:</span>
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Scope selection */}
          <div className="space-y-1.5 text-right">
            <label className="text-[10px] font-extrabold text-[#5A5A40] block">نطاق ومحتوى أوراق العمل الجاري توليدها:</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setWorksheetScope('lesson')}
                className={`text-[10px] sm:text-xs py-2 px-2.5 rounded-xl border font-black transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  worksheetScope === 'lesson'
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-[#f5f5f0] hover:text-[#5A5A40]'
                }`}
              >
                <span>📘 درس معين</span>
              </button>
              <button
                type="button"
                onClick={() => setWorksheetScope('unit')}
                className={`text-[10px] sm:text-xs py-2 px-2.5 rounded-xl border font-black transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  worksheetScope === 'unit'
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-[#f5f5f0] hover:text-[#5A5A40]'
                }`}
              >
                <span>📁 كامل الوحدة</span>
              </button>
              <button
                type="button"
                onClick={() => setWorksheetScope('curriculum')}
                className={`text-[10px] sm:text-xs py-2 px-2.5 rounded-xl border font-black transition flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
                  worksheetScope === 'curriculum'
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-[#f5f5f0] hover:text-[#5A5A40]'
                }`}
              >
                <span>📚 كامل المنهج</span>
              </button>
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-right">
              <label className="text-[10px] font-extrabold text-[#5A5A40] block">
                عدد صفحات/أوراق العمل في الملف: 
                <span className="text-[#5A5A40] mx-1 bg-amber-100/70 border border-amber-200/50 px-2 py-0.5 rounded font-black text-xs">
                  {formatNum(customPagesCount)} ورقة
                </span>
              </label>
              
              {/* Presets */}
              <div className="flex gap-1" style={{ direction: 'rtl' }}>
                {[3, 5, 10, 15].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePagesCountChange(preset)}
                    className={`text-[9.5px] font-bold px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      customPagesCount === preset
                        ? 'bg-amber-600 text-white border-amber-600 font-extrabold'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {formatNum(preset)} ص
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handlePagesCountChange(customPagesCount - 1)}
                disabled={customPagesCount <= 1}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition shrink-0"
              >
                ➖
              </button>
              
              <input
                type="range"
                min="1"
                max="15"
                value={customPagesCount}
                onChange={(e) => handlePagesCountChange(parseInt(e.target.value))}
                className="flex-grow accent-[#5A5A40] h-1.5 rounded-lg cursor-pointer bg-gray-200"
              />

              <button
                type="button"
                onClick={() => handlePagesCountChange(customPagesCount + 1)}
                disabled={customPagesCount >= 15}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-xs font-bold text-[#5A5A40] cursor-pointer disabled:opacity-50 disabled:pointer-events-none transition shrink-0"
              >
                ➕
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Form for Student to fill personalization before previewing / printing */}
      <div className="bg-[#f5f5f0] p-4 rounded-xl border border-[#e0e0d1] space-y-3.5">
        <span className="text-[10px] text-[#5A5A40] font-extrabold block">📝 بيانات بطاقة الطالب الشخصية لتضمينها بداخل أوراق العمل المطبوعة:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 block">اسم الطالب ثلاثي/رباعي:</label>
            <input
              type="text"
              placeholder="اكتب اسم الطالب..."
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full text-xs font-bold text-[#4a4a40] bg-white border border-[#e0e0d1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 block">اسم المدرسة الحكومية/الأهلية:</label>
            <input
              type="text"
              placeholder="اكتب اسم المدرسة..."
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full text-xs font-bold text-[#4a4a40] bg-white border border-[#e0e0d1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 block">الصف والمرحلة:</label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full text-xs font-bold text-[#4a4a40] bg-white border border-[#e0e0d1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5A5A40]"
            />
          </div>
        </div>
      </div>

      {/* Screen view layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Navigation Sidebar of Pages on the screen */}
        <div className="bg-[#fcfcf9] border border-[#e0e0d1] p-4 rounded-2xl space-y-3">
          <span className="text-[11px] font-extrabold text-[#5A5A40] border-b border-[#f5f5f0] pb-2 block">
            📑 قائمة الفهرست والأبواب ({formatNum(pagesCount)} صفحة):
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-1 gap-1.5 max-h-[350px] lg:max-h-none overflow-y-auto w-full">
            {Array.from({ length: pagesCount }, (_, i) => i + 1).map((pageNum) => {
              const isActive = pageNum === activePage;
              return (
                <button
                  key={pageNum}
                  onClick={() => setActivePage(pageNum)}
                  className={`text-[10px] p-2 rounded-xl border text-right font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-sm' 
                      : 'bg-white text-[#5A5A40] border-[#e0e0d1] hover:bg-[#f5f5f0]'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-200' : 'text-[#8e8e7a]'}`} />
                  <span className="truncate">الصفحة {formatNum(pageNum)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active A4 simulated Page */}
        <div className="lg:col-span-3 border border-[#cbd5e1] rounded-2xl bg-slate-100 p-4 sm:p-6 flex flex-col items-center">
          
          {/* Sizing wrapper representing true aspect ratio of A4 page on desktop screen */}
          <div 
            className="w-full max-w-[210mm] min-h-[297mm] bg-white border border-gray-300 rounded-lg shadow-xl p-6 sm:p-10 relative flex flex-col justify-between"
            style={{ minHeight: '800px' }}
          >
            {/* Watermark */}
            {!isWatermarkDisabled && (
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden">
                <span className="text-4xl sm:text-6xl font-black transform -rotate-45 block text-center">
                  المنهج السوداني المطور<br/>رياضيات الصف السادس الابتدائي
                </span>
              </div>
            )}

            {/* Simulated Header block */}
            <div className="border-b-4 border-[#5A5A40] pb-3 mb-4 sm:mb-6 text-right">
              <div className="flex justify-between items-start text-[10px] sm:text-[11px] font-bold text-gray-600 gap-2">
                <div className="space-y-0.5">
                  <p>جمهورية السودان</p>
                  <p>وزارة التربية والتعليم الاتحادية</p>
                  <p className="hidden sm:block">المرحلة الابتدائية - الصف السادس</p>
                </div>
                <div className="text-center shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5A5A40] text-white flex items-center justify-center rounded-full font-black text-[9px] sm:text-xs mx-auto border border-amber-600">🇸🇩</div>
                  <p className="text-[7px] font-black mt-1 text-[#5A5A40] leading-none">نقلة للمناهج الإلكترونية</p>
                </div>
                <div className="space-y-0.5 text-left">
                  <p>الرياضيات المطورة</p>
                  <p>العام الدراسي: ٢٠٢٦م</p>
                  <p className="hidden sm:block">الدرجة النهائية: ٥٠ درجة</p>
                </div>
              </div>

              {/* Title label banner */}
              <div className="bg-[#5A5A40] text-white text-center py-1.5 px-3 rounded-lg mt-3">
                <h4 className="text-[11px] sm:text-xs font-black tracking-wide">
                  {worksheetScope === 'lesson' && `ورقة عمل تطبيقية شاملة للدرس: ${lesson.title}`}
                  {worksheetScope === 'unit' && `ورقة عمل تطبيقية شاملة للوحدة الكلية: ${currentUnit?.title || ''}`}
                  {worksheetScope === 'curriculum' && `ورقة عمل رياضية شاملة لكامل المنهج الدراسي المطور`}
                </h4>
              </div>
            </div>

            {/* Page Dynamic content slot */}
            <div className="flex-grow py-2">
              <div dangerouslySetInnerHTML={{ __html: getPageContentForScreen(activePage) }} />
            </div>

            {/* Simulated Footer block */}
            <div className="border-t border-gray-200 pt-3 mt-4 text-center text-[9px] sm:text-[10px] text-gray-500 flex justify-between items-center font-bold">
              <span>نقلة للمناهج الإلكترونية والمقرر السوداني المطور 🇸🇩</span>
              <span className="bg-[#5A5A40] text-white px-3 py-1 rounded-full text-[10px] font-black">
                الصفحة {formatNum(activePage)} من {formatNum(pagesCount)}
              </span>
              <span>بوابة الأستاذ المطور الإلكترونية</span>
            </div>
          </div>

          {/* Page flip bottom controls */}
          <div className="w-full max-w-[210mm] mt-4 flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-[#e0e0d1]">
            <button
              onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="flex items-center gap-1.5 text-xs text-[#5A5A40] border border-[#e0e0d1] hover:bg-[#f5f5f0] font-bold py-2 px-3.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الصفحة السابقة</span>
            </button>

            <span className="text-xs font-bold text-gray-600">
              الصفحة {formatNum(activePage)} / {formatNum(pagesCount)}
            </span>

            <button
              onClick={() => setActivePage((prev) => Math.min(pagesCount, prev + 1))}
              disabled={activePage === pagesCount}
              className="flex items-center gap-1.5 text-xs text-[#5A5A40] border border-[#e0e0d1] hover:bg-[#f5f5f0] font-bold py-2 px-3.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
            >
              <span>الصفحة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Password verification modal for removing watermark background */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-gray-200 shadow-2xl space-y-4 text-right">
            <h3 className="font-extrabold text-[#5A5A40] text-sm flex items-center gap-2">
              <span>🔓 إلغاء قفل العلامة المائية للطباعة</span>
            </h3>
            <p className="text-[11px] text-[#8e8e7a] leading-relaxed">
              لإزالة العلامة المائية الرسمية للوحدة التعليمية من كافة صفحات أوراق العمل الـ ١٥ المجهزة، يُرجى إدخال رمز الأمان المعتمد:
            </p>
            
            <div className="space-y-1">
              <input
                type="text"
                maxLength={10}
                placeholder="أدخل الباسورد المأذون له..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError('');
                }}
                className="w-full text-center text-xs font-mono font-bold text-[#4a4a40] bg-gray-50 border border-[#e0e0d1] rounded-lg px-2.5 py-2.5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#5A5A40]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleVerifyPassword();
                  }
                }}
              />
              {passwordError && (
                <p className="text-[10px] text-red-600 font-bold block">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                className="text-xs text-gray-500 hover:bg-gray-100 font-bold py-2 px-3 rounded-lg transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleVerifyPassword}
                className="text-xs bg-[#5A5A40] hover:bg-[#4a4a40] text-white font-bold py-2 px-4 rounded-lg transition shadow-sm cursor-pointer"
              >
                تأكيد وإلغاء القفل
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  // Screen HTML helpers 
  function getPageContentForScreen(pageNum: number): string {
    return getHtmlContentForPage(pageNum);
  }
};
