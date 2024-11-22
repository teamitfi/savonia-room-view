import axios from "axios";

const API_URL = "<YourBackendFunctionURL>";

export const fetchRoomData = async () => {
    const response = await axios.get(API_URL);
    console.log(response.data);
    return response.data;
};
