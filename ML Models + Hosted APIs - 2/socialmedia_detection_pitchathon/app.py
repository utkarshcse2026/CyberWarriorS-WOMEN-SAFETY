from flask import Flask, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import tweepy
import requests
from instagram_private_api import Client, ClientCompatPatch
import numpy as np
from PIL import Image
import io
import nltk
from nltk.tokenize import word_tokenize
from transformers import pipeline
from nudenet import NudeDetector
import logging
from datetime import datetime
import concurrent.futures
from better_profanity import profanity
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Setup rate limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize global variables
try:
    nltk.download('punkt', quiet=True)
    sentiment_analyzer = pipeline("sentiment-analysis")
    nude_detector = NudeDetector()
    profanity.load_censor_words()
    
    # Twitter API setup
    twitter_auth = tweepy.OAuthHandler(
        os.getenv('TWITTER_API_KEY'),
        os.getenv('TWITTER_API_SECRET')
    )
    twitter_auth.set_access_token(
        os.getenv('TWITTER_ACCESS_TOKEN'),
        os.getenv('TWITTER_ACCESS_TOKEN_SECRET')
    )
    twitter_api = tweepy.API(twitter_auth)
    
    # Instagram API setup
    instagram_api = Client(
        os.getenv('INSTAGRAM_USERNAME'),
        os.getenv('INSTAGRAM_PASSWORD')
    )
    
    logger.info("All APIs and models initialized successfully")
except Exception as e:
    logger.error(f"Error initializing resources: {str(e)}")
    raise

class ContentAnalyzer:
    def __init__(self):
        self.twitter_api = twitter_api
        self.instagram_api = instagram_api

    def fetch_social_media_content(self, url):
        platform = self._detect_platform(url)
        username = self._extract_username(url)
        
        if platform == "Twitter":
            return self._fetch_twitter_content(username)
        elif platform == "Instagram":
            return self._fetch_instagram_content(username)
        else:
            raise ValueError(f"Unsupported platform: {platform}")

    def _fetch_twitter_content(self, username):
        try:
            user = self.twitter_api.get_user(screen_name=username)
            tweets = self.twitter_api.user_timeline(
                screen_name=username,
                count=10,
                tweet_mode="extended",
                include_entities=True
            )
            
            texts = []
            image_urls = []
            
            for tweet in tweets:
                texts.append(tweet.full_text)
                
                # Extract media URLs
                if hasattr(tweet, 'extended_entities') and 'media' in tweet.extended_entities:
                    for media in tweet.extended_entities['media']:
                        if media['type'] == 'photo':
                            image_urls.append(media['media_url_https'])
            
            return {
                'texts': texts,
                'image_urls': image_urls,
                'metadata': {
                    'username': username,
                    'follower_count': user.followers_count,
                    'verified': user.verified
                }
            }
        except tweepy.TweepError as e:
            logger.error(f"Twitter API error: {str(e)}")
            raise

    def _fetch_instagram_content(self, username):
        try:
            user_id = self.instagram_api.username_info(username)['user']['pk']
            user_feed = self.instagram_api.user_feed(user_id)
            
            texts = []
            image_urls = []
            
            for item in user_feed['items'][:10]:  # Limit to 10 posts
                if 'caption' in item and item['caption'] is not None:
                    texts.append(item['caption']['text'])
                
                if 'image_versions2' in item:
                    image_urls.append(item['image_versions2']['candidates'][0]['url'])
            
            user_info = self.instagram_api.user_info(user_id)['user']
            
            return {
                'texts': texts,
                'image_urls': image_urls,
                'metadata': {
                    'username': username,
                    'follower_count': user_info['follower_count'],
                    'is_private': user_info['is_private']
                }
            }
        except Exception as e:
            logger.error(f"Instagram API error: {str(e)}")
            raise

    def _detect_platform(self, url):
        if 'twitter.com' in url or 'x.com' in url:
            return "Twitter"
        elif 'instagram.com' in url:
            return "Instagram"
        else:
            raise ValueError("Unsupported platform")

    def _extract_username(self, url):
        parts = url.rstrip('/').split('/')
        return parts[-1]

    def analyze_text(self, text):
        try:
            sentiment = sentiment_analyzer(text)[0]
            contains_profanity = profanity.contains_profanity(text)
            
            return {
                'text': text[:200] + '...' if len(text) > 200 else text,
                'sentiment': {
                    'label': sentiment['label'],
                    'score': round(sentiment['score'], 3)
                },
                'profanity': {
                    'contains_profanity': contains_profanity,
                    'censored_text': profanity.censor(text) if contains_profanity else None
                }
            }
        except Exception as e:
            logger.error(f"Error analyzing text: {str(e)}")
            return {'error': str(e)}

    def analyze_image(self, image_url):
        try:
            response = requests.get(image_url)
            img = Image.open(io.BytesIO(response.content))
            
            # NudeNet analysis
            nude_result = nude_detector.detect(np.array(img))
            
            unsafe_content = self._process_nudenet_result(nude_result)
            
            return {
                'image_url': image_url,
                'analysis': {
                    'unsafe_content': unsafe_content
                }
            }
        except Exception as e:
            logger.error(f"Error analyzing image {image_url}: {str(e)}")
            return {
                'image_url': image_url,
                'error': str(e)
            }

    def _process_nudenet_result(self, nude_result):
        if not nude_result:
            return {'is_unsafe': False}
        
        unsafe_categories = {}
        is_unsafe = False
        
        for detection in nude_result:
            class_name = detection['class']
            confidence = detection['score']
            
            if confidence > 0.5:
                is_unsafe = True
                unsafe_categories[class_name] = round(confidence, 3)
        
        return {
            'is_unsafe': is_unsafe,
            'details': unsafe_categories if is_unsafe else {}
        }

    def generate_report(self, url, content_data, text_analyses, image_analyses):
        try:
            platform = self._detect_platform(url)
            safe_texts = sum(1 for t in text_analyses if not t.get('profanity', {}).get('contains_profanity', False))
            safe_images = sum(1 for i in image_analyses if not i.get('analysis', {}).get('unsafe_content', {}).get('is_unsafe', False))
            
            return {
                'summary': {
                    'url': url,
                    'platform': platform,
                    'metadata': content_data['metadata'],
                    'safety_metrics': {
                        'safe_text_percentage': round(safe_texts / len(text_analyses) * 100 if text_analyses else 100, 1),
                        'safe_image_percentage': round(safe_images / len(image_analyses) * 100 if image_analyses else 100, 1)
                    }
                },
                'text_analysis': {
                    'total_texts': len(text_analyses),
                    'unsafe_texts': len(text_analyses) - safe_texts,
                    'analyses': text_analyses
                },
                'image_analysis': {
                    'total_images': len(image_analyses),
                    'unsafe_images': len(image_analyses) - safe_images,
                    'analyses': image_analyses
                }
            }
        except Exception as e:
            logger.error(f"Error generating report: {str(e)}")
            return {'error': str(e)}

content_analyzer = ContentAnalyzer()

@app.route('/analyze', methods=['POST'])
@limiter.limit("5 per minute")
def analyze_social_media():
    try:
        data = request.json
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400
        
        url = data['url']
        
        # Fetch content using appropriate API
        content_data = content_analyzer.fetch_social_media_content(url)
        
        # Analyze texts and images in parallel
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            future_to_text = {executor.submit(content_analyzer.analyze_text, text): text 
                             for text in content_data['texts']}
            future_to_image = {executor.submit(content_analyzer.analyze_image, img_url): img_url 
                              for img_url in content_data['image_urls']}
            
            text_analyses = [future.result() for future in concurrent.futures.as_completed(future_to_text)]
            image_analyses = [future.result() for future in concurrent.futures.as_completed(future_to_image)]
        
        # Generate report
        report = content_analyzer.generate_report(url, content_data, text_analyses, image_analyses)
        
        return jsonify(report)
    
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)