function isPrime(num) {
    let prime = true;

    if (num <= 1) {
        prime = false;
    } else {
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                prime = false;
                break;
            }
        }
    }

    return prime
}

module.exports = { isPrime }