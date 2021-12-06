describe('SMK Basic Tests', () => {
    it('Has a non-empty SMK object', () => {
        cy.window().its('SMK').should('not.be.null');
    })

    it('Has a non-empty SMK.MAP object', () => {
        cy.window().its('SMK.MAP').should('not.be.null');
    })

    it('Has the expected Map name', () => {
        cy.window().its('SMK.MAP.1.name').should('eq', 'SMK Default Map');
    })

    it('Has a Location tool with the expected ID', () => {
        cy.window().its('SMK.MAP.1.$tool.LocationTool.rootId').should('eq', 'LocationTool');
    })
})