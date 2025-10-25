const PASSWORD = "niggerpassword123"; // CHANGE THIS to your preferred password

const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', () => {
  if (passwordInput.value === PASSWORD) {
    // correct password: show admin panel
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
    loadMessages(); // load messages immediately
  } else {
    // wrong password
    loginError.style.display = 'block';
  }
});

// --- Existing admin message code below ---
const messagesDiv = document.getElementById('messages');
let messagesMap = new Map();

function createMessageElement(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.dataset.id = message._id;
  div.innerHTML = `<strong>${message.name}</strong><br>${message.message}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', async () => {
    try {
      await fetch(`/.netlify/functions/deleteUser?id=${message._id}`, { method: 'DELETE' });
      div.classList.add('fade-out');
      setTimeout(() => div.remove(), 400);
      messagesMap.delete(message._id);
    } catch (err) {
      console.error(err);
      alert('Error deleting message.');
    }
  });

  div.appendChild(deleteBtn);
  setTimeout(() => div.classList.add('show'), 50);
  return div;
}

async function loadMessages() {
  try {
    const res = await fetch('/.netlify/functions/getUsers');
    const data = await res.json();
    const newIds = new Set(data.map(m => m._id));

    // Remove deleted messages
    messagesMap.forEach((el, id) => {
      if (!newIds.has(id)) {
        el.classList.add('fade-out');
        setTimeout(() => el.remove(), 400);
        messagesMap.delete(id);
      }
    });

    // Add new messages
    data.forEach(msg => {
      if (!messagesMap.has(msg._id)) {
        const element = createMessageElement(msg);
        messagesDiv.appendChild(element);
        messagesMap.set(msg._id, element);
      }
    });
  } catch (err) {
    console.error(err);
    messagesDiv.innerHTML = "<p>Error loading messages.</p>";
  }
}

// Auto-refresh every 5 seconds if logged in
setInterval(() => {
  if (adminContainer.style.display === 'block') loadMessages();
}, 5000);
