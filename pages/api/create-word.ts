import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import { sanityConfig } from '../../lib/sanity';

type Data = {
  success: boolean;
  message: string;
  wordId?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // Check if we have a token
  if (!sanityConfig.token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No Sanity token provided. Cannot create content.' 
    });
  }

  try {
    const { english, chinese, thai, romanized, pinyin, audioUrl } = req.body;

    // Validate required fields
    if (!english || !chinese || !thai) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields (english, chinese, thai)' 
      });
    }

    // Create Sanity client with token
    const client = createClient({
      ...sanityConfig,
      useCdn: false, // Use fresh data for mutations
    });

    // Create the document
    const result = await client.create({
      _type: 'word',
      english,
      chinese,
      thai,
      romanized: romanized || '',
      pinyin: pinyin || '',
      audioUrl: audioUrl || '',
    });

    res.status(200).json({ 
      success: true, 
      message: 'Word created successfully', 
      wordId: result._id 
    });
  } catch (error) {
    console.error('Error in create-word API:', error);
    res.status(500).json({ 
      success: false, 
      message: (error as Error).message || 'Failed to create word' 
    });
  }
}