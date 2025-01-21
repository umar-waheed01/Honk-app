import { useSelector } from "react-redux";

export const useApiCall = () => {
  const token = useSelector((state) => state.session.token);

  const apiCall = async (endPoint, method, body) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-Auth-Token", token);

    const requestOptions = {
      method: method,
      headers: myHeaders,
      body: body ? JSON.stringify(body) : undefined,
      redirect: "follow",
    };

    try {
      const result = await fetch("https://theafternet.com/" + endPoint, requestOptions);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return apiCall;
};
