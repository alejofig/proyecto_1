

describe('Registro de usuario', () => {
  it('Llena el formulario de registro y realiza el registro exitoso', () => {
    cy.visit('https://app.uniandes-sports.com/registro');

    cy.get('input[name="username"]').type('Alejandro');
    cy.get('input[name="lastname"]').type('Figueroa');
    cy.get('select[name="tipo_id"]').select('CÉDULA DE CIUDADANÍA');
    cy.get('input[name="identificacion"]').type('1234567890');
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // Genera una letra aleatoria en minúscula
    const email = `user${randomLetter}${Math.floor(Math.random() * 100000)}@example.com`;
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('135.SuperSecretPassword@');
    cy.get('input[name="edad"]').type('30');
    cy.get('select[name="genero"]').select('Masculino');
    cy.get('input[name="peso"]').type('70');
    cy.get('input[name="altura"]').type('175');
    cy.get('input[name="pais_nacimiento"]').type('País de Nacimiento');
    cy.get('input[name="ciudad_nacimiento"]').type('Ciudad de Nacimiento');
    cy.get('input[name="pais_residencia"]').type('País de Residencia');
    cy.get('input[name="ciudad_residencia"]').type('Ciudad de Residencia');
    cy.get('input[name="antiguedad_residencia"]').type('5');
    cy.get('select[name="deportes"]').select(['Natación', 'Running']);
    cy.get('input[value="PREMIUM"]').check();
    cy.get('form').submit();
    cy.get('.alert-success').should('be.visible');
  });
});
