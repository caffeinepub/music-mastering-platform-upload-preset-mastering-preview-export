import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MasteringProject } from '../backend';

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<MasteringProject[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ trackName, preset }: { trackName: string; preset: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Store the preset key (e.g., 'clean', 'warm') instead of the localized name
      return actor.createProject(trackName, preset);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      console.error('Failed to create project:', error);
      throw new Error(error.message || 'Failed to create project');
    }
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error: any) => {
      console.error('Failed to delete project:', error);
      throw new Error(error.message || 'Failed to delete project');
    }
  });
}
