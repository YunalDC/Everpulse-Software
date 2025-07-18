// Enhanced PromotionsScreen with PromotionDetailModal integration
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PromotionDetailModal from '../components/PromotionDetailModal';

const { width } = Dimensions.get('window');
const API_URL = 'http://192.168.1.16:8080/api/promotions/';

export default function PromotionsScreen({ navigation }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchPromotions = async () => {
    try {
      const response = await axios.get(API_URL);
      setPromotions(response.data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPromotions();
  };

  const handlePromotionPress = (promotion) => {
    setSelectedPromotion(promotion);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedPromotion(null);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const formatValidUntil = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) return 'Expired';
      if (diffDays === 0) return 'Expires today';
      if (diffDays === 1) return 'Expires tomorrow';
      if (diffDays < 7) return `${diffDays} days left`;
      return `Valid until ${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`;
    } catch (err) {
      return '';
    }
  };

  const getIcon = (type) => {
    const icons = {
      discount: 'percentage',
      flash_sale: 'bolt',
      new_product: 'star',
      seasonal: 'gift',
      default: 'tag'
    };
    return icons[type] || icons.default;
  };

  const getColor = (type) => {
    const colors = {
      discount: '#EF4444',
      flash_sale: '#F59E0B',
      new_product: '#8B5CF6',
      seasonal: '#10B981',
      default: '#6B7280'
    };
    return colors[type] || colors.default;
  };

  const renderItem = ({ item }) => {
    const isExpired = new Date(item.valid_until) < new Date();
    const isFeatured = item.featured; // Assuming there's a featured field
    
    return (
      <TouchableOpacity
        style={[
          styles.promotionCard,
          isFeatured && styles.featuredCard,
          isExpired && styles.expiredCard
        ]}
        onPress={() => handlePromotionPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.promotionImageContainer}>
          {item.image_url ? (
            <Image source={{ uri: item.image_url }} style={styles.promotionImage} />
          ) : (
            <View style={[styles.placeholderImage, { backgroundColor: getColor(item.type) + '20' }]}>
              <FontAwesome5 name={getIcon(item.type)} size={40} color={getColor(item.type)} />
            </View>
          )}
          
          <View style={[styles.typeBadge, { backgroundColor: getColor(item.type) }]}>
            <FontAwesome5 name={getIcon(item.type)} size={12} color="#FFF" />
            <Text style={styles.typeBadgeText}>{item.type.replace('_', ' ')}</Text>
          </View>
          
          {item.discount_percentage && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{item.discount_percentage}% OFF</Text>
            </View>
          )}
          
          {isExpired && (
            <View style={styles.expiredOverlay}>
              <Text style={styles.expiredText}>EXPIRED</Text>
            </View>
          )}

          {isFeatured && (
            <View style={styles.featuredBadge}>
              <FontAwesome5 name="star" size={10} color="#FFFFFF" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        
        <View style={styles.promotionContent}>
          <Text style={styles.promotionTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.promotionDescription} numberOfLines={3}>
            {item.description}
          </Text>
          
          <View style={styles.promotionFooter}>
            <View style={styles.validityContainer}>
              <FontAwesome5 name="clock" size={12} color="#64748B" />
              <Text style={styles.validityText}>{formatValidUntil(item.valid_until)}</Text>
            </View>
            
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>View Details</Text>
              <FontAwesome5 name="chevron-right" size={12} color="#10B981" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome5 name="tags" size={32} color="#64748B" />
      </View>
      <Text style={styles.emptyTitle}>No Promotions Available</Text>
      <Text style={styles.emptySubtitle}>
        Check back later for exciting offers and promotions
      </Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <FontAwesome5 name="refresh" size={14} color="#FFFFFF" />
        <Text style={styles.refreshButtonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>Available Promotions</Text>
      <Text style={styles.listHeaderSubtitle}>
        Tap on any promotion to view details and claim your offer
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading promotions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="arrow-left" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Promotions</Text>
          <Text style={styles.headerSubtitle}>
            {promotions.length} {promotions.length === 1 ? 'offer' : 'offers'} available
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <FontAwesome5 name="refresh" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={promotions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={promotions.length > 0 ? renderHeader : null}
        contentContainerStyle={promotions.length === 0 ? styles.container : styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
        showsVerticalScrollIndicator={false}
        bounces={true}
      />

      {/* Promotion Detail Modal */}
      <PromotionDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        promotion={selectedPromotion}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#E2E8F0',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: StatusBar.currentHeight + 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listHeader: {
    paddingVertical: 20,
    paddingBottom: 16,
  },
  listHeaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  listHeaderSubtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  separator: {
    height: 16,
  },
  promotionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
    transform: [{ scale: 1 }],
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#10B981',
    shadowColor: '#10B981',
    shadowOpacity: 0.2,
  },
  expiredCard: {
    opacity: 0.7,
  },
  promotionImageContainer: {
    position: 'relative',
    height: 200,
  },
  promotionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    transform: [{ rotate: '-15deg' }],
  },
  promotionContent: {
    padding: 20,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 24,
    marginBottom: 8,
  },
  promotionDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  promotionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  validityText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F1F5F9',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});