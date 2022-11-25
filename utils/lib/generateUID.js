
/*
 this function will generate 6 alphanumeric unique Ids
for about 46k(36^6) entries, afterwhich a check
would have to be done to ensure there are
no duplicates
*/

const generateUID = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

module.exports = { generateUID }