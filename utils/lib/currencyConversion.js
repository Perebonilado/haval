
exports.convertNairaToKobo = (naira) => {
    const koboToNaira = 100
    const kobo = Number(naira) * koboToNaira
    return kobo
}

exports.convertKoboToNaira = (kobo) => {
    const koboToNaira = 100
    const naira = Number(kobo)/koboToNaira
    return naira
}