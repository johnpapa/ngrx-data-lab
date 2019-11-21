// Custom Villain API Actions
import { createAction, props } from '@ngrx/store';

export interface SetSuperVillainProps {
  id: number;
  isSuper: boolean;
  correlationId?: any;
  tag?: string;
}

/** SetSuperVillain action creator */
export const setSuperVillain = createAction(
  'Set Super Villain',
  props<SetSuperVillainProps>()
);
