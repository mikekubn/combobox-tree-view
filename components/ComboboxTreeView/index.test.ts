import { expect } from "@jest/globals";

import { hasMatch, normalize } from ".";

describe("Dropdown search input", () => {
  it("normalize function for matching strings", () => {
    [
      {
        string: "PRZETWÓRSTWO PRZEMYSŁOWE",
        result: ["przetworstwo", "przemysłowe"],
      },
      {
        string: "Produkcja artykułów spożywczych",
        result: ["produkcja", "artykułow", "spozywczych"],
      },
      {
        string: "Edukacja",
        result: ["edukacja"],
      },
    ].forEach((item) => {
      const string = normalize(item.string);

      expect(string).toEqual(item.result);
    });
  });

  it("hasMatch function for searching", () => {
    [
      {
        query: "prze",
        string: "PRZETWÓRSTWO PRZEMYSŁOWE",
        match: true,
      },
      {
        query: "arty",
        string: "Produkcja artykułów spożywczych",
        match: true,
      },
      {
        query: "edu",
        string: "Edukacja",
        match: true,
      },
      {
        query: "11.01",
        string: "11.01 Edukacja",
        match: true,
      },
      {
        query: "11.01",
        string: "Edukacja",
        match: false,
      },
      {
        query: "Test",
        string: "Edukacja",
        match: false,
      },
    ].forEach((item) => {
      const match = hasMatch(item.query, item.string);

      expect(match).toEqual(item.match);
    });
  });
});
