function getUpperCase(string) {
    return string.toUpperCase();
}

function getLowerCase(string) {
    return string.toLowerCase();
}

function getSentenceCase(string) {
    const lowerCase = string.toLowerCase();
    return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}

function getProperCase(string) {
    return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

module.exports = {
    getUpperCase,
    getLowerCase,
    getSentenceCase,
    getProperCase,
}