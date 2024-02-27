
const fetchData = async () => {
    try {
      const response = await fetch('http://api.citybik.es/v2/networks');
      const data = await response.json();
      console.log(data);
      return data; // Adjust as needed
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };
  
  export { fetchData };