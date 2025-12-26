param(
    [string]$BearerToken = "AAAAAAAAAAAAAAAAAAAAAD7m6QEAAAAAoTqXA1tiljUDUjqz0EEG9L1EWHI%3DNtynTR3UTKOCt2EoJnQQkYGTnZLmHXPcU5SUFVxSXmHr1KZ1Wt",
    [string]$SearchQuery = "pressure69",
    [int]$MaxResults = 100,
    [string]$OutputFile = "$env:TEMP\twitter-videos.csv",
    [switch]$VideoOnly = $true,
    [switch]$Aggressive = $true
)

if ([string]::IsNullOrEmpty($BearerToken)) {
    Write-Host "❌ BEARER TOKEN REQUIRED!" -ForegroundColor Red
    Write-Host "Usage: .\twitter-api-v2-scraper.ps1 -BearerToken 'YOUR_TOKEN' -SearchQuery 'pressure69'" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    'Authorization' = "Bearer $BearerToken"
    'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}

Write-Host "🔥 AGGRESSIVE TWITTER API V2 SCRAPER" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red

function Get-TwitterVideos {
    param([string]$Query, [int]$MaxResults, [hashtable]$Headers)
    
    $results = @()
    
    if ($VideoOnly) {
        $query = "$Query has:video -is:retweet lang:en"
    } else {
        $query = "$Query -is:retweet lang:en"
    }
    
    Write-Host "🔍 SEARCH QUERY: $query" -ForegroundColor Cyan
    Write-Host "📊 MAX RESULTS: $MaxResults`n" -ForegroundColor Cyan
    
    $url = "https://api.twitter.com/2/tweets/search/recent"
    
    $params = @{
        'query' = $query
        'max_results' = [Math]::Min($MaxResults, 100)
        'tweet.fields' = 'created_at,public_metrics,author_id,possibly_sensitive'
        'expansions' = 'author_id,attachments.media_keys'
        'media.fields' = 'type,public_metrics,url,preview_image_url'
        'user.fields' = 'username,public_metrics,verified'
    }
    
    $queryString = ($params.GetEnumerator() | ForEach-Object { "$($_.Key)=$([Uri]::EscapeDataString($_.Value))" }) -join '&'
    $fullUrl = "$url`?$queryString"
    
    try {
        Write-Host "⚡ FETCHING FROM API..." -ForegroundColor Yellow
        $response = Invoke-RestMethod -Uri $fullUrl -Headers $headers -Method Get -TimeoutSec 30
        
        if ($response.data) {
            Write-Host "✅ Found $($response.data.Count) tweets`n" -ForegroundColor Green
            
            $includes = @{}
            if ($response.includes.media) {
                foreach ($media in $response.includes.media) {
                    $includes[$media.media_key] = $media
                }
            }
            
            $userMap = @{}
            if ($response.includes.users) {
                foreach ($user in $response.includes.users) {
                    $userMap[$user.id] = $user
                }
            }
            
            foreach ($tweet in $response.data) {
                $author = $userMap[$tweet.author_id]
                $videoUrls = @()
                
                if ($tweet.attachments.media_keys) {
                    foreach ($mediaKey in $tweet.attachments.media_keys) {
                        $media = $includes[$mediaKey]
                        if ($media.type -eq 'video') {
                            $videoUrls += $media.url
                        }
                    }
                }
                
                $results += [PSCustomObject]@{
                    TweetId = $tweet.id
                    Text = $tweet.text
                    Author = $author.username
                    VerifiedAuthor = $author.verified
                    CreatedAt = $tweet.created_at
                    VideoURLs = ($videoUrls -join '; ')
                    Likes = $tweet.public_metrics.like_count
                    Retweets = $tweet.public_metrics.retweet_count
                    Replies = $tweet.public_metrics.reply_count
                    AuthorFollowers = $author.public_metrics.followers_count
                    TweetURL = "https://twitter.com/$($author.username)/status/$($tweet.id)"
                }
                
                Write-Host "  ✓ @$($author.username): $($tweet.text.Substring(0, [Math]::Min(50, $tweet.text.Length)))..." -ForegroundColor Green
            }
        } else {
            Write-Host "⚠️ No tweets found matching query" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ API ERROR: $_" -ForegroundColor Red
        Write-Host "Check your bearer token and API access" -ForegroundColor Yellow
    }
    
    return $results
}

$videos = Get-TwitterVideos -Query $SearchQuery -MaxResults $MaxResults -Headers $headers

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
if ($videos.Count -gt 0) {
    $videos | Export-Csv -Path $OutputFile -NoTypeInformation -Encoding UTF8
    
    Write-Host "✅ SCRAPE COMPLETE!" -ForegroundColor Green
    Write-Host "📊 RESULTS: $($videos.Count) videos found" -ForegroundColor Cyan
    Write-Host "📁 EXPORTED TO: $OutputFile`n" -ForegroundColor Cyan
    
    $videos | Format-Table -AutoSize
    
    Write-Host "`n📈 SUMMARY STATISTICS:" -ForegroundColor Yellow
    Write-Host "  Total Videos: $($videos.Count)" -ForegroundColor Cyan
    Write-Host "  Total Likes: $($videos | Measure-Object -Property Likes -Sum | Select-Object -ExpandProperty Sum)" -ForegroundColor Cyan
    Write-Host "  Total Retweets: $($videos | Measure-Object -Property Retweets -Sum | Select-Object -ExpandProperty Sum)" -ForegroundColor Cyan
    
} else {
    Write-Host "❌ NO VIDEOS FOUND" -ForegroundColor Red
}
