function isPrime(n) {
    if (n <= 1)
        return false;

    // Check divisibility from 2 to n-1
    for (let i = 2; i < n; i++)
        if (n % i === 0)
            return false;

    return true; 
}
module.exports = {isPrime};