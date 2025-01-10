import Cookies from 'js-cookie';

export const trackAction = async (action_type, article_id) => {
  const visitor_uuid = Cookies.get('visitor_uuid'); // Get visitor UUID from cookies
  const payload = {
    visitor_uuid,
    action_type, // 'share' or 'copy_link'
    article_id, // Article ID to track
  };

  try {
    // Send API request
    const response = await fetch('/api/track-action', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log(`Successfully tracked ${action_type}`);
    } else {
      console.error(`Failed to track ${action_type}`, await response.text());
    }
  } catch (error) {
    console.error('Error while tracking action:', error);
  }
};
