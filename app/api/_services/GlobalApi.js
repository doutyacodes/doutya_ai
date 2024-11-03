import axios from "axios";

const SearchUser = (token, data) => {
  // console.log(token)
  if (token) {
    return axios.post("/api/search", data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
  } else {
    return axios.post("/api/search", data);
  }
};

const SignUpUser = (data) => axios.post("/api/signup", data);
const LoginUser = (data) => axios.post("/api/login", data);

// New functions to fetch and add children
const GetUserChildren = async () => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

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
const GetQuizData = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage
  return axios.post("/api/learn/quiz", data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
const GetLearnTopics = async (data) => {
  return axios.post("/api/learn", data);
};
const GetLearnTopicsData = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

  if (token) {
    return axios.post("/api/learn/learn_topic", data, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
  } else {
    return axios.post("/api/learn/learn_topic", data);
  }
};

// New function to fetch courses
const FetchCourses = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

  return axios.post(`/api/fetchcourse`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};

// New function to fetch courses
const FetchSubtopics = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

  return axios.post(`/api/subtopics`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
const SubmitQuizAnswers = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

  return axios.post(`/api/learn/submit-quiz`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
const getChildBadges = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

  return axios.post(`/api/badges`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  });
};
const getSingleBadge = async (data) => {
  const token = localStorage.getItem("token"); // Adjust based on your auth token storage

  return axios.post(`/api/badges/singlebadge`, data, {
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
  AddChild, // Export the new function
  FetchCourses, // Export the new function
  FetchSubtopics,
  GetLearnTopics,
  GetLearnTopicsData,
  GetQuizData,
  SubmitQuizAnswers,
  getChildBadges,
  getSingleBadge
};
