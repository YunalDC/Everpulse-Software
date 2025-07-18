import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function PromotionDetailModal({ visible, onClose, promotion }) {
  const [imageError, setImageError] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  if (!promotion) return null;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
      
      if (diffDays < 0) return { text: 'Expired', color: '#EF4444' };
      if (diffDays === 0) return { text: 'Expires today', color: '#F59E0B' };
      if (diffDays === 1) return { text: 'Expires tomorrow', color: '#F59E0B' };
      if (diffDays < 7) return { text: `${diffDays} days left`, color: '#10B981' };
      
      return { 
        text: `Valid until ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, 
        color: '#10B981' 
      };
    } catch (err) {
      return { text: '', color: '#64748B' };
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

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${promotion.title}\n\n${promotion.description}\n\nValid until: ${formatDate(promotion.valid_until)}`,
        title: promotion.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically save to your backend or local storage
  };

  const handleClaim = () => {
    Alert.alert(
      'Claim Promotion',
      'Are you sure you want to claim this promotion?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Claim', 
          onPress: () => {
            // Handle promotion claim logic here
            Alert.alert('Success', 'Promotion claimed successfully!');
          }
        }
      ]
    );
  };

  const isExpired = new Date(promotion.valid_until) < new Date();
  const validityInfo = formatValidUntil(promotion.valid_until);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor="#0F172A" barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <FontAwesome5 name="times" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
              <FontAwesome5 
                name={isFavorited ? "heart" : "heart"} 
                size={20} 
                color={isFavorited ? "#EF4444" : "#FFFFFF"}
                solid={isFavorited}
              />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
              <FontAwesome5 name="share-alt" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Hero Image */}
          <View style={styles.heroImageContainer}>
            {promotion.image_url && !imageError ? (
              <Image 
                source={{ uri: promotion.image_url }} 
                style={styles.heroImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={[styles.placeholderHero, { backgroundColor: getColor(promotion.type) }]}>
                <FontAwesome5 name={getIcon(promotion.type)} size={64} color="#FFFFFF" />
              </View>
            )}
            
            {/* Gradient overlay */}
            <View style={styles.gradientOverlay} />
            
            {/* Type badge */}
            <View style={styles.typeBadgeOverlay}>
              <View style={[styles.typeBadge, { backgroundColor: getColor(promotion.type) }]}>
                <FontAwesome5 name={getIcon(promotion.type)} size={14} color="#FFFFFF" />
                <Text style={styles.typeBadgeText}>{promotion.type.replace('_', ' ')}</Text>
              </View>
            </View>

            {/* Discount badge */}
            {promotion.discount_percentage && (
              <View style={styles.discountBadgeOverlay}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{promotion.discount_percentage}% OFF</Text>
                </View>
              </View>
            )}

            {/* Expired overlay */}
            {isExpired && (
              <View style={styles.expiredOverlay}>
                <Text style={styles.expiredText}>EXPIRED</Text>
              </View>
            )}
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Validity info */}
            <View style={styles.validityContainer}>
              <FontAwesome5 name="clock" size={16} color={validityInfo.color} />
              <Text style={[styles.validityText, { color: validityInfo.color }]}>
                {validityInfo.text}
              </Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{promotion.title}</Text>

            {/* Description */}
            <Text style={styles.description}>{promotion.description}</Text>

            {/* Promotion Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Promotion Details</Text>
              
              <View style={styles.detailRow}>
                <FontAwesome5 name="calendar-alt" size={16} color="#64748B" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Valid From</Text>
                  <Text style={styles.detailValue}>{formatDate(promotion.created_at)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome5 name="calendar-times" size={16} color="#64748B" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Valid Until</Text>
                  <Text style={styles.detailValue}>{formatDate(promotion.valid_until)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <FontAwesome5 name="tag" size={16} color="#64748B" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Promotion Type</Text>
                  <Text style={styles.detailValue}>{promotion.type.replace('_', ' ').toUpperCase()}</Text>
                </View>
              </View>

              {promotion.discount_percentage && (
                <View style={styles.detailRow}>
                  <FontAwesome5 name="percentage" size={16} color="#64748B" />
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Discount</Text>
                    <Text style={styles.detailValue}>{promotion.discount_percentage}% OFF</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
              <Text style={styles.termsText}>
                • This promotion is valid only for the specified period{'\n'}
                • Cannot be combined with other offers{'\n'}
                • One promotion per customer{'\n'}
                • Subject to availability{'\n'}
                • Management reserves the right to modify terms
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: StatusBar.currentHeight + 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
  heroImageContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderHero: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  },
  typeBadgeOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  discountBadgeOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  discountBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    transform: [{ rotate: '-15deg' }],
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  validityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    marginBottom: 32,
  },
  detailsContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 2,
  },
  termsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 'auto',
  },
  claimButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  claimButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  expiredButton: {
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  expiredButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },
});