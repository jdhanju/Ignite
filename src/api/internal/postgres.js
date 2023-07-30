// Methods for making fetch calls to postgres server

// Options for different fetch calls
const fetchOptions = {
  POST: {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    }
  },
  GET: {
    method: "GET",
    credentials :"include"
  },
  DELETE: {
    method: "DELETE",
    credentials: "include"
  },
  BEARER_TOKEN: (token) => {
    return {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }
  }
}

// PARAMS: userData - object containing username and password fields
//                    where username can be in either username or email format
async function loginUser(userData) {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/login`, {
    ...fetchOptions.POST,
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  return data;
}

// PARAMS: userData - object containing username, email and password
async function signupUser(userData) {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/new`, {
    ...fetchOptions.POST,
    body: JSON.stringify(userData)
  });

  const data = await res.json();
  return data;
}

//create an invite
async function createInvitation(sender_id, receiver_id, event_id, status, date, start_time){
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/createInvite?sender_id=${sender_id}&receiver_id=${receiver_id}&event_id=${event_id}&status=${status}&date=${date}&start_time=${start_time}`, {
    ...fetchOptions.POST
  });
}

//update an invites status to pending/accepted/rejected
async function updateInviteStatus(invite_id, status){
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/updateInviteStatus?invite_id=${invite_id}&status=${status}`,
    ...fetchOptions.POST
  );
}

//fetch all of a users pending dates (requested dates)
async function getPendingUserInvites(user_id){
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/pendingUserInvites?user_id=${user_id}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

//fetch all of a users pending dates (requested dates)
async function getUpcomingUserInvites(user_id){
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/upcomingUserInvites?user_id=${user_id}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns a list of all users
async function getUsers() {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns user with associated email, or an object 
// containing an error if not found
async function getUserByEmail(email) {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/email?email=${email}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns user with associated username, or an object 
// containing an error if not found
async function getUserByUsername(username) {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/username?username=${username}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Return user with matching ID
async function getUserById(id) {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/${id}`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Returns current session if available
async function getSession() {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/session`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

// Refresh session with updated avatar and cover photo data
async function refreshSession() {
  const res = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/session/refresh`, fetchOptions.GET);
  const data = await res.json();
  return data;
}

async function logoutUser() {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/logout`, fetchOptions.GET);
}

async function loginWithGoogle(token) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/login/google`, fetchOptions.BEARER_TOKEN(token));
}

// Set user avatar photo
async function setAvatar(id, avatar) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/${id}/avatar`, {
    ...fetchOptions.POST,
    body: JSON.stringify({id, avatar})
  })
}

// Set user cover photo
async function setCoverPhoto(id, cover_photo) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/users/${id}/cover_photo`, {
    ...fetchOptions.POST,
    body: JSON.stringify({id, cover_photo})
  })
}


// EVENTS

async function getEventById(id) {
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/events/${id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

async function deleteEvent(id ) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/events/${id}`, fetchOptions.DELETE);
}

// LOCATION

//Get all locations in database
async function getLocations() {
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/locations`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

//Get location by id
async function getLocationById(id) {
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/locations/${id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

// REVIEWS

// Add a review for a given event id
async function addReview(event_id, author_id, comment, score) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/reviews/${event_id}`, {
    ...fetchOptions.POST,
    body: JSON.stringify({
      id: event_id,
      author_id,
      comment,
      score
    })
  });
}

// Edit a review for a given review id
async function editReview(review_id, comment, score) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/reviews/${review_id}/edit`, {
    ...fetchOptions.POST,
    body: JSON.stringify({
      comment,
      score
    })
  })
}

// Get list of all reviews for a given event id
async function getReviews(event_id) {
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/reviews/${event_id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

// Delete a review by review id
async function deleteReview(review_id) {
  await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/reviews/${review_id}`, fetchOptions.DELETE);
}

// Get average review score for a given event id
async function getAverageReviewScore(event_id) {
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/reviews/${event_id}/average`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

//send a rejection email
async function sendEventRejectionEmail(invitation_id){
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/rejectionEmail?invitation_id=${invitation_id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

async function sendEventAcceptanceEmail(invitation_id){
  const result = await fetch(`${import.meta.env.VITE_EXTERNAL_IP}/acceptanceEmail?invitation_id=${invitation_id}`, fetchOptions.GET);
  const data = await result.json();
  return data;
}

export {
  loginUser,
  signupUser,
  getUsers,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getSession,
  refreshSession,
  logoutUser,
  loginWithGoogle,
  setAvatar,
  setCoverPhoto,
  createInvitation,
  getEventById,
  deleteEvent,
  getLocations,
  getLocationById,
  addReview,
  editReview,
  deleteReview,
  getReviews,
  getAverageReviewScore,
  sendEventRejectionEmail,
  sendEventAcceptanceEmail
};