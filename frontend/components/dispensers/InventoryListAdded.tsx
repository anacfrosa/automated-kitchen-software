import { FillDetails } from "@wac/types/dispenser";

export const InventoryListAdded = (list: FillDetails[]) => {
  return (
    <>
      {list.map((item: FillDetails, index: number) => (
        <li key={index}>
          {item.confirmQuantity} {item.confirmUnit} - Lot {item.lotNumber}
          <br />
        </li>
      ))}
    </>
  );
};
