import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  success: boolean;
  message: string;
  oldTokenPrefix?: string;
  newTokenPrefix?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    // For security, we only show part of the tokens
    const oldToken = process.env.SANITY_TOKEN || '';
    const oldTokenPrefix = oldToken.substring(0, 10) + '...';
    
    // Update with the new token - this is for demonstration only in this specific situation
    // where we're troubleshooting a token issue and want to update it manually
    // Normally you'd never hardcode tokens like this
    process.env.SANITY_TOKEN = 'skop3Jgt4T0gBK02o6pzRcXWaooRIgCFvZQBvYsSw9OstWkqLH7XaNPkGvjLwPVXzfiGMe6oFP1q0xO0SVYMnaGL33dpS7BWwZRlptpWMtZ7gTHCBNThlDcADFDKK7piAsuBcsPJgzNJYbLj5E9P2tW7NkfRy9gvc45NYQROGHFGFQn8w3eI';
    
    const newToken = process.env.SANITY_TOKEN;
    const newTokenPrefix = newToken.substring(0, 10) + '...';
    
    res.status(200).json({ 
      success: true, 
      message: 'Token updated successfully',
      oldTokenPrefix,
      newTokenPrefix
    });
  } catch (error) {
    console.error('Error updating token:', error);
    res.status(500).json({ 
      success: false, 
      message: (error as Error).message || 'Failed to update token' 
    });
  }
}