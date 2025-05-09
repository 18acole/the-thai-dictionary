import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient, sanityConfig } from '../../lib/sanity';

type ResponseData = {
  config: any;
  words?: any[];
  error?: string;
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Fetch data from Sanity
    const words = await sanityClient.fetch();
    
    // Remove token from response for security
    const configToReturn = {
      ...sanityConfig,
      token: sanityConfig.token ? '[REDACTED]' : undefined,
    };
    
    // Check if we're using real data or fallback data
    const usingFallbackData = words && words[0] && words[0]._id === '1';
    
    res.status(200).json({
      message: usingFallbackData 
        ? 'Sanity connection succeeded but using fallback data (no Sanity content found)' 
        : 'Sanity connection successful with real data',
      config: configToReturn,
      words: words.slice(0, 3), // Only return first 3 words for brevity
    });
  } catch (error) {
    console.error('Error in check-sanity API:', error);
    res.status(500).json({
      message: 'Error connecting to Sanity',
      config: { ...sanityConfig, token: sanityConfig.token ? '[REDACTED]' : undefined },
      error: (error as Error).message,
    });
  }
}