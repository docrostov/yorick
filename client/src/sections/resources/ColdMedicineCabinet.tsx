import Line from "../../components/Line";
import Tile from "../../components/Tile";
import { useGetWorkshed, useTotalTurnsPlayed } from "../../hooks/useCall";
import useGet from "../../hooks/useGet";

const ColdMedicineCabinet = () => {
  const workshed: { name?: string } = useGetWorkshed() ?? {};
  const totalTurnsPlayed = useTotalTurnsPlayed() ?? 0;
  const _coldMedicineConsults = useGet("_coldMedicineConsults");
  const _nextColdMedicineConsult = useGet("_nextColdMedicineConsult");

  const turnsToConsult = _nextColdMedicineConsult - totalTurnsPlayed;

  return (
    <Tile
      header="Cold Medicine Cabinet"
      imageUrl="/images/itemimages/cmcabinet.gif"
      href="/campground.php?action=workshed"
      hide={workshed?.name !== "cold medicine cabinet"}
    >
      <Line>{5 - _coldMedicineConsults} consults available.</Line>
      {_coldMedicineConsults < 5 && (
        <Line>
          Next consult{" "}
          {turnsToConsult <= 0 ? "available now" : `in ${turnsToConsult} turns`}
          .
        </Line>
      )}
    </Tile>
  );
};

export default ColdMedicineCabinet;
