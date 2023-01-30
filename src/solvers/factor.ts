/**
 *
 * @param {number} n
 */
function largestPrimeFactor(n: number) {
  let i = 2;
  while (i <= n) {
    if (n % i == 0) {
      n /= i;
    } else {
      i++;
    }
  }
  console.log(i);
}
const a = 310000169;
largestPrimeFactor(a);
