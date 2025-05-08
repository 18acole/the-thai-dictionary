import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  message: string;
}

// In-memory storage for word requests (since we're not using Sanity for now)
const wordRequests: Array<{
  word: string;
  language: string;
  requestedAt: string;
}> = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { word, language } = req.body;

    if (!word || !language) {
      return res.status(400).json({ 
        success: false, 
        message: 'Word and language are required' 
      });
    }

    // Store the request in memory (would be Sanity in production)
    wordRequests.push({
      word,
      language,
      requestedAt: new Date().toISOString(),
    });

    console.log('Word request received:', { word, language });

    return res.status(200).json({ 
      success: true, 
      message: 'Word request submitted successfully!' 
    });
  } catch (error) {
    console.error('Error submitting word request:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error submitting request. Please try again.' 
    });
  }
}
