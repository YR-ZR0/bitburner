function maxSubArraySum(a: number[], size: number) {
  const maxint = Math.pow(2, 53);
  let max_so_far = -maxint - 1;
  let max_ending_here = 0;
  for (let i = 0; i < size; i++) {
    max_ending_here = max_ending_here + a[i];
    if (max_so_far < max_ending_here) max_so_far = max_ending_here;
    if (max_ending_here < 0) max_ending_here = 0;
  }
  return max_so_far;
}
// Driver code
const arr = [
  -9, -8, -4, -10, -8, 6, 10, -9, -3, 10, -8, 5, -8, 0, -2, -9, 4, -1, 3, 7, -8,
  2, 1, 1,
];
console.log("Maximum contiguous sum is", maxSubArraySum(arr, arr.length));
