
  export const formatNumber = (value : string | null) => {
    // Format the number with spaces as a separator
    return (value ?? '').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  //remove space in string number
  export const removeSpaceStringNumber = (value: string | undefined | null) => {
    if (value) {
      return value.replace(/\s/g, '');
    }
    return '';
  };

//format date 
export const formatDate = (value : string ) => {

  // Create a Date object from the database string
  const dbDate = new Date(value);

  // Format the date to display only the date part
  const formattedDate = dbDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

  return formattedDate;

}

export const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

