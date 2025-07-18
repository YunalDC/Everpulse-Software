import { FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { database } from '../firebaseConfig';

const BRANDS = [
  'All Brands', 'Genebre', 'Onka', 'Schneider', 'Selec', 'Telemecanique',
  'Trumen', 'PILZ', 'HPC', 'DKM', 'Electric Perry', 'Golink',
  'Mennekes', 'Hensel', 'Hanyoung Nux', 'Baumer', 'Emas'
];

export default function BrandSearchScreen() {
  const [brand, setBrand] = useState('All Brands');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const navigation = useNavigation();

  const fetchAllProducts = async () => {
    try {
      const promises = BRANDS.filter(b => b !== 'All Brands').map(async (b) => {
        const brandRef = ref(database, `/Products/${b}`);
        const snapshot = await get(brandRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          return Object.values(data);
        }
        return [];
      });
      const allData = await Promise.all(promises);
      const flat = allData.flat();
      setResults(flat);
    } catch (error) {
      console.error('Firebase read error:', error);
    }
  };

  const fetchBrandProducts = async (selectedBrand) => {
    try {
      const brandRef = ref(database, `/Products/${selectedBrand}`);
      const snapshot = await get(brandRef);
      if (snapshot.exists()) {
        setResults(Object.values(snapshot.val()));
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Firebase brand read error:", error);
    }
  };

  const handleSearch = async () => {
    if (brand === 'All Brands') {
      await fetchAllProducts();
    } else {
      await fetchBrandProducts(brand);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [brand]);

  const filteredResults = results.filter(item => {
    const combined = `${item.Name || ''} ${item["Part Number"] || ''} ${item.Description || ''}`.toLowerCase();
    return combined.includes(query.toLowerCase());
  });

  const toggleSelection = (item) => {
    const exists = selectedItems.find(p => p["Part Number"] === item["Part Number"]);
    if (exists) {
      setSelectedItems(prev => prev.filter(p => p["Part Number"] !== item["Part Number"]));
    } else {
      setSelectedItems(prev => [...prev, item]);
    }
  };

  const sendToWhatsApp = () => {
    if (selectedItems.length === 0) return;

    Alert.alert(
      "Confirm Send",
      "Are you sure you want to send this selection to Everbolt via WhatsApp?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send", onPress: () => {
            const message = selectedItems.map(p =>
              `🔹 *${p.Name || 'Unnamed'}*\n📦 Part No: ${p["Part Number"] || 'N/A'}\n📝 ${p.Description || 'No description'}`
            ).join("\n\n");

            const finalMessage = `🛡️ *EVERBOLT PRODUCT SELECTION*\n(For exclusive use only - not to be shared externally)\n\n${message}`;

            const url = `https://wa.me/94766431100?text=${encodeURIComponent(finalMessage)}`;
            Linking.openURL(url);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Top Navigation Buttons */}
      <View style={{
        position: 'absolute',
        top: 40,
        left: 16,
        right: 16,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        {/* Back Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 10,
            padding: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#1a1a1a" />
        </TouchableOpacity>

        {/* Sidebar Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 10,
            padding: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
          onPress={() => navigation.openDrawer()}
        >
          <FontAwesome5 name="bars" size={18} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      {/* Spacer to push content below navigation buttons */}
      <View style={{ height: 100 }} />

      <View style={styles.content}>
        <Text style={styles.heading}>Search by Brand</Text>

        <Picker
          selectedValue={brand}
          onValueChange={(value) => setBrand(value)}
          style={styles.picker}
        >
          {BRANDS.map(b => (
            <Picker.Item key={b} label={b} value={b} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Search full name, part number or description..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          placeholderTextColor="#777"
        />

        <FlatList
          data={filteredResults}
          keyExtractor={(item, index) => item["Part Number"] || index.toString()}
          renderItem={({ item }) => {
            const isSelected = selectedItems.some(p => p["Part Number"] === item["Part Number"]);
            return (
              <TouchableOpacity
                onPress={() => toggleSelection(item)}
                style={[styles.card, isSelected && { borderColor: '#2563EB', borderWidth: 2 }]}
              >
                <Text style={styles.title}>{item.Name || 'Unnamed Product'}</Text>
                <Text style={styles.desc}>{item.Description || 'No description available.'}</Text>
                <Text style={styles.sub}>{item["Part Number"] || 'No Part Number'}</Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={<Text style={styles.noResults}>No results found.</Text>}
        />
      </View>

      {selectedItems.length > 0 && (
        <TouchableOpacity style={styles.sendButton} onPress={sendToWhatsApp}>
          <Text style={styles.sendText}>Send {selectedItems.length} to WhatsApp</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    alignContent:'center',
  },
  picker: {
    backgroundColor: '#4CAF50',
    color: '#000000',
    marginBottom: 12,
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    color: '#000',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a1a1a',
  },
  desc: {
    color: '#333',
    marginTop: 4,
  },
  sub: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  noResults: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  sendButton: {
    backgroundColor: '#25D366',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  sendText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
