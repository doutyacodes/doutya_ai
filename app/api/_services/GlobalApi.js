const { default: axios } = require("axios");
const SearchUser = (data) => axios.post("/api/search", data);
const SignUpUser = (data) => axios.post("/api/signup", data);
export default {
  SearchUser,
  SignUpUser,
};
