import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@sanity/client';
import { sanityConfig } from '../../lib/sanity';

type Data = {
  success: boolean;
  message: string;
}

// Create a write client with token
const writeClient = createClient({
  ...sanityConfig,
  token: process.env.SANITY_TOKEN,
});

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

    // Log the request
    console.log('Word request received:', { word, language });

    try {
      // Try to store in Sanity if we have a token
      if (process.env.SANITY_TOKEN) {
        // Create a document in Sanity
        await writeClient.create({
          _type: 'wordRequest',
          word,
          language,
          requestedAt: new Date().toISOString(),
          status: 'pending'
        });
        
        console.log('Word request saved to Sanity');
      } else {
        console.warn('No Sanity token available, request logged but not saved to Sanity');
      }
    } catch (sanityError) {
      console.error('Error saving to Sanity:', sanityError);
      // We don't want to fail the request if Sanity save fails
      // Just log the error and continue
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Word request submitted successfully! Our team will review it.' 
    });
  } catch (error) {
    console.error('Error submitting word request:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error submitting request. Please try again.' 
    });
  }
}
