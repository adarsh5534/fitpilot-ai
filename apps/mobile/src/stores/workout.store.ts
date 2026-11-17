import { create } from 'zustand';
import { apiClient } from '@/lib/api-client';
import type {
  Exercise,
  LogSetInput,
  WorkoutSessionDetail,
  WorkoutSet,
  WorkoutSuggestion,
} from '@fitpilot/shared';

interface WorkoutState {
  todaySuggestion: WorkoutSuggestion | null;
  activeSession: WorkoutSessionDetail | null;
  history: WorkoutSessionDetail[];
  exerciseLibrary: Exercise[];
  isLoading: boolean;
  error: string | null;

  // Timers
  elapsedSeconds: number;
  restTimer: number; // remaining seconds
  restTimerDuration: number; // initial duration (e.g. 90)

  // Actions
  fetchTodaySuggestion: () => Promise<void>;
  fetchActiveSession: () => Promise<void>;
  startSession: (planDayId?: string, name?: string) => Promise<WorkoutSessionDetail | null>;
  cancelSession: () => Promise<boolean>;
  logSet: (input: LogSetInput) => Promise<WorkoutSet | null>;
  finishSession: (notes?: string) => Promise<WorkoutSessionDetail | null>;
  fetchHistory: () => Promise<void>;
  fetchExerciseLibrary: (category?: string, search?: string) => Promise<void>;

  // Timer controls
  startRestTimer: (seconds?: number) => void;
  cancelRestTimer: () => void;
  addRestSeconds: (seconds?: number) => void;
  tick: () => void;
  resetActiveState: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  todaySuggestion: null,
  activeSession: null,
  history: [],
  exerciseLibrary: [],
  isLoading: false,
  error: null,

  elapsedSeconds: 0,
  restTimer: 0,
  restTimerDuration: 90,

  fetchTodaySuggestion: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get<WorkoutSuggestion>('/workouts/suggested-today');
      if (res.success) {
        set({ todaySuggestion: res.data, isLoading: false });
      } else {
        set({ error: res.error.message, isLoading: false });
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to fetch recommendation',
        isLoading: false,
      });
    }
  },

  fetchActiveSession: async () => {
    try {
      const res = await apiClient.get<WorkoutSessionDetail | null>('/workouts/sessions/active');
      if (res.success && res.data) {
        const startedAt = new Date(res.data.started_at).getTime();
        const now = Date.now();
        const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));
        set({ activeSession: res.data, elapsedSeconds: elapsed });
      } else {
        set({ activeSession: null });
      }
    } catch {
      set({ activeSession: null });
    }
  },

  startSession: async (planDayId?: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const payload: { plan_day_id?: string; name: string } = {
        name: name || 'Live Workout Session',
      };
      if (planDayId) {
        payload.plan_day_id = planDayId;
      }

      const res = await apiClient.post<WorkoutSessionDetail>('/workouts/sessions/start', payload);

      if (res.success) {
        set({
          activeSession: res.data,
          elapsedSeconds: 0,
          restTimer: 0,
          isLoading: false,
        });
        return res.data;
      } else {
        const msg = res.error?.message || 'Failed to start workout session';
        set({ error: msg, isLoading: false });
        return null;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to start workout';
      set({
        error: msg,
        isLoading: false,
      });
      return null;
    }
  },

  cancelSession: async () => {
    const session = get().activeSession;
    if (!session) return true;

    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.delete(`/workouts/sessions/${session.id}`);
      set({
        activeSession: null,
        elapsedSeconds: 0,
        restTimer: 0,
        isLoading: false,
      });
      return res.success;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to cancel workout session',
        isLoading: false,
      });
      return false;
    }
  },

  logSet: async (input: LogSetInput) => {
    const session = get().activeSession;
    if (!session) return null;

    try {
      const res = await apiClient.post<WorkoutSet>(
        `/workouts/sessions/${session.id}/sets`,
        input
      );

      if (res.success && res.data) {
        // Optimistically append set and recalculate stats
        const updatedSets = [...(session.sets || []), res.data];
        let totalVolume = 0;
        let setsCount = 0;

        for (const s of updatedSets) {
          if (!s.is_skipped && s.reps_completed && s.weight_kg) {
            totalVolume += s.reps_completed * s.weight_kg;
            setsCount++;
          }
        }

        set({
          activeSession: {
            ...session,
            sets: updatedSets,
            total_volume_kg: Math.round(totalVolume),
            total_sets_completed: setsCount,
          },
        });

        // Trigger rest timer
        get().startRestTimer(90);

        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  finishSession: async (notes?: string) => {
    const session = get().activeSession;
    if (!session) return null;

    set({ isLoading: true });
    try {
      const res = await apiClient.patch<WorkoutSessionDetail>(
        `/workouts/sessions/${session.id}/finish`,
        {
          notes,
          duration_seconds: get().elapsedSeconds,
        }
      );

      if (res.success) {
        set({
          activeSession: null,
          elapsedSeconds: 0,
          restTimer: 0,
          isLoading: false,
        });
        // Refresh suggestion and history
        get().fetchTodaySuggestion();
        get().fetchHistory();
        return res.data;
      } else {
        set({ error: res.error.message, isLoading: false });
        return null;
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Failed to finish session',
        isLoading: false,
      });
      return null;
    }
  },

  fetchHistory: async () => {
    try {
      const res = await apiClient.get<WorkoutSessionDetail[]>('/workouts/sessions/history');
      if (res.success && res.data) {
        set({ history: res.data });
      }
    } catch {
      // Ignore
    }
  },

  fetchExerciseLibrary: async (category?: string, search?: string) => {
    try {
      let url = '/exercises?limit=50';
      if (category && category !== 'All') {
        url += `&muscle_group=${encodeURIComponent(category.toLowerCase())}`;
      }
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const res = await apiClient.get<{ exercises: Exercise[]; total: number }>(url);
      if (res.success && res.data) {
        set({ exerciseLibrary: res.data.exercises });
      }
    } catch {
      // Ignore
    }
  },

  startRestTimer: (seconds = 90) => {
    set({ restTimer: seconds, restTimerDuration: seconds });
  },

  cancelRestTimer: () => {
    set({ restTimer: 0 });
  },

  addRestSeconds: (seconds = 30) => {
    set((state) => ({
      restTimer: state.restTimer + seconds,
      restTimerDuration: Math.max(state.restTimerDuration, state.restTimer + seconds),
    }));
  },

  tick: () => {
    set((state) => ({
      elapsedSeconds: state.activeSession ? state.elapsedSeconds + 1 : 0,
      restTimer: state.restTimer > 0 ? state.restTimer - 1 : 0,
    }));
  },

  resetActiveState: () => {
    set({ activeSession: null, elapsedSeconds: 0, restTimer: 0 });
  },
}));
