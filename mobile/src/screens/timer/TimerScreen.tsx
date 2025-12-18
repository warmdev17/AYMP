import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  AppState,
  AppStateStatus,
} from 'react-native';
import {useCoupleStore} from '../../store/coupleStore';
import {coupleApi} from '../../services/api';

const TimerScreen = () => {
  const {status, timer, fetchTimer} = useCoupleStore();
  const [displayTime, setDisplayTime] = useState({days: 0, hours: 0, minutes: 0, seconds: 0});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status?.isPaired && timer) {
      startTimer();
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      subscription.remove();
    };
  }, [status?.isPaired, timer]);

  useEffect(() => {
    if (status?.isPaired) {
      loadTimer();
    }
  }, [status?.isPaired]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active' && status?.isPaired) {
      loadTimer();
    }
  };

  const loadTimer = async () => {
    try {
      await fetchTimer();
    } catch (error) {
      console.error('Error loading timer:', error);
    }
  };

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!timer) return;

    intervalRef.current = setInterval(() => {
      if (timer) {
        const now = Date.now();
        const pairedAt = new Date(timer.pairedAt).getTime();
        const elapsed = Math.floor((now - pairedAt) / 1000);

        const days = Math.floor(elapsed / 86400);
        const hours = Math.floor((elapsed % 86400) / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;

        setDisplayTime({days, hours, minutes, seconds});

        // Pulse animation
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.7,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 1000);

    // Sync with server every 30 seconds
    const syncInterval = setInterval(() => {
      loadTimer();
    }, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearInterval(syncInterval);
    };
  };

  if (!status?.isPaired) {
    return (
      <View style={styles.container}>
        <Text style={styles.notPairedText}>Please pair with your partner first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Together</Text>
      {status.partnerDisplayName && (
        <Text style={styles.partnerName}>with {status.partnerDisplayName}</Text>
      )}

      <Animated.View style={[styles.timerContainer, {opacity: fadeAnim}]}>
        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{String(displayTime.days).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Days</Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{String(displayTime.hours).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Hours</Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{String(displayTime.minutes).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Minutes</Text>
        </View>

        <View style={styles.timeBlock}>
          <Text style={styles.timeValue}>{String(displayTime.seconds).padStart(2, '0')}</Text>
          <Text style={styles.timeLabel}>Seconds</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 10,
  },
  partnerName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  timeBlock: {
    alignItems: 'center',
    flex: 1,
  },
  timeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
  },
  notPairedText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default TimerScreen;

