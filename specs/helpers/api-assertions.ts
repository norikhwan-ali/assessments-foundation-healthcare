import { APIResponse, expect } from "@playwright/test";
import { updatedPatientData } from "../../data/patient";

export function expectPatientsCreated(response: APIResponse, body: any) {
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(201);
  expect(body).toHaveProperty("id");
}

export function expectPatientsRetrieved(
  response: APIResponse,
  body: any,
  newPatient: any,
) {
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  expect(body).toHaveProperty("id");
  expect(body.id).toBe(newPatient.id);
  expect(body.name[0].family).toBe(newPatient.name[0].family);
  expect(body.name[0].given[0]).toBe(newPatient.name[0].given[0]);
  expect(body.birthDate).toBe(newPatient.birthDate);
}

export function expectPatientsUpdated(
  response: APIResponse,
  body: any,
  patientId: string,
) {
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  expect(body).toHaveProperty("id");
  expect(body.id).toBe(patientId);
  expect(body.name[0].family).toBe(updatedPatientData.familyName);
  expect(body.name[0].given[0]).toBe(updatedPatientData.givenName);
}

export function expectPatientsSearched(response: APIResponse, body: any) {
  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);
  expect(body.resourceType).toBe("Bundle");
  expect(body.type).toBe("searchset");
  expect(Array.isArray(body.entry)).toBeTruthy();
  expect(body.entry.length).toBeGreaterThan(0);
}

export function expectPatientNotFound(response: APIResponse, body: any) {
  expect(response.ok()).toBeFalsy();
  expect(response.status()).toBe(404);
  expect(body.resourceType).toBe("OperationOutcome");
  expect(Array.isArray(body.issue)).toBeTruthy();
  const issue = body.issue[0];
  expect(issue).toBeDefined();
  expect(issue.severity).toBeDefined();
  expect(issue.code).toBeDefined();
  expect(issue.severity).toBe("error");
  expect(issue.code).toBe("processing");
}

export function expectMalformedPatient(response: APIResponse, body: any) {
  expect(response.ok()).toBeFalsy();
  expect(response.status()).toBe(400);
  expect(body.resourceType).toBe("OperationOutcome");
  expect(Array.isArray(body.issue)).toBeTruthy();
  const issue = body.issue[0];
  expect(issue.severity).toBe("error");
  expect(issue.code).toBe("processing");
  expect(issue.diagnostics).toContain("Invalid");
  expect(issue.diagnostics).toContain("not-a-date");
}
