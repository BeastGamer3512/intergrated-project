
document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const modeIcon = document.getElementById('modeIcon');
    const goToSignup = document.getElementById('goToSignup');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const message = document.getElementById('message');
    const userContainer = document.getElementById('user-container');
    const user = document.getElementById('user');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const socket = io('http://localhost:3000');

    // Toggles between light and dark modes
    function toggleMode() {
        const body = document.body;
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');
        updateIcon();
    }

    // Updates the mode icon based on the current mode
    function updateIcon() {
        const modeIcon = document.getElementById("modeIcon");
        if (document.body.classList.contains('dark-mode')) {
            modeIcon.classList.remove('fa-moon');
            modeIcon.classList.add('fa-sun');
        } else {
            modeIcon.classList.remove('fa-sun');
            modeIcon.classList.add('fa-moon');
        }
    }

    // Handles the login form submission
    function handleLogin(event) {
        event.preventDefault(); // Prevents default form submission

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (username && password) {
            // Redirects to the profile page
            window.location.href = "profile.html";
        } else {
            // Alerts the user if credentials are missing
            alert("Please enter valid credentials.");
        }
    }
    socket.on('connect', () => {
        console.log('Connected to server');
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
    socket.on('message', (msg) => {
        addMessage(msg.text, 'received');
    });
    socket.on('user', (msg) => {
        user.textContent = msg.text;
    });
    socket.on('email', (msg) => {
        email.textContent = msg.text;
    });
    socket.on('password', (msg) => {
        password.textContent = msg.text;
    });
    socket.on('typing', (msg) => {
        typingIndicator.textContent = msg.text;
    });

    

    let messages = [];
    function renderMessages() {
        messagesContainer.innerHTML = '';
        messages.forEach((msg) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', msg.type);
            messageDiv.innerHTML = `
            <div>${msg.text}</div>
            <div class="timestamp">${msg.timestamp}</div>
        `;
            messagesContainer.appendChild(messageDiv);
        });


        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    }   

    function addMessage(text, type) {
        const timestamp = new Date().toLocaleTimeString();
        messages.push({ text, type, timestamp });
        renderMessages();
    }
    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text) {
            addMessage(text, 'sent');
            messageInput.value = '';
            typingIndicator.textContent = '';
            setTimeout(() => {
                addMessage('This is a reply!', 'received');
            }, 1000);
        }
    });
    messageInput.addEventListener('keypress', (e) => {
        typingIndicator.textContent = 'User is typing...';
        if (e.key === 'Enter') {
            sendButton.click();
        }
        setTimeout(() => {
            typingIndicator.textContent = '';
        }, 2000);
    });
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        if (email && password) {
            alert('Logging in...');
        } else {
            alert('Please enter both email and password.');
        }
    });
    goToSignup.addEventListener('click', () => {
        alert('Redirecting to Sign Up page (not implemented).');
    });
    const onlineStatus = document.getElementById('online-status');
    window.addEventListener('online', () => {
        onlineStatus.textContent = 'Online';
        onlineStatus.classList.remove('offline');
        onlineStatus.classList.add('online');
    });
    window.addEventListener('offline', () => {
        onlineStatus.textContent = 'Offline';
        onlineStatus.classList.remove('online');
        onlineStatus.classList.add('offline');
    });
    modeIcon.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}
);



