export const getTotal = (
    productValue: number = 0,
    shippingCost: number = 0,
    taxesPercentage: number = 0,
    dolarValue: number = 1
) => {
    const productValueWithTax = productValue * 1.3;
    const customDuty = taxesPercentage !== 0 ? calculateCustomDuty(taxesPercentage, productValue) : 0;
    const amountOnProductAndServices = productValueWithTax + customDuty + shippingCost;
    const total = amountOnProductAndServices * dolarValue;
    return total;
};

const calculateCustomDuty = (taxesPercentage: number, productValue: number) => {
    const customDuty = (taxesPercentage * productValue) / 100
    return customDuty
}