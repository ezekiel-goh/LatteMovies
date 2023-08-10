function generateRandomNumbers(count) {
    const min = 2;
    const max = 15;
    const decimalPlaces = 2;
    const randomNumbers = [];
  
    for (let i = 0; i < count; i++) {
      const randomNumber = (Math.random() * (max - min) + min).toFixed(decimalPlaces);
      randomNumbers.push(randomNumber);
    }
  
    return randomNumbers;
  }
  
  const randomNumbers = generateRandomNumbers(1);
  console.log(randomNumbers);