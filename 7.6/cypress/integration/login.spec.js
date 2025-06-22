
it("Should successfully login", () => {
  cy.login()
  cy.contains("Добро пожаловать test@test.com").should("be.visible")
})

it("Should not login with empty login", () => {
  cy.openLoginForm()
  cy.get("#mail").type(" ")
  cy.get("#pass").type("test")
  cy.contains("Submit").click()
  cy.get("#mail").should(el => expect(el[0].checkValidity()).to.be.false)
  cy.get("#mail").should(el => expect(el[0].validationMessage).to.contain("Заполните это поле."))
})

it("Should not login with empty password", () => {
  cy.openLoginForm()
  cy.get("#mail").type("test@test.com")
  cy.contains("Submit").click()
  cy.get("#pass").should(el => expect(el[0].checkValidity()).to.be.false)
})

describe('Авторизация и управление избранным', () => {
  const bookTitle = 'Преступление и наказание'

  it('Добавляет книгу в избранное', () => {
    cy.login()
    cy.openHome()
    cy.contains('.card-title', bookTitle)
      .closest('.card')
      .within(() => cy.contains('Add to favorite').click())
    cy.openFavorites()
    cy.contains('.card-title', bookTitle).should('exist')
  })

  it('Удаляет книгу из избранного', () => {
    cy.login()
    cy.openFavorites()
    cy.contains('.card-title', bookTitle)
      .closest('.card')
      .within(() => cy.contains('Delete from favorite').click())
    cy.contains('.card-title', bookTitle).should('not.exist')
  })
})

describe('Проверка открытия окна скачивания', () => {
  beforeEach(() => {
    cy.login()
    cy.openFavorites()
    cy.contains('.card-title', 'Идиот').click()
    cy.get('h2').should('contain', 'Идиот')
  })

  it('Открывает window.open с правильным URL', () => {
    cy.window().then(win => cy.stub(win, 'open').as('openWindow'))

    cy.contains('button', 'Dowload book').click()

    cy.get('@openWindow')
      .should('have.been.calledOnce')
      .and('have.been.calledWith', 'http://localhost:7071/api/books/7f076678-95ff-4c88-a04b-af66028c3bf4/download')
  })
})
