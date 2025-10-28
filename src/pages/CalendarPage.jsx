import { useState, useEffect, useMemo } from 'react';
import { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { matchService } from '@/services/firebase';
import Button from '../components/ui/Button';
// import AddMatchModal from '../components/calendar/AddMatchModal'; // TODO: Créer ce composant

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import '@/index.css';

export default function CalendarPage() {
  const { selectedTeamId, selectedClubId } = useApp();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekCalendarRef = useRef(null);

  useEffect(() => {
    loadMatches();
  }, [selectedTeamId, selectedClubId]);

  // 🔹 Chargement des matchs depuis Firestore
  async function loadMatches() {
    if (!selectedTeamId || !selectedClubId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await matchService.getTeamMatches(selectedClubId, selectedTeamId);
      setMatches(data ?? []);
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
      setMatches([]);
    } finally {
      setIsLoading(false);
    }
  }

  // 🔹 Conversion Firestore Timestamp -> Date
  const toDate = (d) => (d?.toDate ? d.toDate() : new Date(d));

  // 🔹 Prépare les événements pour FullCalendar
  const fcEvents = useMemo(
    () =>
      matches.map((m) => ({
        id: m.id,
        title: `${m.isHome ? 'vs' : '@'} ${m.opponent ?? 'Adversaire'}`,
        start: toDate(m.date),
        end: toDate(m.dateEnd ?? m.date),
        allDay: true,
        backgroundColor: m.isHome ? '#c7f9cc' : '#bfdbfe',
        borderColor: 'transparent',
      })),
    [matches]
  );

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
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
          <p className="text-gray-500 mt-1">
            Vue mensuelle et hebdomadaire de vos matchs
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Nouveau match</Button>
      </div>

      {/* ---- Layout à deux colonnes ---- */}
      <div className="grid grid-cols-12 gap-6">
        {/* 🗓️ Colonne gauche : mini calendrier */}
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
            events={fcEvents}
            dayHeaderFormat={{ weekday: 'narrow' }} // Première lettre seulement
            viewClassNames="ts-mini-calendar"
            dateClick={(info) => {
  setSelectedDate(info.date);
  // 🧭 déplace la vue semaine sur cette date
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
        </div>

        {/* 📅 Colonne droite : vue semaine */}
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
          />
        </div>
      </div>

      {/* ---- Modal d'ajout de match ---- */}
      {/* TODO: Créer le composant AddMatchModal
      {showAddModal && (
        <AddMatchModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadMatches();
          }}
        />
      )}
      */}
    </div>
  );
}