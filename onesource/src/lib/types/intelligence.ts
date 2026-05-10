import { RelationshipRecord } from "./relationships";
import { ReinforcedStructure } from "./relationships";

export type DatasetSummary = {
  topEmotion?: [string, number];

  topHook?: [string, number];

  topPlatform?: [string, number];
};

export type PatternResult = {
  patternCount: Record<string, number>;

  topPatterns: [string, number][];
};

export type GroupedRelationships = Record<
  string,
  RelationshipRecord[]
>;

export type RelationshipResult = {
  relationships: RelationshipRecord[];

  groupedRelationships: GroupedRelationships;

  reinforcedStructures: Record<
    string,
    ReinforcedStructure
  >;
};

export type ReinforcedResult = {
  sortedReinforcedStructures:
    ReinforcedStructure[];

  filteredReinforcedStructures:
    ReinforcedStructure[];
};

export type TaxonomyCluster = {
  count: number;

  patterns: string[];
};

export type PlatformPatternInsight = {
  platform: string;

  top?: [string, number];

  percentage: number;

  label: string;
};

export type CrossPlatformEntry = {
  platform: string;

  count: number;

  percentage: number;

  label: string;
};

export type CrossPlatformPattern = {
  pattern: string;

  platforms: CrossPlatformEntry[];
};

export type PlatformResult = {
  topPlatformPatterns:
    PlatformPatternInsight[];

  crossPlatformData:
    CrossPlatformPattern[];
};

export type IntelligenceResult = {
  summary: DatasetSummary;

  patterns: PatternResult;

  relationships: RelationshipResult;

  reinforced: ReinforcedResult;

  taxonomy: [string, TaxonomyCluster][];

  platform: PlatformResult;
};