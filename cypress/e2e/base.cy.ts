describe("Is live", () => {
  it("return status 200", () => {
    cy.request({
      url: "/",
    }).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });
});

export {};
