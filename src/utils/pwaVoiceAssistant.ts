export interface RouteStep {
  id: string;
  instruction: string;
  voicePrompt: string;
  lat: number;
  lng: number;
}

class PwaVoiceAssistant {
  private spokenStepIds: Set<string> = new Set();
  private routeSteps: RouteStep[] = [];
  private watchId: number | null = null;
  private isMuted: boolean = false;

  /**
   * Speak a text string out loud using native Web Speech API
   */
  public speak(text: string) {
    if (this.isMuted || !('speechSynthesis' in window)) {
      return;
    }

    // Cancel any current speech so new directions take instant priority
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower pace for clear spoken instructions
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Speak through phone speaker
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Calculate distance in meters between two lat/lng points (Haversine formula)
   */
  private getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const rad1 = (lat1 * Math.PI) / 180;
    const rad2 = (lat2 * Math.PI) / 180;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad1) * Math.cos(rad2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Start GPS monitoring and turn-by-turn speech prompting
   */
  public startNavigation(
    steps: RouteStep[],
    onLocationUpdate?: (lat: number, lng: number) => void,
  ) {
    this.stopNavigation(); // Clear any previous active navigation sessions
    this.routeSteps = steps;
    this.spokenStepIds.clear();

    // Initial announcement
    this.speak("Navigation started. Ride safe and stay alert!");

    if (!('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by this browser.');
      return;
    }

    // Start watching rider position via browser GPS
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // 1. Move rider map marker on frontend map
        if (onLocationUpdate) {
          onLocationUpdate(latitude, longitude);
        }

        // 2. Check distance against upcoming turn waypoints
        this.checkProximityAndPrompt(latitude, longitude);
      },
      (error) => {
        console.error('PWA GPS Error:', error);
      },
      {
        enableHighAccuracy: true, // Use real mobile GPS hardware
        maximumAge: 1000,
        timeout: 10000,
      },
    );
  }

  /**
   * Check rider distance against remaining step waypoints
   */
public checkProximityAndPrompt(userLat: number, userLng: number) { // 👈 Change private to public
  this.routeSteps.forEach((step) => {
    if (!this.spokenStepIds.has(step.id)) {
      const distance = this.getDistanceMeters(userLat, userLng, step.lat, step.lng);

      if (distance <= 35) {
        this.spokenStepIds.add(step.id);
        this.speak(step.voicePrompt);
      }
    }
  });
}

  /**
   * Stop tracking and cancel speech
   */
  public stopNavigation() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.spokenStepIds.clear();
  }

  /**
   * Mute / Unmute voice guidance
   */
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }
}

export const voiceAssistant = new PwaVoiceAssistant();