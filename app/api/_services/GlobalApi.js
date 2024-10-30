import axios from "axios";

const SearchUser = (token, data) => {
  return axios.post("/api/search", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

const SignUpUser = (data) => axios.post("/api/signup", data);
const LoginUser = (data) => axios.post("/api/login", data);

// New functions to fetch and add children
const GetUserChildren = async (token) => {
  return axios.get("/api/children", {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

const AddChild = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage
  return axios.post("/api/children/add", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

// New function to fetch courses
const FetchCourses = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage
  
  return axios.post(`/api/fetchcourse`,data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

// New function to fetch courses
const FetchSubtopics = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage
  
  return axios.post(`/api/subtopics`,data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

export default {
  SearchUser,
  SignUpUser,
  LoginUser,
  GetUserChildren, // Export the new function
  AddChild,        // Export the new function
  FetchCourses,    // Export the new function
  FetchSubtopics
};
