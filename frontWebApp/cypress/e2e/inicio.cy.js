describe('Prueba de la página de inicio', () => {
  it('Verifica la presencia de elementos y contenido en la página', () => {
    cy.visit('https://app.uniandes-sports.com/')

    // Verifica la presencia del contenedor de la página
    cy.get('.page').should('exist')

    // Verifica que el mensaje de bienvenida esté presente y sea correcto
    cy.get('.login-register h3').should('contain', '¡¡Bienvenido a nuestro sitio Web de Deportes!!')

    // Verifica que el mensaje de instrucciones esté presente y sea correcto
    cy.get('.login-register p').should('contain', 'Porfavor inicia sesión o registrate para continuar')
  })
})
