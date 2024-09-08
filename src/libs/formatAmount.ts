export default function formatAmount(a: number) {
  let isNegative = false;
  let floatPart = '';
  let formatedAmount: string | string[] = a.toString();

  if (formatedAmount.match(/^-/)) {
    isNegative = true;
    formatedAmount = formatedAmount.slice(1);
  }

  const floatMatch = formatedAmount.match(/\.\d{1,2}/);

  if (floatMatch) {
    [floatPart] = floatMatch;

    if (floatPart.length === 2) {
      floatPart += '0';
    }

    formatedAmount = formatedAmount.slice(0, floatMatch.index);
  }

  formatedAmount = formatedAmount.split('').reverse();

  let shift = 0;

  for (let i = 1; i < formatedAmount.length; i += 1) {
    if (i % 3 === 0 && formatedAmount[i + shift]) {
      formatedAmount.splice(i + shift, 0, ',');
      shift += 1;
    }
  }

  if (isNegative) {
    formatedAmount.push('-');
  }

  formatedAmount = `${formatedAmount.reverse().join('')}${floatPart}`;

  return formatedAmount;
}
