import { faker } from "@faker-js/faker";

export class PatientBuilder {
  private patient: any;

  static fromExisting(existingPatient: any) {
    const clone = JSON.parse(JSON.stringify(existingPatient));
    return new PatientBuilder(clone);
  }

  constructor(existingPatient?: any) {
    this.patient = existingPatient
      ? JSON.parse(JSON.stringify(existingPatient))
      : {
          resourceType: "Patient",
          active: true,
          name: [
            {
              family: faker.person.lastName(),
              given: [faker.person.firstName()],
            },
          ],
          gender: "unknown",
          birthDate: faker.date
            .birthdate({ min: 0, max: 80, mode: "age" })
            .toISOString()
            .split("T")[0],
          identifier: [
            {
              system: "http://example.org/mrn",
              value: faker.string.uuid(),
            },
          ],
        };
  }

  withName(family: string, given: string) {
    this.patient.name = [{ family, given: [given] }];
    return this;
  }

  withGender(gender: "male" | "female" | "other" | "unknown") {
    this.patient.gender = gender;
    return this;
  }

  withBirthDate(date: string) {
    this.patient.birthDate = date;
    return this;
  }

  build() {
    return this.patient;
  }
}
