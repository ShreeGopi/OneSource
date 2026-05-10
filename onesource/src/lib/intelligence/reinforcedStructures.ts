import { ReinforcedStructure } from "../signals/types";

import {
    MIN_STRUCTURE_STRENGTH,
} from "../config/thresholds";

export function buildReinforcedStructures(
  reinforcedStructures: Record<
    string,
    ReinforcedStructure
  >
) {
  const sortedReinforcedStructures =
    Object.values(
      reinforcedStructures
    ).sort(
      (a, b) =>
        b.totalStrength -
        a.totalStrength
    );


  const filteredReinforcedStructures =
    sortedReinforcedStructures.filter(
      (structure) =>
        structure.totalStrength >=
        MIN_STRUCTURE_STRENGTH
    );

  return {
    sortedReinforcedStructures,
    filteredReinforcedStructures,
  };
}