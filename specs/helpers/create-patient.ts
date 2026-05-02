import { APIRequestContext } from "@playwright/test";
import { PatientBuilder } from "../../builders/patient.builder";

const apiBase = process.env.API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is missing");

export async function createPatient(api: APIRequestContext) {
  const patient = new PatientBuilder().build();

  const response = await api.post(`${apiBase}/Patient`, { data: patient });
  const body = await response.json();
  return { response, body };
}
