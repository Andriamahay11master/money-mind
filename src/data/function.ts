
  export const formatNumber = (value : string | undefined | null) => {
    // Format the number with spaces as a separator
    return (value ?? '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };