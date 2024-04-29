it('Muestra alertas al intentar enviar formulario con datos faltantes', () => {
  cy.visit('https://app.uniandes-sports.com/registro');

  // Intenta enviar el formulario sin llenar datos
  cy.get('form').submit();

  // Verifica que las alertas se muestren correctamente
  cy.on('window:alert', (str) => {
    expect(str).to.equal('Por favor ingresa tu nombre.');
  });
});
