const {
    default: avancement
} = require("../../models/avancement")
const config = require("./config_2")
module.exports = [require("../includes/loadEchelons"),
    function (req, res, next) {
        res.render(config.page, {
            ...config.initPage,
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