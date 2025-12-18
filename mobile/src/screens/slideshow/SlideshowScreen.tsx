import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {launchImageLibrary, ImagePickerResponse} from '@react-native-community/image-picker';
import {useSlideshowStore} from '../../store/slideshowStore';
import {useCoupleStore} from '../../store/coupleStore';

const SlideshowScreen = () => {
  const {status} = useCoupleStore();
  const {images, isLoading, fetchImages, uploadImage, reorderImages, deleteImage} =
    useSlideshowStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  useEffect(() => {
    if (status?.isPaired) {
      fetchImages();
      startSlideshow();
    }
  }, [status?.isPaired]);

  useEffect(() => {
    if (images.length > 0) {
      startSlideshow();
    }
  }, [images.length]);

  const startSlideshow = () => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  };

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      async (response: ImagePickerResponse) => {
        if (response.assets && response.assets[0]) {
          try {
            await uploadImage(response.assets[0].uri!);
            Alert.alert('Success', 'Image uploaded successfully');
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to upload image');
          }
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete Image', 'Are you sure?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteImage(id);
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to delete image');
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

  if (images.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No photos yet</Text>
        <TouchableOpacity style={styles.addButton} onPress={handlePickImage}>
          <Text style={styles.addButtonText}>Add First Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.imageItem}
      onPress={() => {
        const index = images.findIndex((img) => img.id === item.id);
        setCurrentIndex(index);
        setShowFullscreen(true);
      }}>
      <Image source={{uri: item.imageUrl}} style={styles.thumbnail} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.slideshowContainer}>
        <Image
          source={{uri: images[currentIndex]?.imageUrl}}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePickImage}>
          <Text style={styles.buttonText}>Add Photo</Text>
        </TouchableOpacity>

        <Text style={styles.reorderHint}>Tap image to view fullscreen</Text>

        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Modal visible={showFullscreen} transparent>
        <View style={styles.fullscreenContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFullscreen(false)}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Image
            source={{uri: images[currentIndex]?.imageUrl}}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  slideshowContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    backgroundColor: '#fff',
    padding: 15,
    maxHeight: 200,
  },
  button: {
    backgroundColor: '#e91e63',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reorderHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageItem: {
    marginRight: 10,
    position: 'relative',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  notPairedText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#e91e63',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SlideshowScreen;

