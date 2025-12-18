import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useQuickMessageStore} from '../../store/quickMessageStore';
import {useCoupleStore} from '../../store/coupleStore';

const PREDEFINED_MESSAGES = [
  {id: '1', content: '❤️ I miss you'},
  {id: '2', content: '😊 Thinking about you'},
  {id: '3', content: '☕ Call me'},
];

const QuickMessageScreen = () => {
  const {status} = useCoupleStore();
  const {messages, isLoading, fetchMessages, createMessage, deleteMessage, sendNotification} =
    useQuickMessageStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status?.isPaired) {
      fetchMessages();
    }
  }, [status?.isPaired]);

  const handleSendPredefined = async (content: string) => {
    setSending(true);
    try {
      await sendNotification(content);
      Alert.alert('Sent', 'Message sent to your partner!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendCustom = async (content: string) => {
    setSending(true);
    try {
      await sendNotification(content);
      Alert.alert('Sent', 'Message sent to your partner!');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleCreateMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Message cannot be empty');
      return;
    }

    if (newMessage.length > 50) {
      Alert.alert('Error', 'Message must be 50 characters or less');
      return;
    }

    try {
      await createMessage(newMessage);
      setNewMessage('');
      setShowCreateModal(false);
      Alert.alert('Success', 'Custom message created');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create message');
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Message', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMessage(id);
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to delete message');
          }
        },
      },
    ]);
  };

  if (!status?.isPaired) {
    return (
      <View style={styles.container}>
        <Text style={styles.notPairedText}>Please pair with your partner first</Text>
      </View>
    );
  }

  const allMessages = [...PREDEFINED_MESSAGES, ...messages];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Messages</Text>
      <Text style={styles.subtitle}>Tap to send instantly</Text>

      <FlatList
        data={allMessages}
        keyExtractor={(item) => item.id?.toString() || `predefined-${item.content}`}
        renderItem={({item}) => {
          const isPredefined = PREDEFINED_MESSAGES.some((m) => m.id === item.id);
          return (
            <TouchableOpacity
              style={styles.messageItem}
              onPress={() => {
                if (isPredefined) {
                  handleSendPredefined(item.content);
                } else {
                  handleSendCustom(item.content);
                }
              }}
              disabled={sending}>
              <Text style={styles.messageText}>{item.content}</Text>
              {!isPredefined && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteButtonText}>×</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No custom messages yet</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowCreateModal(true)}
        disabled={messages.length >= 10}>
        <Text style={styles.addButtonText}>
          {messages.length >= 10 ? 'Max 10 messages' : '+ Add Custom Message'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Custom Message</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter message (max 50 chars)"
              value={newMessage}
              onChangeText={setNewMessage}
              maxLength={50}
              multiline
            />
            <Text style={styles.charCount}>{newMessage.length}/50</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreateModal(false);
                  setNewMessage('');
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateMessage}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e91e63',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  messageItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  deleteButtonText: {
    color: '#ff0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#e91e63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#e91e63',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notPairedText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default QuickMessageScreen;

