param(
    [string]$BearerToken = "",
    [string]$SearchQuery = "pressure69",
    [int]$MaxResults = 50
)

# Decode URL-encoded token
$BearerToken = $BearerToken -replace "%3D", "="

Write-Host "🔥 TWITTER API V2 SCRAPER" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red

$headers = @{
    'Authorization' = "Bearer $BearerToken"
}

# Build query
$query = [Uri]::EscapeDataString("$SearchQuery has:video -is:retweet")
$maxResults = [Math]::Min($MaxResults, 100)

Write-Host "🔍 Query: $SearchQuery has:video" -ForegroundColor Cyan
Write-Host "📊 Max: $maxResults`n" -ForegroundColor Cyan

# GET request with query parameters
$url = "https://api.twitter.com/2/tweets/search/recent?query=$query&max_results=$maxResults&tweet.fields=created_at,public_metrics,author_id&expansions=author_id,attachments.media_keys&media.fields=type,url&user.fields=username,public_metrics,verified"

try {
    Write-Host "⚡ Fetching..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get -TimeoutSec 10
    
    if ($response.data -and $response.data.Count -gt 0) {
        Write-Host "✅ Found $($response.data.Count) videos!`n" -ForegroundColor Green
        
        $results = @()
        
        $userMap = @{}
        if ($response.includes.users) {
            foreach ($user in $response.includes.users) {
                $userMap[$user.id] = $user
            }
        }
        
        foreach ($tweet in $response.data) {
            $author = $userMap[$tweet.author_id]
            
            $results += [PSCustomObject]@{
                Author = $author.username
                Verified = $author.verified
                Text = $tweet.text
                CreatedAt = $tweet.created_at
                Likes = $tweet.public_metrics.like_count
                Retweets = $tweet.public_metrics.retweet_count
                Followers = $author.public_metrics.followers_count
                URL = "https://twitter.com/$($author.username)/status/$($tweet.id)"
            }
            
            Write-Host "✓ @$($author.username) | $($tweet.public_metrics.like_count) likes | $($tweet.public_metrics.retweet_count) RT" -ForegroundColor Green
        }
        
        $results | Format-Table -AutoSize
        $results | Export-Csv -Path "$env:TEMP\twitter-videos.csv" -NoTypeInformation
        Write-Host "`n✅ Exported to: $env:TEMP\twitter-videos.csv" -ForegroundColor Cyan
        
    } else {
        Write-Host "⚠️ No videos found" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}
