import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Edit3, Trash2, Calendar, Clock, Tag, Palette, Play, Users, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlassCard = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-white/10 dark:bg-slate-800/20
        border border-white/20 dark:border-slate-700/50
        rounded-2xl shadow-lg
        transform transition-all duration-700 ease-out
        hover:scale-[1.02] hover:shadow-3xl hover:bg-white/15 dark:hover:bg-slate-800/30
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const PulseIndicator = ({ color = "bg-sky-500", size = "w-3 h-3" }) => (
  <div className="relative">
    <div className={`${size} ${color} rounded-full`} />
    <div className={`absolute inset-0 ${size} ${color} rounded-full animate-ping opacity-75`} />
  </div>
);

const StatCard = ({ icon, title, value, subtitle, gradient, accentColor, delay = 0 }) => {
  return (
    <GlassCard delay={delay}>
      <div className="relative overflow-hidden group">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}15, transparent 70%)`
          }}
        />

        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
              {React.cloneElement(icon, {
                size: 20,
                className: "text-white drop-shadow-lg"
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-2xl font-bold text-slate-700 dark:text-white mb-1">
              {value}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            {subtitle && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </div>
    </GlassCard>
  );
};

const TestSchedule = ({ darkMode = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [eventType, setEventType] = useState('Regression');
  const [eventColor, setEventColor] = useState('#6366f1');
  const [selectedDate, setSelectedDate] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents = [
      {
        id: '1',
        title: 'API Regression Test',
        details: 'Complete API regression testing for v2.0',
        type: 'Regression',
        color: '#6366f1',
        start: new Date(2025, 6, 18),
        end: new Date(2025, 6, 18)
      },
      {
        id: '2',
        title: 'Smoke Test',
        details: 'Quick smoke test after deployment',
        type: 'Smoke',
        color: '#10b981',
        start: new Date(2025, 6, 20),
        end: new Date(2025, 6, 20)
      },
      {
        id: '3',
        title: 'Performance Testing',
        details: 'Load testing for new features',
        type: 'Performance',
        color: '#f59e0b',
        start: new Date(2025, 6, 22),
        end: new Date(2025, 6, 22)
      }
    ];
    setEvents(mockEvents);
  }, []);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long'
    }).format(date);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setSelectedEvent(null);
    setEventTitle('');
    setEventDetails('');
    setEventType('Regression');
    setEventColor('#6366f1');
    setIsModalOpen(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setEventTitle(event.title);
    setEventDetails(event.details || '');
    setEventType(event.type || 'Regression');
    setEventColor(event.color || '#6366f1');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (eventTitle) {
      const data = {
        id: selectedEvent?.id || Date.now().toString(),
        title: eventTitle,
        details: eventDetails,
        type: eventType,
        color: eventColor,
        start: selectedDate,
        end: selectedDate,
      };

      if (selectedEvent) {
        setEvents(events.map(e => e.id === selectedEvent.id ? data : e));
      } else {
        setEvents([...events, data]);
      }
      setIsModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents(events.filter(e => e.id !== selectedEvent.id));
      setIsModalOpen(false);
    }
  };

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push({ date: day, isCurrentMonth: false });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }

    // Next month's leading days - 항상 42개(6주)로 고정
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }

    return days;
  };

  const getEventsForDay = (date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  const typeIcons = {
    Regression: '🔄',
    Smoke: '💨',
    Performance: '⚡',
    Security: '🔒'
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-slate-50 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-y-auto relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 dark:bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Header */}
      <motion.header
        className="flex justify-between items-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-sky-600 dark:from-white dark:to-sky-300 bg-clip-text text-transparent tracking-tight">
            테스트 스케줄
          </h1>
          <p className="text-slate-500 dark:text-slate-400">테스트 일정을 관리하고 추적하세요</p>
        </div>

        <div className="flex items-center space-x-4">
          <PulseIndicator color="bg-sky-500" size="w-2 h-2" />
          <span className="text-sky-500 text-sm font-medium">실시간 동기화</span>
        </div>
      </motion.header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard
          icon={<Calendar />}
          title="이번 달 총 테스트"
          value="12"
          subtitle="지난 달 대비 +3"
          gradient="from-sky-500 to-blue-600"
          accentColor="#0ea5e9"
          delay={0}
        />
        <StatCard
          icon={<Play />}
          title="진행 중인 테스트"
          value="3"
          subtitle="오늘 2개 예정"
          gradient="from-blue-500 to-indigo-600"
          accentColor="#3b82f6"
          delay={100}
        />
        <StatCard
          icon={<Users />}
          title="참여 팀원"
          value="8"
          subtitle="활성 사용자"
          gradient="from-cyan-500 to-sky-600"
          accentColor="#06b6d4"
          delay={200}
        />
        <StatCard
          icon={<Target />}
          title="완료율"
          value="94%"
          subtitle="목표: 95%"
          gradient="from-emerald-500 to-teal-600"
          accentColor="#10b981"
          delay={300}
        />
      </div>

      {/* Calendar and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <GlassCard delay={400}>
            {/* Calendar Header */}
            <div className="p-6 border-b border-white/10 dark:border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={handleToday}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-500/20 hover:bg-sky-500/30 text-sky-600 dark:text-sky-400 border border-sky-500/30 transition-all"
                  >
                    오늘
                  </motion.button>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={handlePrevMonth}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </motion.button>

                    <h2 className="text-xl font-semibold min-w-[180px] text-center text-slate-700 dark:text-white">
                      {formatDate(currentDate)}
                    </h2>

                    <motion.button
                      onClick={handleNextMonth}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 text-slate-600 dark:text-slate-400 transition-all"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>

                <motion.button
                  onClick={() => {
                    setSelectedDate(new Date());
                    setSelectedEvent(null);
                    setEventTitle('');
                    setEventDetails('');
                    setEventType('Regression');
                    setEventColor('#6366f1');
                    setIsModalOpen(true);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Plus className="h-4 w-4" />
                  <span>새 일정</span>
                </motion.button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-4">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <div key={day}
                    className={`p-4 text-center text-sm font-semibold ${
                      index === 0 || index === 6
                        ? 'text-red-500 dark:text-red-400'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth().map((dayInfo, index) => {
                  const dayEvents = getEventsForDay(dayInfo.date);
                  const isToday = isSameDay(dayInfo.date, new Date());
                  const isWeekend = dayInfo.date.getDay() === 0 || dayInfo.date.getDay() === 6;

                  return (
                    <motion.div
                      key={`${dayInfo.date.getFullYear()}-${dayInfo.date.getMonth()}-${dayInfo.date.getDate()}-${index}`}
                      onClick={() => handleDayClick(dayInfo.date)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        h-28 p-2 border border-white/10 dark:border-slate-700/30 rounded-lg cursor-pointer
                        transition-all duration-200 hover:bg-white/20 dark:hover:bg-slate-700/30
                        ${dayInfo.isCurrentMonth
                          ? 'bg-white/5 dark:bg-slate-800/20'
                          : 'bg-slate-100/30 dark:bg-slate-800/10 opacity-50'
                        }
                        ${isToday ? 'ring-2 ring-sky-500 bg-sky-50/30 dark:bg-sky-900/20' : ''}
                        flex flex-col overflow-hidden
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`
                          text-sm font-medium flex-shrink-0
                          ${isToday
                            ? 'bg-sky-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'
                            : dayInfo.isCurrentMonth
                              ? (isWeekend ? 'text-red-500 dark:text-red-400' : 'text-slate-700 dark:text-slate-300')
                              : 'text-slate-400 dark:text-slate-600'
                          }
                        `}>
                          {dayInfo.date.getDate()}
                        </span>

                        {dayInfo.isCurrentMonth && (
                          <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 overflow-hidden">
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <motion.div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                              whileHover={{ scale: 1.05 }}
                              className="text-xs px-2 py-1 rounded-md cursor-pointer backdrop-blur-sm text-white font-medium flex items-center space-x-1 truncate"
                              style={{ backgroundColor: event.color + 'CC' }}
                            >
                              <span className="flex-shrink-0">{typeIcons[event.type] || '📝'}</span>
                              <span className="truncate">{event.title}</span>
                            </motion.div>
                          ))}

                          {dayEvents.length > 2 && (
                            <div className="text-xs px-2 py-1 rounded-md bg-slate-200/80 dark:bg-slate-600/80 text-slate-600 dark:text-slate-300 backdrop-blur-sm">
                              +{dayEvents.length - 2}개 더
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Today's Events */}
          <GlassCard delay={600}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-sky-500" />
                <span>오늘의 일정</span>
              </h3>
              <div className="space-y-3">
                {events
                  .filter(event => isSameDay(event.start, new Date()))
                  .map((event) => (
                    <motion.div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 rounded-lg bg-white/20 dark:bg-slate-700/30 border border-white/20 dark:border-slate-600/30 cursor-pointer backdrop-blur-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: event.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 dark:text-white truncate">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {event.type}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                {events.filter(event => isSameDay(event.start, new Date())).length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
                    오늘 예정된 테스트가 없습니다
                  </p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Quick Stats */}
          <GlassCard delay={700}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4">빠른 통계</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">이번 주</span>
                  <span className="text-sky-500 font-bold">5개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">이번 달</span>
                  <span className="text-blue-500 font-bold">12개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">성공률</span>
                  <span className="text-emerald-500 font-bold">94%</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                    {selectedEvent ? '일정 수정' : '새 일정 추가'}
                  </h3>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    className="p-2 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 transition-all"
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                      제목
                    </label>
                    <input
                      type="text"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="일정 제목을 입력하세요"
                      className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/50 dark:bg-slate-700/50 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                      상세 내용
                    </label>
                    <textarea
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                      placeholder="상세 내용을 입력하세요"
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/50 dark:bg-slate-700/50 dark:border-slate-600/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                        <Tag className="inline h-4 w-4 mr-1" />
                        테스트 유형
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/50 dark:bg-slate-700/50 dark:border-slate-600/50 text-slate-900 dark:text-white backdrop-blur-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      >
                        <option value="Regression">Regression</option>
                        <option value="Smoke">Smoke</option>
                        <option value="Performance">Performance</option>
                        <option value="Security">Security</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                        <Palette className="inline h-4 w-4 mr-1" />
                        색상
                      </label>
                      <div className="flex space-x-2 pt-2">
                        {['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'].map(color => (
                          <motion.button
                            key={color}
                            onClick={() => setEventColor(color)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-8 h-8 rounded-full transition-all ${
                              eventColor === color ? 'ring-2 ring-offset-2 ring-sky-500 ring-offset-white dark:ring-offset-slate-800' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <div>
                    {selectedEvent && (
                      <motion.button
                        onClick={handleDelete}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>삭제</span>
                      </motion.button>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <motion.button
                      onClick={() => setIsModalOpen(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all"
                    >
                      취소
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      저장
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TestSchedule;