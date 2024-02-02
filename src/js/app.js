/**
 * !(i)
 * The code is included in the final file only when a function is called, for example: FLSFunctions.spollers();
 * Or when the entire file is imported, for example: import "files/script.js";
 * Unused code does not end up in the final file.

 * If we want to add a module, we should uncomment it.
 */

// support webp, identify device
import BaseHelpers from './helpers/BaseHelpers.js';
BaseHelpers.addLoadedClass();

document.addEventListener('DOMContentLoaded', () => {
  // hide keyboard
  var textareaMessageEl = document.getElementById('messageTextarea');
  document.activeElement.blur();

  // chat
  const textToType = 'What is Aùra Ai?';
  const chatContentBox = document.getElementById('chatContentBox');
  const messageTextarea = document.getElementById('messageTextarea');
  const sendMessageBtn = document.getElementById('sendMessageBtn');
  const chatContainer = document.getElementById('chatContentBody');
  const chatHint = document.getElementById('chatContentHint');
  const chatHintButtons = document.querySelectorAll('.js-hint-card');
  const DESKTOP_WIDTH_THRESHOLD = 560;
  const MOBILE_WIDTH_THRESHOLD = 350;

  let isTyping = true;

  const typeTextEffect = (text, element, delay) => {
    setTimeout(() => {
      if (document.documentElement.classList.contains('is-loaded')) {
        isTyping = true;

        const typeCharacter = (index) => {
          if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;

            const range = document.createRange();
            range.selectNodeContents(element);
            range.collapse(false);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);

            setTimeout(() => {
              typeCharacter(index);
            }, 10);
          } else {
            isTyping = false;
          }
        };

        typeCharacter(0);
      }
    }, delay);
  };

  typeTextEffect(textToType, messageTextarea, 450);

  const typeApiResponse = (text, element) => {
    isTyping = true;

    const typeCharacter = (index) => {
      if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;

        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        setTimeout(() => {
          typeCharacter(index);
        }, 30);

        element.classList.add('is-active');і
      } else {
        isTyping = false;

        element.classList.remove('is-active');
      }
    };

    typeCharacter(0);
  };

  const updateSendButtonState = () => {
    const isMessageEmpty = messageTextarea.innerHTML.trim() === '';

    sendMessageBtn.classList.toggle('is-disabled', isMessageEmpty || isTyping);
  };

  const sendMessageByEnter = () => {
    const message = messageTextarea.innerText.trim();
    const useMock = false;
    const apiUrl = 'https://api.fromnverse.com/post_message';

    if (message !== '' && !isTyping) {
      addChatCard('Me', message);
      sendMessage(message, apiUrl, useMock);
      document.body.classList.add('is-chat');

      // const newUrl = '/chat/';
      // history.pushState({ page: 'chat' }, 'Chat', newUrl);

      messageTextarea.innerHTML = '';
      updateSendButtonState();
    }
  };

  window.addEventListener('popstate', (event) => {
    window.location.href = '/';
  });

  const sendHintMessage = (hint) => {
    const useMock = false;
    const apiUrl = 'https://api.fromnverse.com/post_message';

    addChatCard('Me', hint);
    sendMessage(hint, apiUrl, useMock);
    document.body.classList.add('is-chat');
  };

  const sendMessage = (message, apiUrl, useMock) => {
    addChatCard('Aùra Ai', '', true);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    const data = {
      message: message,
      useMock: useMock
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

  chatHintButtons.forEach(button => {
    button.addEventListener('click', () => {
      const hint = button.getAttribute('data-hint');
      sendHintMessage(hint);
    });
  });

  let successfulResponsesCount = 0;

  const handleSuccessfulResponse = (xhr) => {
    const jsonResponse = JSON.parse(xhr.responseText);
    const answerText = jsonResponse.answer;

    const highlightedAnswer = highlightWordsInStars(answerText);

    addChatCard('Aùra Ai', '');
    typeApiResponse(highlightedAnswer, chatContainer.lastChild.querySelector('.aura-chat__card-text'));
    messageTextarea.innerHTML = '';
    updateSendButtonState();

    successfulResponsesCount++;

    if (successfulResponsesCount >= 1) {
      chatHint.classList.add('is-show');
      chatContentBox.scrollTop = chatContentBox.scrollHeight;
    }

    if (successfulResponsesCount >= 3) {
      chatHint.classList.remove('is-show');
    }
  };

  const highlightWordsInStars = (text) => {
    return text.replace(/\*\*([^*]+)\*\*/g, (match, word) => {
      return `<strong>${word}</strong>`;
    });
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

    const cardText = document.createElement('pre');
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
    messageTextarea.classList.add('is-typing');

    if (screenWidth > 1200) {
      if (messageTextarea.offsetWidth > DESKTOP_WIDTH_THRESHOLD) {
        document.body.classList.add('is-chat');
      } else {
        document.body.classList.remove('is-chat');
      }
    } else if (screenWidth <= 1200 && screenWidth > 400) {
      if (messageTextarea.offsetWidth > MOBILE_WIDTH_THRESHOLD) {
        document.body.classList.add('is-chat');
      } else {
        document.body.classList.remove('is-chat');
      }
    } else {
      if (messageTextarea.offsetWidth > 260) {
        document.body.classList.add('is-chat');
      } else {
        document.body.classList.remove('is-chat');
      }
    }

    updateSendButtonState();
  });

  messageTextarea.addEventListener('click', () => {
    messageTextarea.classList.add('is-typing');
  });

  messageTextarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageByEnter();
    }
  });

  sendMessageBtn.addEventListener('click', sendMessageByEnter);
});