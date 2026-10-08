const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function getUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  return handleResponse(response);
}

export async function createUser(user) {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
}