describe('Iniciar sesión y acceder al panel', () => {
  it('Inicia sesión correctamente y verifica los datos en la barra superior', () => {
    cy.visit('https://app.uniandes-sports.com');
    cy.get('app-auth-button').should('be.visible').click();
    cy.origin('https://dev-s8qwnnguwcupqg2o.us.auth0.com', () => {
      cy.get('input[name="username"]').type('d.figueroaauni@gmail.com');
      cy.get('input[name="password"]').type('135.Simetrik24@');
      cy.get('button[type="submit"]').click();
    });
    cy.get('.name').should('contain', 'Alejandro Figueroa');
    cy.visit('https://app.uniandes-sports.com/dashboard');
    cy.wait(3000);
    cy.get('h3').should('contain', 'd.figueroaauni@gmail.com');
  });
});
