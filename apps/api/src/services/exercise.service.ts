import { getSupabaseClient } from '../config/supabase';
import { AppError } from '../middleware/error-handler';
import type { Exercise, ExerciseFilterInput } from '@fitpilot/shared';

export class ExerciseService {
  static async listExercises(
    filters: ExerciseFilterInput
  ): Promise<{ exercises: Exercise[]; total: number }> {
    const supabase = getSupabaseClient();

    let query = supabase
      .from('exercises')
      .select('*', { count: 'exact' })
      .eq('is_active', true);

    if (filters.muscle_group) {
      query = query.contains('muscle_groups', [filters.muscle_group]);
    }

    if (filters.equipment) {
      query = query.contains('equipment', [filters.equipment]);
    }

    if (filters.difficulty) {
      query = query.eq('difficulty', filters.difficulty);
    }

    if (filters.search) {
      const cleanSearch = filters.search.trim();
      query = query.ilike('name', `%${cleanSearch}%`);
    }

    const limit = filters.limit ?? 50;
    const offset = filters.offset ?? 0;

    query = query
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      throw new AppError(500, 'DATABASE_ERROR', `Failed to fetch exercises: ${error.message}`);
    }

    return {
      exercises: (data as Exercise[]) || [],
      total: count ?? 0,
    };
  }

  static async getExerciseById(id: string): Promise<Exercise> {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new AppError(404, 'NOT_FOUND', 'Exercise not found');
    }

    return data as Exercise;
  }
}
