describe('SMK Util Tests', () => {
    it('Has a non-empty SMK.UTIL object', () => {
        cy.window().its('SMK.UTIL').should('not.be.null');
    })

    it('Should get meters per millimeter', () => {
        let util;
        cy.window()
            .then((win) => {
                util = win.SMK.UTIL;
            })
            .then(() => {
                var mPerMM = util.getMetersPerUnit('Millimeter');
                expect(mPerMM).to.equal(0.001);
            })
    })

    it('Should give error with invalid value for getMetersPerUnit', () => {
        cy.on('fail', (e, test) => {
            if (test.title.startsWith('Should give error with invalid value for getMetersPerUnit') &&
                e.message === "invalid value is an unknown unit") {
                console.log('test "%s" is expected to fail with error "%s"', test.title, e.message);
            } else {
                throw e;
            }
        })
          
        let util;
        cy.window()
            .then((win) => {
                util = win.SMK.UTIL;
            })
            .then(() => {
                var mPerMM = util.getMetersPerUnit('invalid value');
                expect(mPerMM).to.equal(0.001);
            })
    })
})
