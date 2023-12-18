export const formatNumber = (number: number) => {
    return number.toLocaleString('en-US', { useGrouping: true }).replace(/,/g, ' ');;
  };