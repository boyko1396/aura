/**
 * !(i)
 * The code is included in the final file only when a function is called, for example: FLSFunctions.spollers();
 * Or when the entire file is imported, for example: import "files/script.js";
 * Unused code does not end up in the final file.

 * If we want to add a module, we should uncomment it.
 */


document.addEventListener('DOMContentLoaded', function() {
  // autoscroll end content
  var scrollableContainer = document.getElementById('chatContentBox');

  if (scrollableContainer) {
    function scrollToBottom() {
      scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
    }
    window.addEventListener('load', scrollToBottom);
  }
});