exports.saveTempOne = (obj) => {
    console.log("personneDao.saveOne => %s", obj)
    return obj.save()
}
