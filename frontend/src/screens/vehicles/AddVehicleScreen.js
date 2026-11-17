import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createVehicleApi } from '../../api/vehicleApi';
import Input from '../../components/Input';
import Button from '../../components/Button';

const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Motorbike'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

const AddVehicleScreen = ({ navigation }) => {
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sedan');
  const [plateNumber, setPlateNumber] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('5');
  const [fuelType, setFuelType] = useState('Petrol');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission Denied', 'Permission to access gallery is required!');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        if (errors.image) setErrors({ ...errors, image: null });
      }
    } catch (err) {
      if (Platform.OS === 'web') {
        window.alert('Failed to pick image: ' + err.message);
      } else {
        Alert.alert('Error', 'Failed to pick image: ' + err.message);
      }
    }
  };

  const validate = () => {
    let errs = {};
    if (!model.trim()) errs.model = 'Vehicle model is required';
    if (!plateNumber.trim()) errs.plateNumber = 'Plate number is required';
    if (!dailyRate.trim() || isNaN(dailyRate) || Number(dailyRate) <= 0) {
      errs.dailyRate = 'Please enter a valid daily rate';
    }
    if (!seatingCapacity.trim() || isNaN(seatingCapacity) || Number(seatingCapacity) <= 0) {
      errs.seatingCapacity = 'Enter valid seating capacity';
    }
    if (!imageUri) {
      errs.image = 'Vehicle photo upload is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setGeneralError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('model', model.trim());
      formData.append('category', category);
      formData.append('plateNumber', plateNumber.trim().toUpperCase());
      formData.append('dailyRate', dailyRate.trim());
      formData.append('seatingCapacity', seatingCapacity.trim());
      formData.append('fuelType', fuelType);
      formData.append('description', description.trim());

      // Prepare filename and MIME type
      let filename = imageUri.split('/').pop() || 'vehicle.jpg';
      if (!filename.includes('.')) {
        filename += '.jpg';
      }
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      if (Platform.OS === 'web') {
        // On web, convert image URI to a real Blob before appending
        const imageResponse = await fetch(imageUri);
        const blob = await imageResponse.blob();
        formData.append('image', blob, filename);
      } else {
        // On native (Android / iOS), React Native networking expects { uri, name, type }
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type: type,
        });
      }

      await createVehicleApi(formData);

      const onDone = () => {
        setModel('');
        setPlateNumber('');
        setDailyRate('');
        setDescription('');
        setImageUri(null);
        navigation.navigate('VehiclesTab');
      };

      if (Platform.OS === 'web') {
        window.alert('Vehicle Added! 🚗 The vehicle is now active in your fleet catalog.');
        onDone();
      } else {
        Alert.alert('Vehicle Added! 🚗', 'The vehicle is now active in your fleet catalog.', [
          {
            text: 'View Fleet',
            onPress: onDone,
          },
        ]);
      }
    } catch (err) {
      setGeneralError(err.message || 'Failed to add vehicle to fleet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Add New Vehicle to Fleet</Text>
      <Text style={styles.subtitle}>Upload image and set vehicle specifications</Text>

      {generalError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{generalError}</Text>
        </View>
      ) : null}

      {/* Image Picker Box */}
      <TouchableOpacity
        style={[styles.imagePickerBox, errors.image && styles.imagePickerError]}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.cameraIcon}>📸</Text>
            <Text style={styles.pickerText}>Tap to Select Vehicle Photo</Text>
            <Text style={styles.pickerSubText}>JPG, PNG, WEBP (Max 5MB)</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.image ? <Text style={styles.errorText}>{errors.image}</Text> : null}

      <Input
        label="Model / Make"
        value={model}
        onChangeText={(t) => {
          setModel(t);
          if (errors.model) setErrors({ ...errors, model: null });
        }}
        placeholder="e.g. Toyota RAV4 2023"
        error={errors.model}
      />

      {/* Category Selection */}
      <Text style={styles.sectionLabel}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, category === cat && styles.chipActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Registration / Plate Number"
        value={plateNumber}
        onChangeText={(t) => {
          setPlateNumber(t);
          if (errors.plateNumber) setErrors({ ...errors, plateNumber: null });
        }}
        placeholder="e.g. CAB-4521"
        autoCapitalize="characters"
        error={errors.plateNumber}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input
            label="Daily Rate (LKR / Rs.)"
            value={dailyRate}
            onChangeText={(t) => {
              setDailyRate(t);
              if (errors.dailyRate) setErrors({ ...errors, dailyRate: null });
            }}
            placeholder="e.g. 8500"
            keyboardType="numeric"
            error={errors.dailyRate}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Input
            label="Seats"
            value={seatingCapacity}
            onChangeText={(t) => {
              setSeatingCapacity(t);
              if (errors.seatingCapacity) setErrors({ ...errors, seatingCapacity: null });
            }}
            placeholder="5"
            keyboardType="numeric"
            error={errors.seatingCapacity}
          />
        </View>
      </View>

      {/* Fuel Type Selection */}
      <Text style={styles.sectionLabel}>Fuel Type</Text>
      <View style={styles.chipRow}>
        {FUEL_TYPES.map((fuel) => (
          <TouchableOpacity
            key={fuel}
            style={[styles.chip, fuelType === fuel && styles.chipActive]}
            onPress={() => setFuelType(fuel)}
          >
            <Text style={[styles.chipText, fuelType === fuel && styles.chipTextActive]}>
              {fuel}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Description / Special Features"
        value={description}
        onChangeText={setDescription}
        placeholder="e.g. Automatic transmission, GPS, leather interior"
        multiline
        numberOfLines={3}
      />

      <Button
        title="Publish Vehicle to Fleet"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    marginTop: 2,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  imagePickerBox: {
    width: '100%',
    height: 180,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerError: {
    borderColor: '#EF4444',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderBox: {
    alignItems: 'center',
    padding: 16,
  },
  cameraIcon: {
    fontSize: 34,
    marginBottom: 6,
  },
  pickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  pickerSubText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
    marginTop: 10,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 8,
  },
  submitBtn: {
    marginTop: 16,
    marginBottom: 30,
  },
});

export default AddVehicleScreen;
