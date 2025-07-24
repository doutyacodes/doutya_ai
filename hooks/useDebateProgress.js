// /hooks/useDebateProgress.js - Custom hook for managing debate progress
import { useState, useEffect } from 'react';

export const useDebateProgress = (debateTopicId) => {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (debateTopicId) {
      fetchAllProgress();
    }
  }, [debateTopicId]);

  const fetchAllProgress = async () => {
    try {
     const token = localStorage.getItem('user_token');
      const types = ['ai_conversation', 'decision_tree', 'user_debate'];
      
      const progressPromises = types.map(async (type) => {
        const response = await fetch(`/api/debates/progress/${debateTopicId}/${type}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          return { type, progress: data.progress };
        }
        return { type, progress: null };
      });

      const results = await Promise.all(progressPromises);
      const progressMap = {};
      results.forEach(({ type, progress }) => {
        progressMap[type] = progress;
      });
      
      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (debateType, progressData) => {
    try {
     const token = localStorage.getItem('user_token');
      await fetch('/api/debates/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          debateTopicId,
          debateType,
          progress: progressData
        })
      });
      
      // Refresh progress after update
      await fetchAllProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return {
    progress,
    loading,
    updateProgress,
    refreshProgress: fetchAllProgress
  };
};