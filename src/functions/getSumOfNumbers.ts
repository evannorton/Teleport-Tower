const getSumOfNumbers: (numbers: number[]) => number = (numbers: number[]): number => numbers.reduce((a: number, b: number): number => a + b, 0);

export default getSumOfNumbers;