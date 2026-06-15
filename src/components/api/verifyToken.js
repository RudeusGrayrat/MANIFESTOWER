import axios from "./axios";

export const verifyToken = async (localToken) => {
  try {
    const response = await axios.get("/manifesTower/authVerify", {
      headers: { Authorization: `Bearer ${localToken}` },
    });
    return response.data
  } catch (error) {
    throw error;
  }
};
