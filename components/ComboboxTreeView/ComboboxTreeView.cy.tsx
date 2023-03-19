import { useState } from "react";

import DropdownSearchInput, { IData, options } from ".";

describe("DropdownSearchInput tests", () => {
  it("Search input icon should be able to delete search value", () => {
    cy.mount(<TestCmpDropdown value={[]} options={options(10)} />);
    cy.dataCy("input-id-test").click();
    cy.dataCy("dropdown-search-input").type("Test");
    cy.dataCy("dropdown-search-input").should("have.value", "Test");
    cy.dataCy("dropdown-search-x-mark-icon").click();
    cy.dataCy("dropdown-search-input").should("have.value", "");
  });

  it("Search input icon should change with entered search value", () => {
    cy.mount(<TestCmpDropdown value={[]} options={options(10)} />);
    cy.dataCy("input-id-test").click();
    cy.dataCy("dropdown-search-magnifying-glass-icon").should("be.visible");
    cy.dataCy("dropdown-search-input").type("Test");
    cy.dataCy("dropdown-search-x-mark-icon").should("be.visible");
  });

  it("Search input in default state includes values", () => {
    cy.mount(
      <TestCmpDropdown
        value={[{ name: "name 1", id: "id 1", children: [] }]}
        options={options(10)}
      />
    );

    cy.dataCy("button-list").should("be.visible");
    cy.dataCy("button-list").children().should("have.length", 1);
    cy.dataCy("button-list").first().should("not.be.empty");
    cy.dataCy("button-list").first().click();
    cy.dataCy("button-list").should("have.length", 0);
  });

  it("Search input contains values from list", () => {
    cy.mount(<TestCmpDropdown value={[]} options={options(10)} />);

    cy.dataCy("input-id-test").click();
    cy.dataCy("dropdown-search-input").type("1");
    cy.dataCy("list-option").first().click();
    cy.dataCy("button-list").children().should("have.length", 1);
    cy.dataCy("dropdown-search-input").clear();
    cy.dataCy("dropdown-search-input").type("name");
    cy.dataCy("list-option").last().click();
    cy.dataCy("button-list").children().should("have.length", 2);
  });
});

const TestCmpDropdown = ({
  value,
  options,
}: {
  value: IData[];
  options?: IData[];
}): React.ReactElement => {
  const [item, setItems] = useState(value);

  return (
    <div className="relative w-1/2 mx-auto">
      <DropdownSearchInput
        id="id-test"
        value={item}
        onChange={setItems}
        search={true}
        options={options}
      />
    </div>
  );
};
