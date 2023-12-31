/* eslint-disable no-undef */
(async () => {
  const myUser = await generateRandomUser();
  let activeUsers = [];
  let typingUsers = [];

  const socket = new WebSocket(generateBackendUrl());
  socket.addEventListener('open', () => {
    console.log('WebSocket connected!');
    socket.send(JSON.stringify({ type: 'newUser', user: myUser }));
  });
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    console.log('WebSocket message:', message);
    switch (message.type) {
      case 'message':
        // eslint-disable-next-line no-case-declarations
        const messageElement = generateMessage(message, myUser);
        document.getElementById('messages').appendChild(messageElement);
        setTimeout(() => {
          messageElement.classList.add('opacity-100');
        }, 100);
        break;
      case 'activeUsers':
        activeUsers = message.users;
        break;
      case 'typing':
        typingUsers = message.users;
        updateTypingUsersDisplay();
        break;
      default:
        break;
    }
  });
  function updateTypingUsersDisplay(username) {
    const typingUsersElement = document.getElementById('typingUsers');
    if (!typingUsersElement) return;

    if (typingUsers.length > 0) {
      const jsonString = JSON.stringify({ type: 'typing', user: myUser });
      const jsonObject = JSON.parse(jsonString);

      const activeTyping = `${jsonObject.user.name} typing...`;
      typingUsersElement.textContent = `${activeTyping}`;
    } else {
      typingUsersElement.textContent = '';
    }
  }
  socket.addEventListener('close', (event) => {
    console.log('WebSocket closed.');
  });
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  });

  // Wait until the DOM is loaded before adding event listeners
  document.addEventListener('DOMContentLoaded', (event) => {
    // Send a message when the send button is clicked
    document.getElementById('sendButton').addEventListener('click', () => {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    });
  });

  document.addEventListener('keydown', (event) => {
    // Only send if the typed in key is not a modifier key
    if (event.key.length === 1) {
      socket.send(JSON.stringify({ type: 'typing', user: myUser }));
    }
    // Only send if the typed in key is the enter key
    if (event.key === 'Enter') {
      const message = document.getElementById('messageInput').value;
      socket.send(JSON.stringify({ type: 'message', message, user: myUser }));
      document.getElementById('messageInput').value = '';
    }
  });
})();

function toggleDarkMode() {
  let darkModeInput = document.getElementById('darkmode');
  let mainBg = document.getElementById('mainBg');
  let headerDiv = document.getElementById('headerDiv');
  let messageDiv = document.getElementById('messages');
  let darkmodeLabel = document.getElementById('darkmodeLabel');
  let inputBox = document.getElementById('inputBox');
  let sendButton = document.getElementById('sendButton');

  if (darkModeInput.checked) {
    // Dark Mode aktiviert
    sendButton.style.filter = 'invert(1)';
    inputBox.style.backgroundColor = '#D1D5DB';
    mainBg.style.backgroundColor = '#1f1f1f';
    headerDiv.style.backgroundColor = '#1E3A8A';
    messageDiv.style.backgroundColor = '#333333';
    darkmodeLabel.style.backgroundColor = '#fff';
    darkmodeLabel.style.color = '#000';
    darkmodeLabel.textContent = 'Lightmode';
  } else {
    // Dark Mode deaktiviert
    inputBox.style.backgroundColor = '#F3F4F6';
    mainBg.style.backgroundColor = '#fff';
    headerDiv.style.backgroundColor = '#3B82F6';
    messageDiv.style.backgroundColor = '#fff';
    darkmodeLabel.style.backgroundColor = '#333';
    darkmodeLabel.style.color = '#fff';
    darkmodeLabel.textContent = 'Darkmode';
    sendButton.style.filter = 'invert(0)';
  }
}
