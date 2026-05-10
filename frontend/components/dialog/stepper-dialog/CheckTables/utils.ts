export interface RadioValues {
  [taskId: number]: "conform" | "nonconform" | "cantobserve" | "";
}

export interface Row {
  id: number;
  task: string;
  conform: boolean;
  nonconform: boolean;
  cantobserve: boolean;
}

export interface CheckStatus {
  nextStep: boolean;
  valid: boolean;
}

function createData(
  id: number,
  task: string,
  conform: boolean,
  nonconform: boolean,
  cantobserve: boolean
): Row {
  return { id, task, conform, nonconform, cantobserve };
}

export { createData };
