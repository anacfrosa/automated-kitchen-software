/**
 *  Generate a uuid
 */
export const { v4: uuidv4 } = require("uuid");

/**
 *  Measure Unit Options
 */
export const measureUnitOptions = [
  {
    value: "kg",
    label: "kg",
  },
  {
    value: "g",
    label: "g",
  },
  // {
  //   value: "l",
  //   label: "l",
  // },
  // {
  //   value: "ml",
  //   label: "ml",
  // },
];

export const purchaseStatusOptions = [
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "cancel",
    label: "Cancel",
  },
];