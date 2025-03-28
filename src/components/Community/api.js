const API_BASE_URL = "http://localhost:6996/user";

const api = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "API request failed");
  return data;
};

export const createCommunity = (name, description, token) =>
  api("/community", "POST", { name, description }, token);

export const joinCommunity = (id, token) =>
  api(`/community/${id}/join`, "POST", null, token);

export const leaveCommunity = (communityId, token) =>
  api(`/leave/${communityId}`, "POST", null, token);

export const getAllCommunities = () => api("/community");

// New: Create a Post
export const createPost = async (communityId, content, imageUrl, token) => {
  return api("/post", "POST", { communityId, content, imageUrl }, token);
};

// New: Get Posts by Community ID
export const getPostsByCommunityId = async (communityId) => {
  return api(`/post/${communityId}`);
};
