import { WebsiteData } from '../types';

export const extractWebsiteData = async (url: string): Promise<WebsiteData | null> => {
  try {
    // Validate URL
    if (!url || !isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    // Normalize URL (add https:// if missing)
    const normalizedUrl = normalizeUrl(url);
    console.log('🔍 Extracting data from:', normalizedUrl);
    if (url !== normalizedUrl) {
      console.log('📝 URL normalized from:', url, 'to:', normalizedUrl);
    }

    // Use Microlink API for website metadata extraction
    const microlinkUrl = `https://api.microlink.io/data?url=${encodeURIComponent(normalizedUrl)}`;
    console.log('📡 Microlink API URL:', microlinkUrl);
    
    const response = await fetch(microlinkUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website data: ${response.status}`);
    }

    const data = await response.json();
    console.log('📊 Raw Microlink API response:', data);
    
    if (!data.data) {
      throw new Error('No data received from website');
    }

    // Extract relevant information
    const extractedData: WebsiteData = {
      title: data.data.title || '',
      description: data.data.description || '',
      image: data.data.image?.url || '',
      author: data.data.author || '',
      publisher: data.data.publisher || '',
      date: data.data.date || '',
      lang: data.data.lang || '',
      logo: data.data.logo?.url || '',
      url: data.data.url || normalizedUrl
    };

    // Try to fetch full page plain text using Jina Reader (cross-origin friendly)
    try {
      const jinaUrl = `https://r.jina.ai/${normalizedUrl}`;
      console.log('📰 Jina Reader URL:', jinaUrl);
      const textResponse = await fetch(jinaUrl);
      if (textResponse.ok) {
        const text = await textResponse.text();
        if (text && text.trim()) {
          extractedData.contentText = text.trim();
        }
      } else {
        console.warn('Jina Reader fetch failed:', textResponse.status);
      }
    } catch (e) {
      console.warn('Jina Reader error:', e);
    }

    console.log('✨ Processed website data:', extractedData);
    return extractedData;
  } catch (error) {
    console.error('❌ Website extraction error:', error);
    return null;
  }
};

/**
 * Normalizes a URL by adding https:// if no protocol is present
 * Handles cases like: moondeskmedia.com, www.moondeskmedia.com
 */
export const normalizeUrl = (url: string): string => {
  if (!url || !url.trim()) {
    return url;
  }

  const trimmed = url.trim();

  // If it already has http:// or https://, return as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // Add https:// if no protocol is present
  return `https://${trimmed}`;
};

/**
 * Validates if a string is a valid URL (with or without protocol)
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || !url.trim()) {
    return false;
  }

  try {
    // Try with the URL as-is
    new URL(url);
    return true;
  } catch {
    // If that fails, try with https:// prefix
    try {
      new URL(normalizeUrl(url));
      return true;
    } catch {
      return false;
    }
  }
};

export const formatWebsiteDataForAI = (websiteData: WebsiteData): string => {
  if (!websiteData) return '';

  const sections = [];
  
  if (websiteData.title) {
    sections.push(`Website Title: ${websiteData.title}`);
  }
  
  if (websiteData.description) {
    sections.push(`Website Description: ${websiteData.description}`);
  }
  
  if (websiteData.publisher) {
    sections.push(`Publisher/Brand: ${websiteData.publisher}`);
  }
  
  if (websiteData.author) {
    sections.push(`Author: ${websiteData.author}`);
  }
  
  if (websiteData.lang) {
    sections.push(`Language: ${websiteData.lang}`);
  }

  if (websiteData.contentText) {
    // Cap the text to avoid overwhelming the prompt
    const MAX_CHARS = 2000;
    const excerpt = websiteData.contentText.length > MAX_CHARS
      ? `${websiteData.contentText.slice(0, MAX_CHARS)}…`
      : websiteData.contentText;
    sections.push(`Website Text Excerpt:\n${excerpt}`);
  }

  return sections.length > 0 
    ? `\n\nExtracted Website Data:\n${sections.join('\n')}`
    : '';
};
