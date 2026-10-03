// src/utils/audioCelebration.ts

export const triggerEarningsCelebration = (amountFormatted: string, todayTotalFormatted: string) => {
  // 1. Spoken Audio Prompt via Web Speech
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Clear queued speech
    const speech = new SpeechSynthesisUtterance(
      `Congratulations! You earned ${amountFormatted}. Total today is ${todayTotalFormatted}. Great job!`
    );
    speech.rate = 1.0;
    speech.pitch = 1.1;
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
  }

  // 2. Optional Haptic Feedback (Vibration for mobile PWA)
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }
};