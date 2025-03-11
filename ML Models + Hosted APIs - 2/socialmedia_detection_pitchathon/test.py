import requests
import json
import time

def test_api():
    url = 'http://localhost:5000/analyze'
    
    test_urls = [
        "https://twitter.com/elonmusk",
        "https://www.instagram.com/google/"
    ]
    
    for test_url in test_urls:
        print(f"\nTesting URL: {test_url}")
        
        try:
            response = requests.post(url, json={'url': test_url}, timeout=30)
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                
                print("\nSummary:")
                print(f"Platform: {result['summary']['platform']}")
                print(f"Username: {result['summary']['metadata']['username']}")
                print(f"Follower Count: {result['summary']['metadata']['follower_count']}")
                print(f"Safe Text Percentage: {result['summary']['safety_metrics']['safe_text_percentage']}%")
                print(f"Safe Image Percentage: {result['summary']['safety_metrics']['safe_image_percentage']}%")
                
                print(f"\nTexts Analyzed: {result['text_analysis']['total_texts']}")
                print(f"Images Analyzed: {result['image_analysis']['total_images']}")
                
                if result['text_analysis']['analyses']:
                    print("\nSample Text Analysis:")
                    sample_text = result['text_analysis']['analyses'][0]
                    print(f"Text: {sample_text['text']}")
                    print(f"Sentiment: {sample_text['sentiment']['label']}")
                
                filename = f"analysis_result_{result['summary']['platform']}.json"
                with open(filename, 'w') as f:
                    json.dump(result, f, indent=2)
                print(f"\nFull results saved to {filename}")
                
            else:
                print(f"Error: {response.json().get('error', 'Unknown error')}")
                
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
        except Exception as e:
            print(f"An error occurred: {str(e)}")
        
        time.sleep(2)

if __name__ == "__main__":
    test_api()