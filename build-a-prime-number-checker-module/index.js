function isPrime(num) {
  if (num < 2) {
    return false;
  }
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) {
      return false;
    }
  }
  return true;
}

module.exports = {
  isPrime
};