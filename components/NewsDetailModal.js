import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    ScrollView,
    Share,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function NewsDetailModal({ visible, onClose, newsItem }) {
  const [imageError, setImageError] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!newsItem) return null;

  const formatDate = (createdAt) => {
    try {
      const date = new Date(createdAt);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (err) {
      return 'Unknown date';
    }
  };

  const formatTime = (createdAt) => {
    try {
      const date = new Date(createdAt);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return '';
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${newsItem.title}\n\n${newsItem.content}`,
        title: newsItem.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically save to your backend or local storage
  };

  const estimateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.split(' ').length || 0;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes < 1 ? '1 min read' : `${minutes} min read`;
  };

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
            <TouchableOpacity style={styles.headerButton} onPress={toggleBookmark}>
              <FontAwesome5 
                name={isBookmarked ? "bookmark" : "bookmark"} 
                size={20} 
                color={isBookmarked ? "#10B981" : "#FFFFFF"}
                solid={isBookmarked}
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
            {newsItem.image && !imageError ? (
              <Image 
                source={{ uri: newsItem.image }} 
                style={styles.heroImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.placeholderHero}>
                <FontAwesome5 name="newspaper" size={48} color="#64748B" />
              </View>
            )}
            
            {/* Gradient overlay */}
            <View style={styles.gradientOverlay} />
            
            {/* Category badge */}
            <View style={styles.categoryOverlay}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>Company News</Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View style={styles.contentContainer}>
            {/* Article meta */}
            <View style={styles.articleMeta}>
              <View style={styles.dateContainer}>
                <FontAwesome5 name="calendar-alt" size={14} color="#64748B" />
                <Text style={styles.dateText}>{formatDate(newsItem.created_at)}</Text>
              </View>
              
              <View style={styles.timeContainer}>
                <FontAwesome5 name="clock" size={14} color="#64748B" />
                <Text style={styles.timeText}>{formatTime(newsItem.created_at)}</Text>
              </View>
              
              <View style={styles.readTimeContainer}>
                <FontAwesome5 name="eye" size={14} color="#64748B" />
                <Text style={styles.readTimeText}>{estimateReadTime(newsItem.content)}</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>{newsItem.title}</Text>

            {/* Author info */}
            <View style={styles.authorContainer}>
              <View style={styles.authorAvatar}>
                <FontAwesome5 name="user" size={16} color="#64748B" />
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>Company News Team</Text>
                <Text style={styles.authorTitle}>Editorial Staff</Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentWrapper}>
              <Text style={styles.content}>{newsItem.content}</Text>
            </View>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              <Text style={styles.tagsTitle}>Tags:</Text>
              <View style={styles.tagsWrapper}>
                <TouchableOpacity style={styles.tag}>
                  <Text style={styles.tagText}>News</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tag}>
                  <Text style={styles.tagText}>Updates</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tag}>
                  <Text style={styles.tagText}>Company</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action buttons */}
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome5 name="thumbs-up" size={20} color="#10B981" />
                <Text style={styles.actionText}>Like</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome5 name="comment" size={20} color="#64748B" />
                <Text style={styles.actionText}>Comment</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <FontAwesome5 name="share" size={20} color="#64748B" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
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
    height: 280,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderHero: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  timeText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  readTimeText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 36,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  authorTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  contentWrapper: {
    marginBottom: 32,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#374151',
    textAlign: 'left',
  },
  tagsContainer: {
    marginBottom: 32,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  actionText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});