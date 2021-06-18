
module.exports = [require('./form'),
    require('./personnel'),
    require('./avancements'),

    (req, res, next) => {
        res.render("admin/personnel")
    }
]