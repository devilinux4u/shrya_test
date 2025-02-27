const API_BASE_URL = "http://localhost:5000/api";

export const fetchVehicles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};
