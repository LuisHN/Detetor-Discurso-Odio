from googleapiclient.discovery import build
import calendar;
import time;

  
api_key = ''
  
def video_comments(video_id):
    # empty list for storing reply
    replies = []
    toFile = ""
  
    # creating youtube resource object
    youtube = build('youtube', 'v3',
                    developerKey=api_key)
  
    # retrieve youtube video results
    video_response=youtube.commentThreads().list(
    part='snippet,replies',
    videoId=video_id
    ).execute()
  
    # iterate video response
    while video_response:
        
        # extracting required info
        # from each result object 
        for item in video_response['items']:
            
            # Extracting comments
            comment = item['snippet']['topLevelComment']['snippet']['textDisplay']
              
            # counting number of reply of comment
            replycount = item['snippet']['totalReplyCount']
  
            # if reply is there
            if replycount>0:
                
                # iterate through all reply
                for reply in item['replies']['comments']:
                    
                    # Extract reply
                    reply = reply['snippet']['textDisplay']
                      
                    # Store reply is list
                    replies.append(reply)
  
            # print comment with list of reply
            print(comment, replies, end = '\n\n')
            f = open("outputs/"+ video_id +"_"+ ts +".txt", "a")
            f.write(comment)
            f.write("\n")
            f.writelines(list( "%s\n" % item for item in replies))
            f.close()
        
            # empty reply list
            replies = []
  
        # Again repeat
        if 'nextPageToken' in video_response:
            video_response = youtube.commentThreads().list(
                    part = 'snippet,replies',
                    videoId = video_id
                ).execute()
        else:
            break
    
   
ts = str(calendar.timegm(time.gmtime()))
# Enter video id
video_id = "R1gUkBVAA28"
  
# Call function
video_comments(video_id)