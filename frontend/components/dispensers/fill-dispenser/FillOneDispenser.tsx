// import * as React from "react";
// import { useTranslation } from "@wac/app/i18n/client";
// import { FillDetails, FillStatus, ReadDispenser } from "@wac/types/dispenser";
// import { useState } from "react";
// import StandardDialog from "@wac/components/dialog/StandardDialog";
// import { fillOneDispenser, ValidFields } from "./utils";
// import ConfirmDialog from "@wac/components/dialog/ConfirmDialog";
// import { InventoryListAdded } from "../InventoryListAdded";
// import SelectInventory from "./SelectInventory";
// import AlertDialog from "@wac/components/dialog/AlertDialog";
// import { convertToGrams, getDispenserMaxCapacity } from "@wac/lib/common";

// interface PropsType {
//   lng: string;
//   dispenser: ReadDispenser;
//   openDialog: boolean;
//   onHandleDialog: any;
//   onSucessAlert: (event: boolean, alertText: string) => void;
// }

// export default function FillOneDispenser(props: PropsType) {
//   const { t } = useTranslation(props.lng, "inventory");

//   const dispVolume = props.dispenser ? props.dispenser.volume : 0;

//   const alertCancelDialog = {
//     title: `Cancel Fill Dispenser ${props.dispenser.number?.toString()}?`,
//     content: `This will cancel adding ingredient to dispenser ${props.dispenser.number?.toString()}.`,
//   };

//   // When true, we receive the fill dispenser information from 'FillDispenser'
//   const [sendFillDetails, setSendFillDetails] = useState(false);
//   const [fillDetails, setFillDetails] = useState<FillDetails[]>([]);
//   // Handle submit alert to confirm the addition of ingredient in dispenser
//   const [confirmFilling, setConfirmFilling] = useState(false);
//   // Check if edit fields action is still active before confirming the fill
//   const [editAlert, setEditAlert] = useState(false);
//   const [allValid, setAllValid] = useState({
//     status: true,
//     error: "",
//   });

//   // Callback function to receive the updated list of ingredients received
//   const handleFillInfoChange = (list: FillDetails[], editStatus: boolean) => {
//     if (!editStatus) {
//       setFillDetails(list);
//       setSendFillDetails(false);
//       handleFieldsValidation(list);
//       //setConfirmFilling(true);
//     } else {
//       setEditAlert(true);
//       setSendFillDetails(false);
//     }
//   };

//   const handleFieldsValidation = (list: FillDetails[]) => {
//     let allValid = true;
//     let finalQuantityValid = true;
//     const updatedValidFields: FillStatus[] = [];
//     const errors: string[] = [];

//     if (list.length !== 0) {
//       const ingrDensity = list[0].ingredient.density;
//       let totalQuantity = 0;
//       for (const item of list) {
//         totalQuantity += Number(
//           convertToGrams(item.confirmQuantity, item.confirmUnit)
//         );
//         const { valid, error } = ValidFields(
//           getDispenserMaxCapacity(dispVolume, ingrDensity),
//           {
//             quantity: item.quantityAvailable.quantity,
//             measureUnit: item.quantityAvailable.unit,
//           },
//           {
//             quantity: item.confirmQuantity,
//             measureUnit: item.confirmUnit,
//           }
//         );

//         updatedValidFields.push({
//           lotNumber: item.lotNumber,
//           valid: valid,
//           error: error,
//         });

//         if (!valid) {
//           // Check individual errors
//           allValid = false;
//           errors.push(`Lot ${item.lotNumber}: ${error}`);
//         }
//       }
//       if (totalQuantity == 0) finalQuantityValid = false;
//       //console.log(totalQuantity);
//     }

//     //setValidFields(updatedValidFields);

//     if (!allValid) {
//       // Individual Errors
//       setAllValid({ status: false, error: errors.join(" ") });
//     } else if (!finalQuantityValid) {
//       setAllValid({ status: false, error: "Please, insert a valid quantity." });
//     } else {
//       setConfirmFilling(true);
//     }
//   };

//   const handleSubmitAction = async (event: boolean) => {
//     if (event && props.dispenser.id) {
//       await fillOneDispenser(props.dispenser.id, fillDetails);
//       props.onHandleDialog(false);
//       props.onSucessAlert(true, "Dispenser filled with success !");
//     }
//     setConfirmFilling(false);
//   };

//   // React.useEffect(() => {
//   //   console.log(fillDetails);
//   // }, [fillDetails]);

//   return (
//     <StandardDialog
//       open={props.openDialog}
//       title={`Fill Dispenser ${props.dispenser.number?.toString()}`}
//       containerWidth={"lg"}
//       closeDialog={() => props.onHandleDialog(false)}
//       alertCancelDialog={alertCancelDialog}
//       submitAction={() => setSendFillDetails(true)}
//     >
//       <SelectInventory
//         lng={props.lng}
//         //validFields={validFields}
//         //onResetFillStatus={resetFillStatus()}
//         dispenser={props.dispenser}
//         sendFillDetails={sendFillDetails}
//         onSend={handleFillInfoChange}
//       />

//       {/* Alert to confirm fill list  */}
//       <ConfirmDialog
//         alertTitle={`Confirm filling ${
//           fillDetails[0]?.ingredient.name
//         } to dispenser ${props.dispenser.number?.toString()}?`}
//         alertContent={InventoryListAdded(fillDetails)}
//         open={confirmFilling}
//         handleClose={() => setConfirmFilling(false)}
//         action1={"Yes"}
//         action2={"No"}
//         handleAction={handleSubmitAction}
//       />

//       {/* Alert that the edit fields are active  */}
//       <AlertDialog
//         alertTitle={"Edit Mode active"}
//         alertContent={"Please, confirm the edited values."}
//         open={editAlert}
//         handleClose={() => setEditAlert(false)}
//         handleAction={() => setEditAlert(false)}
//       />

//       {/* Alert for the confirm fields  */}
//       <AlertDialog
//         alertTitle={"Error in the confirmation fields."}
//         alertContent={allValid.error}
//         open={!allValid.status}
//         handleClose={() => setAllValid({ status: true, error: "" })}
//         handleAction={() => setAllValid({ status: true, error: "" })}
//       />
//     </StandardDialog>
//   );
// }
