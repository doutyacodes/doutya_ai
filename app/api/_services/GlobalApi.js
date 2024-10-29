const { default: axios } = require("axios");

const SearchUser = (data) => axios.post("/api/search", data);
const SignUpUser = (data) => axios.post("/api/signup", data);
const FetchSubtopics = (data) => axios.post("/api/subtopics", data);

export default {
  SearchUser,
  SignUpUser,
  FetchSubtopics,
};
