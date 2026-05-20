export async function getRecommendationsByDestination(destination: string) {
  try {
    // Menyesuaikan URL nnti
    const response = await fetch(`http://localhost:5000/api/recommendations?destination=${destination}`);
    
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error pada getRecommendationsByDestination:", error);
    throw error;
  }
}