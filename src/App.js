import React, { useState, useEffect } from 'react';
import { fetchData } from './services/apiService';
import MapComponent from './components/mapComponent';


const App = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const result = await fetchData(); // Fetch data using your API service
      console.log(result)
      setData(result);
    };

    fetchDataAsync();
  }, []);


  return (
    <div>
      {data ? <MapComponent data={data} /> : <p>Loading...</p>}
    </div>
  );
};

export default App;
