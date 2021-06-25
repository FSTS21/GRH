const config = require("./config_2")
module.exports = [require("../includes/loadEchelons"),
    (req, res, next) => {
        res.locals.personnel = new require('../../models/personnel')()
        next()
    },
    require("./findPersonne"),
    function (req, res, next) {
        res.render(config.page, {
            ...config.initPage,
            page_title: "Recrutement d'un personnel : "+res.locals.personnel.personne.nom+" "+res.locals.personnel.personne.prenom,
            personnel: {
                // dateRecrutement: null,
                dateIntegrationFST: null,
                debutFonction: null,
            },
            avancement: {
                dateEffet: null
            }
        })
    }
]