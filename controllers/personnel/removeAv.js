const Avancement = require("../../models/avancement")

module.exports = [
    (req, res, next) => {
        Avancement.deleteOne({
            _id: req.params.avancement
        }).then((response) => {
            if (response.deletedCount == 1) {
                console.log("avancement deleted !", response)
                return res.status(200).send()
            } else
                throw new Error("Aucun avancement supprimé !")

        }).catch(err => {
            res.status(400).send(" Une erreur s'est produite! ", err)
        })

    }
]