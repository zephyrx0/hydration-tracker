export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };
  
  export const calculateDailyTotal = (entries) => {
    return entries.reduce((total, entry) => total + entry.amount, 0);
  };
  
  export const formatMilliliters = (ml) => {
    return `${ml}ml`;
  };
  