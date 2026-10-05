function isPrime(a) {

    if (a < 2) {
        return false;
    }

    for (let i = 2; i < a; i++) {

        if (a % i === 0) {
            return false;
        }

    }

    return true;
}

module.exports = {
    isPrime
};

console.log(isPrime(2));
console.log(isPrime(4));
