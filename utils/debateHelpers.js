// /utils/debateHelpers.js
export const debateHelpers = {
  // Check if user can access elite features
  canAccessEliteFeatures: (userPlan) => {
    return userPlan?.current_plan === 'elite';
  },

  // Format debate completion time
  formatDebateTime: (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  },

  // Calculate debate difficulty based on topic and user performance
  calculateDifficulty: (topic, userHistory = []) => {
    const baseComplexity = topic.description?.length || 100;
    const userSuccessRate = userHistory.length > 0 
      ? userHistory.filter(h => h.score > 70).length / userHistory.length 
      : 0.5;
    
    if (baseComplexity > 500 && userSuccessRate < 0.6) return 'Advanced';
    if (baseComplexity > 300 || userSuccessRate < 0.4) return 'Intermediate';
    return 'Beginner';
  },

  // Generate debate sharing URL
  generateShareableLink: (newsGroupId, debateTopicId) => {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://yourapp.com';
    return `${baseUrl}/debates/${newsGroupId}/${debateTopicId}`;
  },

  // Get debate type icon and color
  getDebateTypeDisplay: (type) => {
    const displays = {
      ai_conversation: {
        icon: 'Bot',
        color: 'blue',
        name: 'AI vs AI Debate'
      },
      decision_tree: {
        icon: 'TreePine',
        color: 'purple', 
        name: 'Decision Tree'
      },
      user_debate: {
        icon: 'Users',
        color: 'amber',
        name: 'Personal Challenge'
      }
    };
    return displays[type] || displays.ai_conversation;
  }
};