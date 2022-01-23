import { ListItem } from "@chakra-ui/react";
import BulletedList from "../../components/BulletedList";
import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { useMyLevel } from "../../hooks/useCall";
import useGet from "../../hooks/useGet";
import useHave from "../../hooks/useHave";
import { $skill, $item } from "../../util/makeValue";
import { plural } from "../../util/text";

// ==== TILE TO-DO LIST ==================
//   - Want to figure out a good way to make the bullets into links to the respective zones or containers.
//   - Add more map targets with more conditions on them. (If you have a spit up, you probably want to map a good spit dude, for instance.)
//   - Better ways to re-order & re-prioritize the map targets.

/**
 * Class used to store map targets. Unless otherwise specified, all params are strings.
 * @param monster The monster in question
 * @param zone The zone you'll find the monster in
 * @param level The level this map target is feasible (number)
 * @param access A way to pass in a custom condition for accessibility (boolean)
 */

class MapTarget {
  monster: string;
  zone: string;
  level: number;
  access: boolean;
  turnsTilGROPs: number;

  constructor(
    monster: string,
    zone: string,
    level: number,
    access?: boolean,
    turnsTilGROPs?: number
  ) {
    this.monster = monster;
    this.zone = zone;
    this.level = level;
    this.access = access ?? true;
    this.turnsTilGROPs = turnsTilGROPs ?? 0;
  }

  /**
   * Returns true/false depending on if you are at a level high enough to access this monster.
   * @param monster The monster in question
   */
  accessible(userLevel: number): boolean {
    return this.access && userLevel > this.level;
  }
}

interface MapTargetProps {
  userLevel: number;
  target: MapTarget;
}

/**
 * Returns a <ListItem> enumerating a MapTarget. Includes GROP handling.
 * @param userLevel User's current level (as number)
 * @param target A "MapTarget" entry.
 * @returns <ListItem> covering monster, zone, & accessibility.
 */
const MapTargetItem: React.FC<MapTargetProps> = ({ userLevel, target }) => {
  if (!target.accessible(userLevel)) return <></>;
  if (target.monster === "Green Ops Soldier") {
    // We want to output special text for GROP availability. There are two possible states:

    //   - Grops are available, in which case it just does exactly what the bullets normally do.
    //   - Grops are available in X turns, in which case it just lets you know they'll be ready in X turns.

    return (
      <ListItem key={target.monster}>
        {`Green Ops Soldier ${
          target.turnsTilGROPs > 0
            ? `(possible in ${plural(target.turnsTilGROPs, "war turn")})`
            : `@ ${target.zone}`
        }`}
      </ListItem>
    );
  } else {
    return (
      <ListItem
        key={target.monster}
      >{`${target.monster} @ ${target.zone}`}</ListItem>
    );
  }
};

/**
 * Summarizes # of maps remaining & recommends usage ideas
 * @returns A tile describing Cartography Compendium usage recommendations
 */
const Cartography = () => {
  const _mapUses = 3 - useGet("_monstersMapped", 0);
  const userLevel = useMyLevel() ?? 0;

  // This next portion tabulates the number of turns until GROPs are unlocked. You need these quest prefs to know how many hippies a single war turn advances the war.
  const lighthouseQuest = +(
    useGet("sidequestLighthouseCompleted") === "fratboy"
  );
  const arenaQuest = +(useGet("sidequestArenaCompleted") === "fratboy");
  const junkyardQuest = +(useGet("sidequestJunkyardCompleted") === "fratboy");
  const orchardQuest = +(useGet("sidequestOrchardCompleted") === "fratboy");
  const nunsQuest = +(useGet("sidequestNunsCompleted") === "fratboy");
  const hippiesPerFight = Math.pow(
    2,
    nunsQuest + orchardQuest + junkyardQuest + arenaQuest + lighthouseQuest
  );

  // Battlefield spading from Aen shows that GROPs appear @ 400 hippy kills, but not before.
  const hippiesKilled = useGet("hippiesDefeated");
  const turnsToGROPs = Math.ceil(
    Math.max(401 - hippiesKilled, 0) / hippiesPerFight
  );

  // General access booleans to pass into my Map Target list
  const gropReqs = !(useGet("warProgress") === "finished");
  const healerReqs = !useHave($item`amulet of extreme plot significance`);
  const hitsReq = !(useGet("questL10Garbage") in ["step10", "finished"]);

  // Properties referenced by multiple mapTargets
  const zeppProgress = useGet("questL11Ron");

  // This lists out possible map target recommendations, via MapTarget entries.
  const allMapTargets = [
    new MapTarget(
      "Green Ops Soldier",
      "The Battlefield",
      12,
      gropReqs,
      turnsToGROPs
    ),
    new MapTarget("Quiet Healer", "Penultimate Airship", 10, healerReqs),
    new MapTarget("Lobsterfrogman", "Sonofa Beach", 12, !junkyardQuest),
    new MapTarget("Astronomer", "The Hole in the Sky", 10, hitsReq),
    new MapTarget(
      "Red Butler",
      "The Red Zeppelin",
      11,
      zeppProgress in ["step2", "step3"]
    ),
    new MapTarget(
      "Lynyrd Skinner",
      "Mob of Zeppelin Protestors",
      11,
      zeppProgress in ["started", "step1"]
    ),
    new MapTarget("Forest Spirit", "Outskirts of Camp Logging Camp", 4),
  ];

  // We will only display the top 3 recommendations; iterate through the list and stop when recs are full
  const recommendations: MapTarget[] = allMapTargets
    .filter((target) => target.accessible(userLevel))
    .slice(0, 3);

  return (
    <Tile
      header="Cartography Compendium"
      imageUrl="/images/itemimages/Cccbook.gif"
      hide={!useHave($skill`Comprehensive Cartography`)} //|| _mapUses === 0}
    >
      <Line>{_mapUses} maps remaining. Some map suggestions:</Line>
      <BulletedList>
        {recommendations.slice(0, 3).map((recc) => (
          <MapTargetItem
            key={recc.monster}
            userLevel={userLevel}
            target={recc}
          />
        ))}
      </BulletedList>
    </Tile>
  );
};

export default Cartography;
