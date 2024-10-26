const { default: axios } = require("axios");
const SearchUser = (data) => axios.post("/api/search", data);
export default {
  SearchUser,
};
