describe('Iniciar sesión y crear una cita de mototaller', () => {
    it('Inicia sesión correctamente y crea una cita de mototaller', () => {
      cy.visit('https://app.uniandes-sports.com');
    cy.get('app-auth-button').should('be.visible').click();
    cy.origin('https://dev-s8qwnnguwcupqg2o.us.auth0.com', () => {
        cy.get('input[name="username"]').type('d.figueroaauni@gmail.com');
      cy.get('input[name="password"]').type('135.Simetrik24@');
      cy.get('button[type="submit"]').click();

    });
    cy.get('.name').should('contain', 'Alejandro Figueroa');
    cy.visit('https://app.uniandes-sports.com/servicios/mototaller');
    cy.get('input[name="fecha"]').type('2024-05-01')
    cy.get('input[name="hora"]').type('09:00')
    cy.get('textarea[name="comentarios"]').type('Descripción del problema a ser atendido.')
    cy.get('button[type="submit"]').click();
    cy.get('.alert-success').should('be.visible');
  });
});
