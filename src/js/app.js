/**
 * !(i)
 * The code is included in the final file only when a function is called, for example: FLSFunctions.spollers();
 * Or when the entire file is imported, for example: import "files/script.js";
 * Unused code does not end up in the final file.

 * If we want to add a module, we should uncomment it.
 */

document.addEventListener('DOMContentLoaded', () => {
  const textToType = 'What is Aùra Ai?';
  const chatContentBox = document.getElementById('chatContentBox');
  const messageTextarea = document.getElementById('messageTextarea');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatContainer = document.getElementById('chatContentBody');
  const chatHint = document.getElementById('chatContentHint');
  const DESKTOP_WIDTH_THRESHOLD = 560;
  const MOBILE_WIDTH_THRESHOLD = 360;

  let isTyping = true;

  const typeTextEffect = (text, element) => {
    const typeCharacter = (index) => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;

        element.focus();
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        setTimeout(() => {
          typeCharacter(index);
        }, 70);
      } else {
        isTyping = false;
      }
    };

    typeCharacter(0);
  };

  typeTextEffect(textToType, messageTextarea);

  const updateSendButtonState = () => {
    const isMessageEmpty = messageTextarea.innerHTML.trim() === '';

    sendMessageBtn.classList.toggle('is-disabled', isMessageEmpty || isTyping);
  };

  const sendMessageByEnter = () => {
    const message = messageTextarea.innerText.trim();
    const useMock = true;
    const url = useMock ? 'http://3.75.239.18/post_message_mock' : 'http://3.75.239.18/post_message';

    if (message !== '' && !isTyping) {
      addChatCard('Me', message);
      sendMessage(message, url);
      document.body.classList.add('is-chat');
    }

    messageTextarea.focus();
  };

  const sendMessage = (message, url) => {
    addChatCard('Aùra Ai', '', true);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const data = {
      message: message
    };

    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        removeLastChatCard();

        if (xhr.status === 200) {
          handleSuccessfulResponse(xhr);
        } else {
          handleErrorResponse(xhr);
        }
      }
    };
  };

  let successfulResponsesCount = 0;

  const handleSuccessfulResponse = (xhr) => {
    console.log('Сообщение успешно отправлено');
    const jsonResponse = JSON.parse(xhr.responseText);
    addChatCard('Aùra Ai', jsonResponse.answer);
    messageTextarea.innerHTML = '';
    updateSendButtonState();
    messageTextarea.focus();
    console.log('Ответ сервера:', jsonResponse);

    successfulResponsesCount++;

    if (successfulResponsesCount >= 3) {
      chatHint.classList.add('is-show');
    }
  };

  const handleErrorResponse = (xhr) => {
    console.error('Ошибка при отправке: ' + xhr.status);
  };

  const addChatCard = (name, text, isWaiting) => {
    const card = document.createElement('div');
    card.className = 'aura-chat__card';
    const cardName = document.createElement('div');
    cardName.className = 'aura-chat__card-name';
    cardName.innerText = name;

    if (isWaiting) {
      const cardDot = document.createElement('div');
      cardDot.className = 'aura-chat__card-dot';
      cardName.appendChild(cardDot);
    }

    const cardText = document.createElement('div');
    cardText.className = 'aura-chat__card-text';
    cardText.innerHTML = text;

    card.appendChild(cardName);
    card.appendChild(cardText);

    chatContainer.appendChild(card);

    chatContentBox.scrollTop = chatContentBox.scrollHeight;

    const lastCard = chatContainer.lastChild;
    lastCard.className = 'aura-chat__card';
  };

  const removeLastChatCard = () => {
    chatContainer.removeChild(chatContainer.lastChild);
  };

  messageTextarea.addEventListener('input', () => {
    const screenWidth = window.innerWidth;

    if (screenWidth > 1200) {
      if (messageTextarea.offsetWidth > DESKTOP_WIDTH_THRESHOLD) {
        document.body.classList.add('is-chat');
      } else {
        document.body.classList.remove('is-chat');
      }
    } else {
      if (messageTextarea.offsetWidth > MOBILE_WIDTH_THRESHOLD) {
        document.body.classList.add('is-chat');
      } else {
        document.body.classList.remove('is-chat');
      }
    }

    updateSendButtonState();
  });

  messageTextarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageByEnter();
    }
  });

  sendMessageBtn.addEventListener('click', sendMessageByEnter);
});