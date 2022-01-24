import Line from "../../components/Line";
import Tile from "../../components/Tile";
import useGet from "../../hooks/useGet";
import useHave from "../../hooks/useHave";
import { $item } from "../../util/makeValue";
import { plural } from "../../util/text";

const CursedMagnifyingGlass = () => {
  const _voidFreeFights = useGet("_voidFreeFights");
  const cursedMagnifyingGlassCount = useGet("cursedMagnifyingGlassCount");

  const turnsToVoid = 13 - cursedMagnifyingGlassCount;

  return (
    <Tile
      header="Cursed Magnifying Glass"
      imageUrl="/images/itemimages/cursedmag.gif"
      hide={!useHave($item`cursed magnifying glass`) || _voidFreeFights >= 5}
      linkedContent={$item`cursed magnifying glass`}
    >
      <Line>
        {plural(5 - _voidFreeFights, "free void monster")} remaining today.
      </Line>
      <Line>
        Void monster fight{" "}
        {turnsToVoid === 0
          ? "available now"
          : `in ${plural(turnsToVoid, "turn")}`}
        .
      </Line>
    </Tile>
  );
};

export default CursedMagnifyingGlass;
