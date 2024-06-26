describe('Prueba la página de servicio de alimentación', () => {
  it('Visita la página de servicios de alimentación y muestra el contenido', () => {
    cy.visit('https://app.uniandes-sports.com');
    cy.get('app-auth-button').should('be.visible').click();
    cy.origin('https://dev-s8qwnnguwcupqg2o.us.auth0.com', () => {
      cy.get('input[name="username"]').type('abc@hotmail.com');
      cy.get('input[name="password"]').type('Asdf1234*');
      cy.get('button[type="submit"]').click();

    });

    cy.wait(5000)
    cy.visit('https://app.uniandes-sports.com/servicios/alimentacion')
    cy.contains('Servicio de Alimentación')
    cy.contains('Proveedor:')
    cy.get('#proveedor').select('Cocina Fit', {force: true});
    cy.get('#proveedor').contains('Cocina Fit')
    cy.get('#proveedor').select('Mundo Fitness', {force: true});
    cy.get('#proveedor').contains('Mundo Fitness')
    cy.get('#proveedor').select('Comer sin pecar', {force: true});
    cy.get('#proveedor').contains('Comer sin pecar')
    cy.contains('Propósito:')
    cy.get('#proposito').select('Complemento plan nutricional', {force: true});
    cy.get('#proposito').contains('Complemento plan nutricional')
    cy.get('#proposito').select('Recuperación muscular', {force: true});
    cy.get('#proposito').contains('Recuperación muscular')
    cy.contains('Tipo de alimentación deportiva:')
    cy.get('#alimentacion').select('Proteínas', {force: true})
    cy.get('#alimentacion').contains('Proteínas')
    cy.get('#alimentacion').select('Carbohidratos', {force: true})
    cy.get('#alimentacion').contains('Carbohidratos')
    cy.get('#alimentacion').select('Grasas saludables', {force: true})
    cy.get('#alimentacion').contains('Grasas saludables')
    cy.get('#alimentacion').select('Suplementos', {force: true})
    cy.get('#alimentacion').contains('Suplementos')
    cy.get('#alimentacion').select('Dieta equilibrada', {force: true})
    cy.get('#alimentacion').contains('Dieta equilibrada')
    cy.contains('¿Cómo desea recibir el servicio de alimentación?:')
    cy.get('#recibir').select('Generación virtual', {force: true})
    cy.get('#recibir').contains('Generación virtual')
    cy.get('#recibir').select('Recibirlo a domicilio', {force: true})
    cy.get('#recibir').contains('Recibirlo a domicilio')
    cy.contains('Número de contacto')
    cy.get('#numeroContacto').type('321')
    cy.contains('Dirección de contacto')
    cy.get('#direccionActual').type('Calle 123')
    cy.contains('País donde se encuentra')
    cy.get('#paisActual').type('Colombia')
    cy.contains('Ciudad donde se encuentra')
    cy.get('#ciudadActual').type('Bogota')
    cy.contains('Solicitar servicio de alimentación')
    cy.get('button').contains('Solicitar servicio de alimentación').click()
  })
})
