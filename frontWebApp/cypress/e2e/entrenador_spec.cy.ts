describe('Prueba la página de sesión con entrenador', () => {
  it('Visita la página de sesión con entrenador y muestra el contenido', () => {
    cy.visit('https://app.uniandes-sports.com');
    cy.get('app-auth-button').should('be.visible').click();
    cy.origin('https://dev-s8qwnnguwcupqg2o.us.auth0.com', () => {
      cy.get('input[name="username"]').type('abc@hotmail.com');
      cy.get('input[name="password"]').type('Asdf1234*');
      cy.get('button[type="submit"]').click();

    });

    cy.wait(5000)
    cy.visit('https://app.uniandes-sports.com/servicios/entrenador')
    cy.contains('Programar Sesión con Entrenador')
    cy.contains('Proveedor:')
    cy.get('#proveedor').select('AlejoFit', {force: true});
    cy.get('#proveedor').contains('AlejoFit')
    cy.get('#proveedor').select('BeatrizFit', {force: true});
    cy.get('#proveedor').contains('BeatrizFit')
    cy.get('#proveedor').select('JuanFit', {force: true});
    cy.get('#proveedor').contains('JuanFit')
    cy.contains('Tipo de entrenamiento:')
    cy.get('#entrenamiento').select('Personalizado', {force: true});
    cy.get('#entrenamiento').contains('Personalizado')
    cy.get('#entrenamiento').select('Grupal', {force: true});
    cy.get('#entrenamiento').contains('Grupal')
    cy.get('#entrenamiento').select('Específico (Indique en los comentarios)', {force: true});
    cy.get('#entrenamiento').contains('Específico (Indique en los comentarios)')
    cy.contains('Fecha de la sesión')
    cy.get('#fechaSesion').type('2024-04-15')
    cy.contains('Hora de la sesión')
    cy.get('#horaSesion').type('08:30')
    cy.contains('Comentarios adicionales:')
    cy.get('#comentarios').type('Ninguno')
    cy.contains('Solicitar sesión con entrenador')
    cy.get('button').contains('Solicitar sesión con entrenador').click()
  })
})
