import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { eventService, playerService } from '@/services/firebase';
import Button from '@/components/ui/Button';
import EventModal from '@/components/calendar/EventModal';
import ConvocationPanel from '@/components/calendar/ConvocationPanel';
import AttendanceTracker from '@/components/calendar/AttendanceTracker';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import '@/index.css';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { selectedTeamId, selectedClubId } = useApp();
  const [events, setEvents] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekCalendarRef = useRef(null);

  // Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [showConvocationPanel, setShowConvocationPanel] = useState(false);
  const [showAttendanceTracker, setShowAttendanceTracker] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadData();
  }, [selectedTeamId, selectedClubId]);

  async function loadData() {
    if (!selectedTeamId || !selectedClubId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [eventsData, playersData] = await Promise.all([
        eventService.getTeamEvents(selectedClubId, selectedTeamId),
        playerService.getTeamPlayers(selectedClubId, selectedTeamId)
      ]);
      setEvents(eventsData ?? []);
      setPlayers(playersData ?? []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setEvents([]);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Conversion Firestore Timestamp -> Date
  const toDate = (d) => (d?.toDate ? d.toDate() : d instanceof Date ? d : new Date(d));

  // Transformer les événements pour FullCalendar
  const fcEvents = useMemo(() => {
    return events.map((event) => {
      const eventDate = toDate(event.date);
      
      const colorMap = {
        training: '#3b82f6',
        match: '#10b981',
        meeting: '#8b5cf6',
        other: '#6b7280',
      };

      return {
        id: event.id,
        title: event.title,
        start: eventDate,
        end: event.dateEnd ? toDate(event.dateEnd) : eventDate,
        backgroundColor: colorMap[event.type] || colorMap.other,
        borderColor: colorMap[event.type] || colorMap.other,
        extendedProps: event,
      };
    });
  }, [events]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setShowEventModal(true);
  };

  const handleOpenConvocation = (event) => {
    setSelectedEvent(event);
    setShowConvocationPanel(true);
  };

  const handleOpenAttendance = (event) => {
    setSelectedEvent(event);
    setShowAttendanceTracker(true);
  };

  const renderEventContent = (eventInfo) => {
    const { extendedProps } = eventInfo.event;
    
    return (
      <div className="fc-event-content-wrapper group relative">
        <div className="fc-event-title font-medium truncate">
          {eventInfo.event.title}
        </div>
        <div className="text-xs opacity-75">
          {eventInfo.timeText}
        </div>
        
        {/* Badge convocation */}
        {extendedProps.requiresConvocation && !extendedProps.convocationSent && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></span>
        )}
        
        {/* Actions au survol */}
        <div className="absolute top-0 right-0 hidden group-hover:flex space-x-1 p-1 bg-white rounded shadow-lg z-10">
          {extendedProps.requiresConvocation && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpenConvocation(extendedProps);
              }}
              className="p-1 hover:bg-gray-100 rounded"
              title="Convoquer"
            >
              📨
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenAttendance(extendedProps);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            title="Présences"
          >
            ✅
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement du calendrier...</div>
      </div>
    );
  }

  if (!selectedTeamId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">
          Sélectionnez une équipe pour voir le calendrier
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📅 Calendrier & Événements</h1>
          <p className="text-gray-500 mt-1">
            Gérez vos événements, convocations et présences
          </p>
        </div>
        <div className="flex gap-3">
          {/* Bouton Statistiques - Redirige vers /attendance */}
          <Button
            variant="secondary"
            onClick={() => navigate('/attendance')}
          >
            📊 Statistiques de présence
          </Button>
          
          <Button onClick={() => {
            setSelectedEvent(null);
            setShowEventModal(true);
          }}>
            + Nouvel événement
          </Button>
        </div>
      </div>

      {/* Vue Calendrier */}
      <div className="grid grid-cols-12 gap-6">
        {/* Mini calendrier */}
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'prev',
              center: 'title',
              end: 'next',
            }}
            firstDay={1}
            fixedWeekCount={false}
            height="auto"
            locale={frLocale}
            selectable={true}
            events={[]}
            dayHeaderFormat={{ weekday: 'narrow' }}
            viewClassNames="ts-mini-calendar"
            dateClick={(info) => {
              setSelectedDate(info.date);
              if (weekCalendarRef.current) {
                const api = weekCalendarRef.current.getApi();
                api.gotoDate(info.date);
              }
            }}
            dayCellDidMount={(arg) => {
              const hasEvent = fcEvents.some(
                (ev) =>
                  new Date(ev.start).toDateString() ===
                  arg.date.toDateString()
              );
              if (hasEvent) {
                const dot = document.createElement('div');
                dot.className = 'fc-daygrid-dot';
                arg.el.appendChild(dot);
              }
            }}
          />
          
          {/* Légende */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Légende</h3>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-600">Entraînement</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Match</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-sm text-gray-600">Réunion</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-600">Autre</span>
            </div>
          </div>
        </div>

        {/* Vue semaine */}
        <div className="col-span-9 bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Semaine</h2>
          <FullCalendar
            ref={weekCalendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            initialDate={selectedDate}
            locale={frLocale}
            events={fcEvents}
            height="80vh"
            nowIndicator={true}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            allDaySlot={false}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: '',
            }}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
          />
        </div>
      </div>

      {/* Modal d'événement */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
            loadData();
          }}
        />
      )}

      {/* Panneau de convocation */}
      {showConvocationPanel && selectedEvent && (
        <ConvocationPanel
          event={selectedEvent}
          players={players}
          onClose={() => {
            setShowConvocationPanel(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            setShowConvocationPanel(false);
            setSelectedEvent(null);
            loadData();
          }}
        />
      )}

      {/* Tracker de présence */}
      {showAttendanceTracker && selectedEvent && (
        <AttendanceTracker
          event={selectedEvent}
          players={players}
          onClose={() => {
            setShowAttendanceTracker(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            setShowAttendanceTracker(false);
            setSelectedEvent(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}