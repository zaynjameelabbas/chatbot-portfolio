document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    sendButton.addEventListener('click', sendMessage);
});

function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    displayMessage('You: ' + message);
    
    fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: message})
    })
    .then(response => response.json())
    .then(data => {
        console.log('Bot response:', data);
        displayMessage('Bot: ' + data.response);
    })
    .catch(error => {
        console.log('Error:', error);
    });

    input.value = '';
}

function displayMessage(message) {
    const container = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    
    if (message.startsWith('You: ')) {
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message.replace('You: ', '');
    } else {
        messageDiv.className = 'message bot-message';
        
        const avatar = document.createElement('img');
        avatar.className = 'avatar';
        avatar.src = '/static/images/bot-avatar.png';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message.replace('Bot: ', '');
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(textSpan);
    }
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}