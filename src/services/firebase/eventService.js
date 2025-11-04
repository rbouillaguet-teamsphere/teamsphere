// src/services/firebase/eventService.js
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  getDoc,
  query, 
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase'; // ✅ Correction: import depuis le niveau supérieur

/**
 * Service de gestion des événements (entraînements, matchs, réunions, etc.)
 */
export const eventService = {
  /**
   * Créer un nouvel événement
   */
  async create(clubId, teamId, eventData) {
    try {
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      
      const newEvent = {
        ...eventData,
        date: eventData.date instanceof Date ? Timestamp.fromDate(eventData.date) : eventData.date,
        dateEnd: eventData.dateEnd instanceof Date ? Timestamp.fromDate(eventData.dateEnd) : eventData.dateEnd,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        convocationSent: false,
        convocationDate: null,
      };

      const docRef = await addDoc(eventsRef, newEvent);
      return { id: docRef.id, ...newEvent };
    } catch (error) {
      console.error('Erreur création événement:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les événements d'une équipe
   */
  async getTeamEvents(clubId, teamId) {
    try {
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération événements:', error);
      throw error;
    }
  },

  /**
   * Récupérer un événement par ID
   */
  async getById(clubId, teamId, eventId) {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      const eventDoc = await getDoc(eventRef);
      
      if (!eventDoc.exists()) {
        throw new Error('Événement non trouvé');
      }
      
      return { id: eventDoc.id, ...eventDoc.data() };
    } catch (error) {
      console.error('Erreur récupération événement:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un événement
   */
  async update(clubId, teamId, eventId, eventData) {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      
      const updateData = {
        ...eventData,
        date: eventData.date instanceof Date ? Timestamp.fromDate(eventData.date) : eventData.date,
        dateEnd: eventData.dateEnd instanceof Date ? Timestamp.fromDate(eventData.dateEnd) : eventData.dateEnd,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(eventRef, updateData);
      return { id: eventId, ...updateData };
    } catch (error) {
      console.error('Erreur mise à jour événement:', error);
      throw error;
    }
  },

  /**
   * Supprimer un événement
   */
  async delete(clubId, teamId, eventId) {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (error) {
      console.error('Erreur suppression événement:', error);
      throw error;
    }
  },

  /**
   * Récupérer les événements par type
   */
  async getByType(clubId, teamId, eventType) {
    try {
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      const q = query(
        eventsRef, 
        where('type', '==', eventType),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération événements par type:', error);
      throw error;
    }
  },

  /**
   * Récupérer les événements à venir
   */
  async getUpcoming(clubId, teamId) {
    try {
      const now = Timestamp.now();
      const eventsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'events');
      const q = query(
        eventsRef, 
        where('date', '>=', now),
        orderBy('date', 'asc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération événements à venir:', error);
      throw error;
    }
  },

  /**
   * Marquer une convocation comme envoyée
   */
  async markConvocationSent(clubId, teamId, eventId) {
    try {
      const eventRef = doc(db, 'clubs', clubId, 'teams', teamId, 'events', eventId);
      await updateDoc(eventRef, {
        convocationSent: true,
        convocationDate: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur mise à jour convocation:', error);
      throw error;
    }
  }
};

/**
 * Service de gestion des convocations
 */
export const convocationService = {
  /**
   * Créer des convocations pour un événement
   */
  async createConvocations(clubId, teamId, eventId, playerIds) {
    try {
      const convocsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'convocations');
      
      const promises = playerIds.map(playerId => 
        addDoc(convocsRef, {
          eventId,
          playerId,
          status: 'pending',
          notifiedAt: serverTimestamp(),
          respondedAt: null,
          createdAt: serverTimestamp(),
        })
      );

      await Promise.all(promises);
      
      // Marquer l'événement comme convoqué
      await eventService.markConvocationSent(clubId, teamId, eventId);
    } catch (error) {
      console.error('Erreur création convocations:', error);
      throw error;
    }
  },

  /**
   * Récupérer les convocations d'un événement
   */
  async getEventConvocations(clubId, teamId, eventId) {
    try {
      const convocsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'convocations');
      const q = query(convocsRef, where('eventId', '==', eventId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération convocations:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour le statut d'une convocation
   */
  async updateStatus(clubId, teamId, convocationId, status) {
    try {
      const convocRef = doc(db, 'clubs', clubId, 'teams', teamId, 'convocations', convocationId);
      await updateDoc(convocRef, {
        status,
        respondedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur mise à jour statut convocation:', error);
      throw error;
    }
  },

  /**
   * Récupérer les convocations d'un joueur
   */
  async getPlayerConvocations(clubId, teamId, playerId) {
    try {
      const convocsRef = collection(db, 'clubs', clubId, 'teams', teamId, 'convocations');
      const q = query(convocsRef, where('playerId', '==', playerId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération convocations joueur:', error);
      throw error;
    }
  }
};

/**
 * Service de gestion des présences
 */
export const attendanceService = {
  /**
   * Enregistrer la présence d'un joueur
   */
  async recordAttendance(clubId, teamId, eventId, playerId, isPresent, reason = null, recordedBy) {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      
      // Vérifier si une présence existe déjà
      const q = query(
        attendancesRef,
        where('eventId', '==', eventId),
        where('playerId', '==', playerId)
      );
      const snapshot = await getDocs(q);

      const attendanceData = {
        eventId,
        playerId,
        present: isPresent,
        reason: reason || null,
        recordedAt: serverTimestamp(),
        recordedBy,
      };

      if (!snapshot.empty) {
        // Mettre à jour l'entrée existante
        const existingDoc = snapshot.docs[0];
        await updateDoc(doc(db, 'clubs', clubId, 'teams', teamId, 'attendances', existingDoc.id), attendanceData);
      } else {
        // Créer une nouvelle entrée
        await addDoc(attendancesRef, {
          ...attendanceData,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Erreur enregistrement présence:', error);
      throw error;
    }
  },

  /**
   * Enregistrer plusieurs présences en une fois
   */
  async recordBulkAttendances(clubId, teamId, eventId, attendances, recordedBy) {
    try {
      const promises = attendances.map(({ playerId, present, reason }) =>
        this.recordAttendance(clubId, teamId, eventId, playerId, present, reason, recordedBy)
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Erreur enregistrement présences multiples:', error);
      throw error;
    }
  },

  /**
   * Récupérer les présences d'un événement
   */
  async getEventAttendances(clubId, teamId, eventId) {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      const q = query(attendancesRef, where('eventId', '==', eventId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération présences:', error);
      throw error;
    }
  },

  /**
   * Récupérer l'historique des présences d'un joueur
   */
  async getPlayerAttendances(clubId, teamId, playerId) {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      const q = query(attendancesRef, where('playerId', '==', playerId));
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erreur récupération présences joueur:', error);
      throw error;
    }
  },

  /**
   * Calculer les statistiques de présence d'un joueur
   */
  async getPlayerAttendanceStats(clubId, teamId, playerId) {
    try {
      const attendances = await this.getPlayerAttendances(clubId, teamId, playerId);
      
      const total = attendances.length;
      const present = attendances.filter(a => a.present).length;
      const absent = total - present;
      const rate = total > 0 ? (present / total) * 100 : 0;

      return {
        total,
        present,
        absent,
        rate: Math.round(rate * 10) / 10
      };
    } catch (error) {
      console.error('Erreur calcul statistiques présence:', error);
      throw error;
    }
  },

  /**
   * Récupérer les statistiques de présence de l'équipe
   */
  async getTeamAttendanceStats(clubId, teamId) {
    try {
      const attendancesRef = collection(db, 'clubs', clubId, 'teams', teamId, 'attendances');
      const snapshot = await getDocs(attendancesRef);
      
      const attendances = snapshot.docs.map(doc => doc.data());
      const total = attendances.length;
      const present = attendances.filter(a => a.present).length;
      const rate = total > 0 ? (present / total) * 100 : 0;

      return {
        total,
        present,
        absent: total - present,
        rate: Math.round(rate * 10) / 10
      };
    } catch (error) {
      console.error('Erreur calcul statistiques équipe:', error);
      throw error;
    }
  }
};
