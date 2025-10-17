import axios from "axios";

const userProfile = {
  name: "Emmanuel Oluwaseyi Fortress",
  email: "seyifortress@gmail.com",
  stack: "MERN Stack Technologies",
};

/*
 ** Providing my profile with a dynamic cat qoute on every request. **
 */
const getUserProfile = async (_, response) => {
  const timestamp = new Date().toISOString();
  try {
    const extResponse = await axios.get("https://catfact.ninja/fact", {
      timeout: 5000, // abort request after 5s (no automatic retry)
    });

    if (
      extResponse.status !== 200 ||
      !extResponse.data ||
      !extResponse.data.fact
    ) {
      return response.status(502).json({
        status: "error",
        message:
          "Quote service is returned an unexpected response. Pls try again.",
        timestamp: timestamp,
        user: {
          email: userProfile.email,
          name: userProfile.name,
          stack: userProfile.stack,
        },
      });
    } else {
      const catFact = extResponse.data.fact;

      return response.status(200).json({
        status: "success",
        user: {
          email: userProfile.email,
          name: userProfile.name,
          stack: userProfile.stack,
        },
        timestamp: timestamp,
        fact: catFact,
      });
    }
  } catch (error) {
    // Axios-specific handling
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        return response.status(504).json({
          status: "error",
          message: "Quote service timed out.",
          timestamp,
        });
      }
      if (error.response) {
        return response.status(502).json({
          status: "error",
          message: "Quote service error.",
          upstreamStatus: error.response.status,
          timestamp,
        });
      }
    }

    // Fallback for unexpected errors
    return response.status(500).json({
      status: "error",
      message: `Internal server error: ${error.message}`,
      timestamp,
    });
  }
};

export default getUserProfile;
