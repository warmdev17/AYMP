import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useCoupleStore} from '../../store/coupleStore';
import {pairingApi} from '../../services/api';
import {useNavigation} from '@react-navigation/native';

const PairingScreen = () => {
  const navigation = useNavigation();
  const {status, fetchStatus} = useCoupleStore();
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    checkPairingStatus();
  }, []);

  const checkPairingStatus = async () => {
    try {
      await fetchStatus();
      if (status?.isPaired) {
        navigation.navigate('Main' as never);
      }
    } catch (error) {
      console.error('Error checking pairing status:', error);
    }
  };

  const handleGenerateCode = async () => {
    setGenerating(true);
    try {
      const response = await pairingApi.generateCode();
      setGeneratedCode(response.code);
      Alert.alert('Pairing Code', `Your code: ${response.code}\n\nShare this with your partner!`);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to generate code');
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmPairing = async () => {
    if (!code || code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await pairingApi.confirmPairing(code);
      await fetchStatus();
      Alert.alert('Success', 'You are now paired!');
      navigation.navigate('Main' as never);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Invalid pairing code');
    } finally {
      setLoading(false);
    }
  };

  if (status?.isPaired) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pair with Your Partner</Text>
      <Text style={styles.subtitle}>
        Generate a code to share or enter a code from your partner
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Generate Code</Text>
        <TouchableOpacity
          style={[styles.button, generating && styles.buttonDisabled]}
          onPress={handleGenerateCode}
          disabled={generating}>
          {generating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Pairing Code</Text>
          )}
        </TouchableOpacity>
        {generatedCode && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{generatedCode}</Text>
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Partner's Code</Text>
        <TextInput
          style={styles.input}
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          maxLength={6}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleConfirmPairing}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Pair</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
    color: '#e91e63',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#e91e63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  codeContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 48,
    fontWeight: 'bold',
    letterSpacing: 8,
    color: '#e91e63',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 30,
  },
});

export default PairingScreen;

