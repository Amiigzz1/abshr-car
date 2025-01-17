interface EligibilityResult {
  isEligible: boolean;
  availablePayment: number;
  details: {
    maxAllowedPayment: number;
    currentObligations: number;
    remainingCapacity: number;
    minRequiredPayment: number;
  };
}

export const calculateEligibility = (salary: number, obligations: number): EligibilityResult => {
  const maxPayment = salary * 0.45;
  const availablePayment = maxPayment - obligations;
  const minPayment = 750;

  return {
    isEligible: availablePayment >= minPayment,
    availablePayment: Math.round(availablePayment),
    details: {
      maxAllowedPayment: Math.round(maxPayment),
      currentObligations: obligations,
      remainingCapacity: Math.round(availablePayment),
      minRequiredPayment: minPayment
    }
  };
};