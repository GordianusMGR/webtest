const form = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');
let messagesMap = new Map();

// Create a message element with animation
function createMessageElement(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.dataset.id = message._id;
  div.innerHTML = `<strong>${message.name}</strong><br>${message.message}`;
  setTimeout(() => div.classList.add('show'), 50);
  return div;
}

// Load messages and handle fade-out for deleted ones
async function loadMessages() {
  try {
    const res = await fetch('/.netlify/functions/getUsers');
    const data = await res.json();
    const newMessageIds = new Set(data.map(m => m._id));

    // Remove deleted messages
    messagesMap.forEach((element, id) => {
      if (!newMessageIds.has(id)) {
        element.classList.add('fade-out');
        setTimeout(() => element.remove(), 400);
        messagesMap.delete(id);
      }
    });

    // Add new messages
data.forEach(msg => {
  if (!messagesMap.has(msg._id)) {
    const messageElement = createMessageElement(msg);
    messagesDiv.prepend(messageElement); // PREPEND instead of append
    messagesMap.set(msg._id, messageElement);
    
  }
});
  } catch (err) {
    console.error(err);
    messagesDiv.innerHTML = "<p>Error loading messages.</p>";
  }
}

// Submit form
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !message) return alert("Please fill out both fields.");

  try {
    const res = await fetch('/.netlify/functions/saveUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });

    const result = await res.json();
    alert(result.message);

    // Add immediately
    const newMessage = createMessageElement(result.data);
    messagesDiv.prepend(newMessage);
    messagesMap.set(result.data._id, newMessage);


  } catch (err) {
  }
});

// Initial load & auto-refresh
loadMessages();
setInterval(loadMessages, 5000);
