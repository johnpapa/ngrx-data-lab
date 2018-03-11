export interface MasterDetailCommands<T> {
  close: () => void;
  add: (entity: T) => void;
  delete: (entity: T) => void;
  select: (entity: T) => void;
  update: (entity: T) => void;
}
