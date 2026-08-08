const BASE_URL = "https://connectly-backend-jps3.onrender.com";

export async function getConversations(token) {
  const res = await fetch(`${BASE_URL}/api/conversations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function searchUsers(token, username) {
  const res = await fetch(
    `${BASE_URL}/api/users/search?username=${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

export async function createConversation(token, receiverId) {
  const res = await fetch(`${BASE_URL}/api/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      receiverId,
    }),
  });

  return res.json();
}
