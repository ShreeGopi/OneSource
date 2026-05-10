import { buildPatterns } from "./patterns";
import { buildTaxonomyClusters } from "./taxonomy";
import { buildPlatformInsights } from "./platforms";
import { buildDatasetSummary } from "./summary";
import { Creative } from "../types/creative";
import { IntelligenceResult } from "../types/intelligence";
import { buildRelationships } from "../signals/buildRelationships";
import { buildReinforcedStructures } from "./reinforcedStructures";


export function buildIntelligence(
  creatives: Creative[]
): IntelligenceResult {
  const summary = buildDatasetSummary(creatives);

  const patterns = buildPatterns(creatives);

  const relationships = buildRelationships(creatives);

  const reinforced = buildReinforcedStructures(
    relationships.reinforcedStructures
  );

  const taxonomy = buildTaxonomyClusters(
    patterns.topPatterns
  );

  const platform = buildPlatformInsights(
    creatives,
    patterns.topPatterns
  );

  return {
    summary,
    patterns,
    relationships,
    reinforced,
    taxonomy,
    platform,
  };
}