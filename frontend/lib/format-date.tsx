import dayjs, { Dayjs } from "dayjs";

//TODO: Using on Purchases
// Get the current date and time with locale PT
export function getCurrentDateTime() {
  // Get current date and time
  const currentDate = new Date();
  // Format the date and time according to Portuguese locale settings
  const portugalDate = currentDate.toLocaleString("pt-PT");
  return portugalDate;
}

//TODO: Using on Purchases
// Convert date (string) and time (string) to ISO standard
export function convertTofDateTimeISO({
  date,
  time,
}: {
  date: string;
  time: string;
}) {
  // Split date string and time string into parts
  const dateParts = date.split("/");
  const timeParts = time.split(":");

  // Create a new Date object with the specified date and time
  const dateTime = new Date(
    parseInt(dateParts[2]), // Year
    parseInt(dateParts[1]) - 1, // Month (months are zero-based in JavaScript)
    parseInt(dateParts[0]), // Day
    parseInt(timeParts[0]) + 1, // Hours
    parseInt(timeParts[1]), // Minutes
    parseInt(timeParts[2]) // Seconds
  );

  // Get the ISO string representation
  const isoString = dateTime.toISOString();

  return isoString;
}

//TODO: Using in purchase filters
// Convert date numbers to ISO8601 date type (YYYY-MM-DD)
export function fDateISO8601({
  day,
  month,
  year,
}: {
  day: number;
  month: number;
  year: number;
}) {
  // Create a new Date object
  const date = new Date(year, month, day);

  // Format the date as a string in ISO format without the time
  const isoDate = date.toISOString().split("T")[0];

  return isoDate;
}

// Converte ISO8601 date string to day-month-year format (DD-MM-YYYY)
// and return it with the time
export function fDateDDMMYYYYTime({ datetime }: { datetime: string }) {
  if (datetime !== undefined) {
    const [date, time] = datetime.split("T");

    // Split the input date into day, month, and year components
    const [year, month, day] = date.split("-");

    // Extract time components
    const [hours, minutes] = time.split(/:|\./);

    let formattedDateTime: string = "";
    if (Number(hours) !== 0 && Number(hours) !== 1) {
      // Construct the formatted date and time string
      formattedDateTime = `${day}-${month}-${year} | ${hours}:${minutes}`;
    } else {
      // Construct the formatted date string
      formattedDateTime = `${day}-${month}-${year}`;
    }

    return formattedDateTime;
  }

  return "";
}

export function convertDayjsToISOString(date: Dayjs, time: Dayjs | null) {
  let datetimeISOString: string = "";
  if (date != null) {
    const day = date.date(); // Get the day of the month (1-31)
    const month = date.month(); // Get the month (0-11)
    const year = date.year(); // Get the year

    let hours = 1; // set default 0 (because of the conversion to ISOString)
    let minutes = 0;

    console.log("time: ", time);

    if (time != null) {
      hours = time.hour() + 1; // Get the hours (0-23)
      minutes = time.minute(); // Get the minutes (0-59)
    }

    console.log("hours: ", hours);
    console.log("minutes: ", minutes);

    datetimeISOString = new Date(
      year,
      month,
      day,
      hours,
      minutes,
      0
    ).toISOString();
  }

  console.log(datetimeISOString);

  return datetimeISOString;
}

//! MAYBE REMOVE LATER
// Converte ISO8601 date string to day-month-year format (DD-MM-YYYY)
export function fDateDDMMYYYY({ date }: { date: string }) {
  // Split the input date into day, month, and year components
  const [year, month, day] = date.split("-");

  // Rearrange the components to form the desired format
  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

//! MAYBE REMOVE LATER
// Convert date in Dayjs and time (hours:minutes)
//  to ISO8601 datetime type (YYYY-MM-DDTHH:MM:SS.000Z)
export function fDateTimeISO8601({
  date,
  time,
}: {
  date: Dayjs;
  time: {
    hours: number;
    minutes: number;
  };
}) {
  // Extract year, month, and day from Dayjs object
  const year = date.year();
  const month = date.month(); // Note: Dayjs months are zero-based
  const day = date.date();

  // Extract hours and minutes from the time object
  const { hours, minutes } = time;

  // Create a new Date object
  const formattedDate = new Date(year, month, day, hours, minutes);

  return formattedDate.toISOString();
}
