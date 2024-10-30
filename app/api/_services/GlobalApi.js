import axios from "axios";

const getToken = () => localStorage.getItem("token");

const SearchUser = (token, data) => axios.post("/api/search", { data, token });

const SignUpUser = (data) => axios.post("/api/signup", data);
const LoginUser = (data) => axios.post("/api/login", data);

const GetUserChildren = async () => {
  if (!getToken()) throw new Error("Authentication token missing");
  return axios.get("/api/children", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

const AddChild = async (data) => {
  if (!getToken()) throw new Error("Authentication token missing");
  return axios.post("/api/children/add", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

const GetCourses = async (data) => {
  if (!getToken()) throw new Error("Authentication token missing");
  return axios.post("/api/fetchcourse", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

const GetSubtopics = async (data) => {
  if (!getToken()) throw new Error("Authentication token missing");
  return axios.post("/api/subtopics", data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export default {
  SearchUser,
  SignUpUser,
  LoginUser,
  GetUserChildren,
  AddChild,
  GetCourses,
  GetSubtopics,
};
