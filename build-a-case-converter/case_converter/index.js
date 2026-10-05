function getUpperCase(word){
return word.toUpperCase();
}

function getLowerCase(word){
    return word.toLowerCase();
}
function getSentenceCase(word){
return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

console.log(getSentenceCase("hello WorLd"));
console.log(getSentenceCase("HELLO WORlD"));
console.log(getSentenceCase("hELLO wORLD"));

function getProperCase(word2) {
    return word2
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

module.exports ={
getUpperCase,
getLowerCase,
getSentenceCase,
getProperCase

};
