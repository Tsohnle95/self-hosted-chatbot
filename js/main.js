document.addEventListener('DOMContentLoaded', () => {

    // --- SETUP: Get all elements once ---
    const submitButtons = document.querySelectorAll('.submit-btn');
    const mobileInput = document.querySelector('#promptInputMobile');
    const desktopInput = document.querySelector('#promptInput');
    const allInputs = [mobileInput, desktopInput];
    const chatContainer = document.querySelector('.chat-container');


    let isFirstSubmission = true; // Flag to track if it's the first submission

    // --- FUNCTION to display the user's message ---
    const displayUserMessage = (message) => {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message-box flex-container justify-right';

        const userParagraph = document.createElement('p');
        userParagraph.className = 'fs-24 light-black';
        userParagraph.textContent = message;

        const userInitial = document.createElement('span');
        userInitial.className = 'fs-24';
        userInitial.textContent = 'T'; // 

        userMessageDiv.appendChild(userParagraph);
        userMessageDiv.appendChild(userInitial);
        chatContainer.appendChild(userMessageDiv);

        scrollToBottom();
    };

    // --- FUNCTION to display the Aos message ---
    const displayAIMessage = (message) => {
        const aiMessageContainer = document.createElement('div');
        aiMessageContainer.className = 'flex-container';

        const aiIconDiv = document.createElement('div');
        aiIconDiv.className = 'ai-message-box flow-icon';
        const aiImage = document.createElement('img');
        aiImage.src = 'img/small-logo.png';
        aiImage.alt = 'ChatFlow Logo';
        aiIconDiv.appendChild(aiImage);

        const aiParagraph = document.createElement('p');
        aiParagraph.className = 'fs-24 light-black';
        aiParagraph.textContent = message;

        aiMessageContainer.appendChild(aiIconDiv);
        aiMessageContainer.appendChild(aiParagraph);
        chatContainer.appendChild(aiMessageContainer);

        scrollToBottom();
    };

    // --- FUNCTION to automatically scroll to the bottom ---
   const scrollToBottom = () => {
    // setTimeout to ensure the browser has rendered the new message
    // and updated the scrollHeight BEFORE scrolling.
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 0);
};

    // fetch backend response
    const getAIResponse = async (userQuery) => {
        // Display a temporary "Thinking..." message
        displayAIMessage('Thinking...');
        try {
            const response = await fetch('https://mammal-capable-really.ngrok-free.app/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true', // Important for ngrok
                    'X-API-KEY': "a-very-hard-to-guess-string-123!@#" // API Key
                },
                body: JSON.stringify({
                    prompt: userQuery
                })
            });

            // Remove the "Thinking..." message
            chatContainer.lastChild.remove();
            const data = await response.json();

            if (response.ok) {
                displayAIMessage(data.response);
            } else {
                displayAIMessage('Error: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            // Remove the "Thinking..." message on failure too
            if (chatContainer.lastChild) {
                chatContainer.lastChild.remove();
            }
            displayAIMessage('Failed to connect to the backend server.');
            console.error('Fetch error:', error);
        }
    };


    // --- LOGIC: The function that handles submission ---
    // --- LOGIC: The function that handles submission ---
    const submission = (event) => {
        // Prevent form from submitting and reloading the page
        event.preventDefault();

        // Check if it's the first time the user has submitted
        if (isFirstSubmission) {
            // Find the container with the example messages
            const initialMessages = document.querySelector('.initial-chat-examples');

            // If that container exists...
            if (initialMessages) {
                // ...remove it.
                initialMessages.remove();
            } // <-- The first missing brace goes here to close the inner 'if'

            // Now that we have handled the first submission, set the flag to false
            // so this block of code will never run again.
            isFirstSubmission = false;
        } // <-- The second brace goes here to close the outer 'if'

        // --- The rest of the function continues as normal ---

        // Check which input field has a value
        const userQuery = desktopInput.value.trim() || mobileInput.value.trim();

        // If both fields are empty, do nothing
        if (!userQuery) {
            return;
        }

        // 1. Display the user's message on the screen
        displayUserMessage(userQuery);

        // 2. Send the user's query to the backend
        getAIResponse(userQuery);


        // 3. Clear both input fields after submission
        desktopInput.value = '';
        mobileInput.value = '';
    };

    // --- BINDING: Attach the event listeners ---

    // Event listener for clicks on both buttons
    submitButtons.forEach(button => {
        button.addEventListener('click', submission);
    });

    // Event listener for "Enter" keypress on both input fields
    allInputs.forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                submission(event);
            }
        });
    });
});