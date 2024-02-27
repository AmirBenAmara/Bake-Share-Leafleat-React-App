import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { fetchData } from './services/apiService';
import MapComponent from './components/mapComponent';

// Mock the fetchData function and the MapComponent
jest.mock('./services/apiService', () => ({
  fetchData: jest.fn(),
}));
jest.mock('./components/mapComponent', () => jest.fn(() => null));

describe('App Component', () => {
  it('displays loading initially and then renders MapComponent with fetched data', async () => {
    const mockData = {  }; // Mock the data you expect to fetch
    fetchData.mockResolvedValue(mockData); // Resolve with mock data when fetchData is called

    render(<App />);

    // Check for loading text
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for fetchData to be called and for the MapComponent to be rendered
    await waitFor(() => expect(fetchData).toHaveBeenCalled());
    expect(MapComponent).toHaveBeenCalledWith({ data: [] }, {});
  });
});
