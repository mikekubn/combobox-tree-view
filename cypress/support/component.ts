import { mount } from "cypress/react18";

//Ensure global styles are loaded
import "../../styles/globals.css";

import "./commands";

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("mount", mount);

// Example use:
// cy.cy.mount(<MyComponent />)
