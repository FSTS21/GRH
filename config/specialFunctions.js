const passwordValidator = require('password-validator');
const schemaPassword = new passwordValidator();
const helper = require("../config/registerHelper")

exports.checkPassword = (value, min, max) => {
    schemaPassword
        // .has().uppercase() // Must have uppercase letters
        // .has().lowercase() // Must have lowercase letters
        // .has().digits() // Must have digits
        .is().min(min || 4) // Minimum length 8
        .is().max(max || 30) // Maximum length 100
        .has().not().spaces() // Should not have spaces
        .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    const errors = schemaPassword.validate(value, {
        list: true
    })
    errors.forEach(err => {
        switch (err) {
            case "min":
                throw new Error(helper.translate("generals.errors.password.min|@|" + (min || 4)))
            case "max":
                throw new Error(helper.translate("generals.errors.password.max|@|" + (max || 30)))
            case "uppercase":
                throw new Error(helper.translate("generals.errors.password.uppercase"))
            case "lowercase":
                throw new Error(helper.translate("generals.errors.password.lowercase"))
            case "digits":
                throw new Error(helper.translate("generals.errors.password.digits"))
            case "spaces":
                throw new Error(helper.translate("generals.errors.password.spaces"))
            default:
                throw new Error(helper.translate("generals.errors.password.valid"))
        }
    })
    return true;
}

exports.checkSpecialChars = (field) => {
    // eslint-disable-next-line no-useless-escape
    if (/[\<\>\/\\\'\"]/.exec(field))
        throw new Error("Caractéres spéciaux non autorisés")

    return true
}

exports.checkSpecialCharsSearch = (field) => {
    // eslint-disable-next-line no-useless-escape
    if (/[\<\>\/\\\"]/.exec(field))
        throw new Error(helper.translate("generals.errors.special_chars_search"))

    return true
}

exports.checkSpecialCharsURL = (field) => {
    // eslint-disable-next-line no-useless-escape
    if (/[\<\>\\\'\"]/.exec(field))
        throw new Error(helper.translate("generals.errors.special_chars_URL"))

    return true
}

exports.catchErrors = (errors, myErrors) => {
    if (errors) {
        Object.keys(errors).forEach((key) => {
            // eslint-disable-next-line no-useless-escape
            if (/^models./.exec(errors[key].message)) {
                myErrors[errors[key].path] = helper.translate(errors[key].message)
            } else {
                myErrors[errors[key].path] = errors[key].message
            }
            console.log("%s => %s ", errors[key].path, errors[key].message)
        })
    }
}

exports.trimmedData = function trimmedData(obj) {
    if (!Array.isArray(obj) && typeof obj != 'object') return obj;
    return Object.keys(obj).reduce(function (acc, key) {
        acc[key.trim()] = typeof obj[key] == 'string' ? obj[key].trim() : trimmedData(obj[key]);
        return acc;
    }, Array.isArray(obj) ? [] : {});
}