describe('SMK Basic Tests', () => {
    it('Has a non-empty SMK object', () => {
        cy.window().its('SMK').should('not.be.null');
    })

    it('Has a non-empty SMK.MAP object', () => {
        cy.window().its('SMK.MAP').should('not.be.null');
    })

    it('Has the expected Map name', () => {
        cy.window().its('SMK.MAP.1.name').should('eq', 'smk-cypress');
    })

    it('Has a Location tool with the expected ID', () => {
        cy.window().its('SMK.MAP.1.$tool.LocationTool.rootId').should('eq', 'LocationTool');
    })

    it('Finds and zooms to location 976 Meares Street', () => {
        cy.get('input').type('976 Meares');
        cy.get(':nth-child(1) > .smk-address > .smk-precision-civic_number > .smk-street > .smk-street-name').click();
        cy.get('[title="976 Meares St, Victoria, BC"]').should('be.visible');
    })
})