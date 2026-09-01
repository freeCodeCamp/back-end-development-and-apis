# Case Converter

This package is used to convert strings to a specific case..

## Installation

```bash
npm install case_converter
```

## Usage
```js
const caseConverter = require("./index");
const str = "hello free Code Camp!";
console.log(caseConverter.getUpperCase(str)); // HELLO FREE CODE CAMP!
console.log(caseConverter.getLowerCase(str)); // hello free code camp!
console.log(caseConverter.getProperCase(str)); // Hello Free Code Camp!
console.log(caseConverter.getSentenceCase(str)); // Hello free code camp!
```

## License
MIT license