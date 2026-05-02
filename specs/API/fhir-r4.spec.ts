import { test } from "@playwright/test";
import { PatientBuilder } from "../../builders/patient.builder";
import { getWithRetry, createApiClient } from "../../utils/api-utils";
import {
  updatedPatientData,
  invalidPatientId,
  malformedPatientData,
} from "../../data/patient";
import * as assertions from "../helpers";
import { createPatient } from "../helpers/create-patient";

const apiBase = process.env.API_BASE_URL;
if (!apiBase) throw new Error("API_BASE_URL is missing");

test.describe("FHIR R4 API Tests", () => {
  test("should create a new patient resource", async ({ request }) => {
    const api = await createApiClient(request);
    const newPatient = await createPatient(api);

    assertions.expectPatientsCreated(newPatient.response, newPatient.body);
  });

  test("should retrieve the created patient resource by ID and verify the key fields", async ({
    request,
  }) => {
    const api = await createApiClient(request);
    const newPatient = await createPatient(api);
    const response = await api.get(`${apiBase}/Patient/${newPatient.body.id}`);
    const body = await response.json();

    assertions.expectPatientsRetrieved(response, body, newPatient.body);
  });

  test("should update the patient resource and verify the update", async ({
    request,
  }) => {
    const api = await createApiClient(request);
    const newPatient = await createPatient(api);
    const existingPatient = await getWithRetry(
      api,
      `${apiBase}/Patient/${newPatient.body.id}`,
    );
    // const existingPatientData = await existingPatient.json();

    const updatedPatient = PatientBuilder.fromExisting(existingPatient)
      .withName(updatedPatientData.familyName, updatedPatientData.givenName)
      .build();

    const response = await api.put(`${apiBase}/Patient/${newPatient.body.id}`, {
      data: updatedPatient,
    });
    const body = await response.json();

    assertions.expectPatientsUpdated(response, body, newPatient.body.id);
  });

  test("should search the patient resource by name and verify the response structure", async ({
    request,
  }) => {
    const api = await createApiClient(request);
    const response = await api.get(
      `${apiBase}/Patient?name=${updatedPatientData.familyName}`,
    );
    const body = await response.json();

    assertions.expectPatientsSearched(response, body);
  });

  test("should return an error when searching for a nonexistent ID", async ({
    request,
  }) => {
    const api = await createApiClient(request);
    const response = await api.get(`${apiBase}/Patient/${invalidPatientId}`);
    const body = await response.json();

    assertions.expectPatientNotFound(response, body);
  });

  test("should return an error when creating a patient with malformed data", async ({
    request,
  }) => {
    const api = await createApiClient(request);

    const malformedPatient = new PatientBuilder()
      .withName(malformedPatientData.givenName, malformedPatientData.familyName) // Invalid name format
      .withBirthDate(malformedPatientData.birthDate) // Invalid date format
      .build();

    const response = await api.post(`${apiBase}/Patient`, {
      data: malformedPatient,
    });
    const body = await response.json();

    assertions.expectMalformedPatient(response, body);
  });
});
