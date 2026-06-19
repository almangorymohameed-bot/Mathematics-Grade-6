import React from 'react';
import { Bell, Check, Trash, ShieldAlert, Award, Star } from 'lucide-react';
import { Notification } from '../types';
import { toEasternArabicNumerals } from '../curriculumData';

interface NotificationDrawerProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  isArabicNumeral: boolean;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  onMarkAsRead,
  onClearAll,
  isArabicNumeral,
}) => {
  const formatNum = (val: number | string) => {
    return isArabicNumeral ? toEasternArabicNumerals(val) : val.toString();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div id="notification_container" className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-w-md w-full">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-indigo-650" />
            {unreadCount > 0 && (
              <span id="unread_dot" className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {formatNum(unreadCount)}
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-800 text-sm">التنبيهات الذكية ومتابعة المنهج</h3>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-rose-500 hover:text-rose-600 transition font-medium"
          >
            مسح الكل
          </button>
        )}
      </div>

      <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">لا توجد تنبيهات جديدة حالياً.</p>
            <p className="text-[10px] text-slate-400 mt-1">
              سيقوم معلّمك الافتراضي أو أولياء أمورك بإرسال توجيهات لك هنا!
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 transition hover:bg-slate-50 flex gap-3 ${
                notif.read ? 'opacity-70' : 'bg-blue-50/20'
              }`}
            >
              <div className="mt-0.5">
                {notif.type === 'parent-goal' && (
                  <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                )}
                {notif.type === 'alert' && (
                  <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                )}
                {notif.type === 'success' && (
                  <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                )}
                {notif.type === 'info' && (
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <Bell className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start gap-1">
                  <h4 className="text-xs font-bold text-slate-800">
                    {notif.title}
                  </h4>
                  <span className="text-[9px] text-slate-400 block whitespace-nowrap">
                    {notif.date}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {notif.message}
                </p>
                {!notif.read && (
                  <button
                    onClick={() => onMarkAsRead(notif.id)}
                    className="mt-2 text-[10px] text-indigo-650 hover:underline flex items-center gap-1 font-bold"
                  >
                    <Check className="w-3 h-3" /> تم الاطلاع والمذاكرة
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
