module.exports = {
    minlength : (min) => [ min, "Ce champ ne peut pas accepter moins de "+min+" caractères"],
    maxlength : (max) => [ max, "Ce champ ne peut pas accepter plus de "+max+" caractères"],
    min : (min) => [ min, "Ce champ ne peut pas accepter un chiffre moins de "+min],
    max : (max) => [ max, "Ce champ ne peut pas accepter un chiffre plus de "+max]
}