import { useState, useEffect } from "react";
import { Audio } from "expo-av";

export const usePlaySound = () => {
  const file = require("../assets/sounds/buttonclick.mp3");
  const [sound, setSound] = useState();

  useEffect(() => {
    const loadSound = async () => {
      const { sound: loadedSound } = await Audio.Sound.createAsync(file);
      setSound(loadedSound);
    };

    loadSound();

    // Unload sound when the component unmounts
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (sound) {
      // If the sound is already loaded, just replay it
      await sound.replayAsync();
    }
  };

  return playSound;
};

export const usePlayBg = (volume = 1.0) => {
  const [sound, setSound] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      const { sound: loadedSound } = await Audio.Sound.createAsync(
        require("../assets/sounds/bg_music.mp3")
      );
      await loadedSound.setVolumeAsync(volume); // Set the volume here
      setSound(loadedSound);
      setIsLoaded(true);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (isLoaded && sound && !isPlaying) {
      await sound.playAsync();
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    }
  };

  return playSound;
};

export const usePlayMp3 = (file) => {
  const [sound, setSound] = useState();
  const [playbackTimeout, setPlaybackTimeout] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      const { sound: loadedSound } = await Audio.Sound.createAsync(file);
      setSound(loadedSound);
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (playbackTimeout) {
        clearTimeout(playbackTimeout);
      }
    };
  }, [file]);

  const playSound = async (duration = 3000) => {
    if (sound) {
      await sound.playAsync();
      if (duration) {
        const timeoutId = setTimeout(async () => {
          await sound.stopAsync();
        }, duration);
        setPlaybackTimeout(timeoutId);
      }

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          if (playbackTimeout) {
            clearTimeout(playbackTimeout);
            setPlaybackTimeout(null);
          }
        }
      });
    }
  };

  return playSound;
};

export const feedbackSound = async (state = false) => {
  const uri = state
    ? require("../assets/sounds/correct.mp3")
    : require("../assets/sounds/wrong.mp3");
  try {
    const { sound: loadedSound } = await Audio.Sound.createAsync(uri);

    await loadedSound.playAsync();

    // Set a timer to stop the sound after the specified duration
    const timeoutId = setTimeout(async () => {
      if (loadedSound) {
        await loadedSound.stopAsync();
        await loadedSound.unloadAsync();
      }
    }, 1000);

    // Clear the timer if the sound finishes playing naturally
    loadedSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        clearTimeout(timeoutId);
        loadedSound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

const playSoundFromURI = async (uri, duration = 3000) => {
  try {
    const { sound: loadedSound } = await Audio.Sound.createAsync({ uri });

    await loadedSound.playAsync();

    // Set a timer to stop the sound after the specified duration
    const timeoutId = setTimeout(async () => {
      if (loadedSound) {
        await loadedSound.stopAsync();
        await loadedSound.unloadAsync();
      }
    }, duration);

    // Clear the timer if the sound finishes playing naturally
    loadedSound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        clearTimeout(timeoutId);
        loadedSound.unloadAsync();
      }
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

export default playSoundFromURI;
