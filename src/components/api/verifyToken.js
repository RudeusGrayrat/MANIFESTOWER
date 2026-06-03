import axios from "./axios";

export const verifyToken = async (localToken) => {
  try {
    const response = await axios.get("/auth/verify", {
      headers: { Authorization: `Bearer ${localToken}` },
    });
    return response;
  } catch (error) {
    return error;
  }
};
