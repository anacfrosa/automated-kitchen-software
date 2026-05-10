import * as yup from "yup";

export interface FormPropsType {
  name: string;
  phone: number;
  email: string;
  country: string;
  city: string;
  address: string;
  zipcode: string;
  website?: string;
}

export const defaultFormValues: FormPropsType = {
  name: "",
  phone: 0,
  email: "",
  country: "",
  city: "",
  address: "",
  zipcode: "",
  website: "",
};

export const FormSchema = yup.object({
  name: yup.string().required("Required"),
  phone: yup
    .number()
    .typeError("Must be a valid number")
    .positive("Positive")
    .integer()
    .required("Required")
    .test(
      "len",
      "Must be exactly 9 digits",
      (val) => val.toString().length === 9
    ),
  email: yup.string().email().required("Required"),
  country: yup.string().required("Required"),
  city: yup.string().required("Required"),
  address: yup.string().required("Required"),
  zipcode: yup.string().required("Required"),
  website: yup.string(),
});
