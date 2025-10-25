const PASSWORD = "mypassword123"; // Change to your password

const loginContainer = document.getElementById('login-container');
const adminContainer = document.getElementById('admin-container');
const loginBtn = document.getElementById('login-btn');
const passwordInput = document.getElementById('admin-password');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', () => {
  if (passwordInput.value === PASSWORD) {
    loginContainer.style.display = 'none';
    adminContainer.style.display = 'block';
    loadMessages();
  } else {
    loginError.style.display = 'block';
  }
});

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
      const res = await fetch(`/.netlify/functions/deleteUser?id=${message._id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (res.ok) {
        div.classList.add('fade-out');
        setTimeout(() => div.remove(), 400);
        messagesMap.delete(message._id);
      } else {
        alert('Error deleting message: ' + result.error);
      }
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

    messagesMap.forEach((el, id) => {
      if (!newIds.has(id)) {
        el.classList.add('fade-out');
        setTimeout(() => el.remove(), 400);
        messagesMap.delete(id);
      }
    });

    data.forEach(msg => {
      if (!messagesMap.has(msg._id)) {
        const element = createMessageElement(msg);
        messagesDiv.prepend(element);
        messagesMap.set(msg._id, element);
      }
    });
  } catch (err) {
    console.error(err);
    messagesDiv.innerHTML = "<p>Error loading messages.</p>";
  }
}

// Auto-refresh
setInterval(() => {
  if (adminContainer.style.display === 'block') loadMessages();
}, 5000);
