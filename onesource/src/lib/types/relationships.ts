export type RelationshipRecord = {
  type: string;

  left: string;

  right: string;

  count: number;
};

export type ReinforcedStructure = {
  emotion: string;

  hooks: Record<string, number>;

  visuals: Record<string, number>;

  ctas: Record<string, number>;

  niches: Record<string, number>;

  totalStrength: number;
};