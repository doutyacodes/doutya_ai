// /components/debates/index.js - Export file for easy imports
export { default as DebateHub } from './DebateHub';
export { default as AIConversationChat } from './AIConversationChat';
export { default as DecisionTreeChat } from './DecisionTreeChat';
export { default as UserDebateChat } from './UserDebateChat';

// Usage example in your existing news/debate creation flow:
// After creating a debate topic, you can link to it like this:
// /debates/[newsGroupId]/[debateTopicId]

// Example: Integration with existing news admin panel
// In your AddNews.jsx or similar component, after successfully creating news with debates:

const handleDebateCreated = (newsGroupId, debateTopicId) => {
  // Show success message with link to debate
  toast.success(
    <div>
      <p>Debate created successfully!</p>
      <Button 
        size="sm" 
        className="mt-2"
        onClick={() => window.open(`/debates/${newsGroupId}/${debateTopicId}`, '_blank')}
      >
        View Debate Hub
      </Button>
    </div>,
    { duration: 5000 }
  );
};
