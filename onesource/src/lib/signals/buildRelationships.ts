import {
  RelationshipRecord,
  ReinforcedStructure,
} from "../types/relationships";

import { Creative } from "../types/creative";
import { extractCreativeSignals } from "./extractSignals";

export const buildRelationships = (
  creatives: Creative[]
) => {
  const relationshipMap: Record<
    string,
    number
  > = {};

  const reinforcedStructures: Record<
    string,
    ReinforcedStructure
  > = {};

  creatives.forEach((item) => {
    const {
      emotions,
      hooks,
      visuals,
      ctas,
      niches,
    } = extractCreativeSignals(item);

    emotions.forEach((emotion: string) => {

      // Reinforced structures

      if (!reinforcedStructures[emotion]) {
        reinforcedStructures[emotion] = {
          emotion,
          hooks: {},
          visuals: {},
          ctas: {},
          niches: {},
          totalStrength: 0,
        };
      }

      hooks.forEach((hook: string) => {

        // Emotion ↔ Hook

        const relationshipKey =
          `Emotion-Hook::${emotion}::${hook}`;

        relationshipMap[relationshipKey] =
          (relationshipMap[relationshipKey] || 0) + 1;

        reinforcedStructures[emotion].hooks[
          hook
        ] =
          (reinforcedStructures[emotion].hooks[
            hook
          ] || 0) + 1;

        reinforcedStructures[
          emotion
        ].totalStrength += 1;

        visuals.forEach((visual: string) => {

          // Hook ↔ Visual

          const visualKey =
            `Hook-Visual::${hook}::${visual}`;

          relationshipMap[visualKey] =
            (relationshipMap[visualKey] || 0) + 1;

          reinforcedStructures[
            emotion
          ].visuals[visual] =
            (reinforcedStructures[
              emotion
            ].visuals[visual] || 0) + 1;

          reinforcedStructures[
            emotion
          ].totalStrength += 1;
        });
      });

      ctas.forEach((cta) => {

        const ctaKey =
          `Emotion-CTA::${emotion}::${cta}`;

        relationshipMap[ctaKey] =
          (relationshipMap[ctaKey] || 0) + 1;

        reinforcedStructures[emotion].ctas[
          cta
        ] =
          (reinforcedStructures[emotion].ctas[
            cta
          ] || 0) + 1;

        reinforcedStructures[
          emotion
        ].totalStrength += 1;
      });

      niches.forEach((niche) => {

        reinforcedStructures[
          emotion
        ].niches[niche] =
          (reinforcedStructures[
            emotion
          ].niches[niche] || 0) + 1;

        reinforcedStructures[
          emotion
        ].totalStrength += 1;
      });
    });
  });

  const relationships: RelationshipRecord[] =
    Object.entries(relationshipMap)
      .filter(([, count]) => count >= 2)
      .map(([key, count]) => {

        const [type, left, right] =
          key.split("::");

        return {
          type,
          left,
          right,
          count,
        };
      });

  const groupedRelationships: Record<
    string,
    RelationshipRecord[]
  > = {};

  relationships.forEach((relationship) => {

    if (
      !groupedRelationships[
        relationship.type
      ]
    ) {
      groupedRelationships[
        relationship.type
      ] = [];
    }

    groupedRelationships[
      relationship.type
    ].push(relationship);
  });

  return {
    relationships,
    groupedRelationships,
    reinforcedStructures,
  };
};
