const getUpperCase = (text) => {
    const upperText = text.trim().toUpperCase();

    return upperText;
};

const getLowerCase = (text) => {
    const lowerText = text.trim().toLowerCase();

    return lowerText;
};

const getSentenceCase = (text) => {
    
    const first = getUpperCase(text[0]);
    const rest = getLowerCase(text.slice(1,));
    const sentence = `${first}${rest}`;

    return sentence;
};

const getProperCase = (text) => {
    
    let finalWords = "";
    const words = text.split(" ");
    words.map(word => {
        finalWords += " " + getSentenceCase(word); 
    })
    
    return finalWords.trim();
};

console.log(getProperCase("hello world"));

module.exports = {
  getUpperCase, 
  getLowerCase, 
  getSentenceCase, 
  getProperCase
};