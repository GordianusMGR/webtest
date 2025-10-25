const nameInput = document.getElementById('name');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submit-btn');
const messagesDiv = document.getElementById('messages');
let messagesMap = new Map();

// Submit message
submitBtn.addEventListener('click', async () => {
  const name = nameInput.value.trim();
  const message = messageInput.value.trim();
  if (!name || !message) return alert('Enter name & message.');

  try {
    const res = await fetch('/.netlify/functions/saveUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message })
    });
    const result = await res.json();
    if (!result.data) throw new Error('No data returned');

    const el = createMessageElement(result.data);
    messagesDiv.prepend(el);
    messagesMap.set(result.data._id, el);

    nameInput.value = '';
    messageInput.value = '';
  } catch (err) {
    console.error(err);
    alert('Error sending message.');
  }
});

function createMessageElement(msg) {
  const div = document.createElement('div');
  div.classList.add('message', 'new');
  div.dataset.id = msg._id;
  div.innerHTML = `<strong>${msg.name}</strong><br>${msg.message}`;

  setTimeout(() => {
    div.classList.add('show');
    div.classList.remove('new');
  }, 50);
  return div;
}

async function loadMessages() {
  try {
    const res = await fetch('/.netlify/functions/getUsers');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid data');

    const newIds = new Set(data.map(m => m._id));

    // Remove deleted
    messagesMap.forEach((el, id) => {
      if (!newIds.has(id)) {
        el.classList.add('fade-out');
        setTimeout(() => el.remove(), 400);
        messagesMap.delete(id);
      }
    });

    // Add new
    data.forEach(msg => {
      if (!messagesMap.has(msg._id)) {
        const el = createMessageElement(msg);
        messagesDiv.prepend(el);
        messagesMap.set(msg._id, el);
      }
    });

    messagesDiv.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error(err);
    messagesDiv.innerHTML = "<p>Error loading messages.</p>";
  }
}

setInterval(loadMessages, 5000);
loadMessages();
