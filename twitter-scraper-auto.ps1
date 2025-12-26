param(
    [string]$BearerToken = "",
    [string]$SearchQuery = "pressure69",
    [int]$MaxResults = 50
)

$BearerToken = $BearerToken -replace "%3D", "="
$headers = @{ 'Authorization' = "Bearer $BearerToken" }

# Function to check rate limit
function Get-RateLimit {
    try {
        Invoke-WebRequest -Uri "https://api.twitter.com/2/tweets/search/recent?query=test&max_results=1" `
            -Headers $headers -Method Get -ErrorAction Stop | Out-Null
        return @{ Ready = $true }
    } catch {
        $resetTime = $_.Exception.Response.Headers['x-rate-limit-reset']
        $remaining = $_.Exception.Response.Headers['x-rate-limit-remaining']
        
        if ($resetTime) {
            $resetDate = (Get-Date -Date "01/01/1970").AddSeconds([int]$resetTime)
            $waitSeconds = ([DateTime]::Now - $resetDate).TotalSeconds * -1
            return @{ Ready = $false; WaitSeconds = $waitSeconds; ResetDate = $resetDate }
        }
        return @{ Ready = $false; WaitSeconds = 0 }
    }
}

# Check rate limit
Write-Host "🔍 Checking rate limit status..." -ForegroundColor Cyan
$rateLimit = Get-RateLimit

if ($rateLimit.Ready) {
    Write-Host "✅ Ready to search!" -ForegroundColor Green
} else {
    $waitMinutes = [Math]::Round($rateLimit.WaitSeconds / 60)
    $waitSeconds = [Math]::Round($rateLimit.WaitSeconds)
    
    Write-Host "⏳ Rate limited. Waiting $waitSeconds seconds (~$waitMinutes minutes)..." -ForegroundColor Yellow
    Write-Host "   Reset at: $($rateLimit.ResetDate.ToString('hh:mm:ss tt'))" -ForegroundColor Cyan
    
    # Wait
    for ($i = $waitSeconds; $i -gt 0; $i--) {
        Write-Progress -Activity "Waiting for rate limit reset" -Status "$i seconds remaining" -PercentComplete (($waitSeconds - $i) / $waitSeconds * 100)
        Start-Sleep -Seconds 1
    }
    
    Write-Host "✅ Rate limit reset! Starting search..." -ForegroundColor Green
}

# Now do the actual search
$query = [Uri]::EscapeDataString("$SearchQuery has:video -is:retweet")
$maxResults = [Math]::Min($MaxResults, 100)

Write-Host "`n🔥 TWITTER API V2 SCRAPER" -ForegroundColor Red
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
Write-Host "🔍 Query: $SearchQuery has:video" -ForegroundColor Cyan
Write-Host "📊 Max: $maxResults`n" -ForegroundColor Cyan

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
                Text = $tweet.text.Substring(0, [Math]::Min(80, $tweet.text.Length))
                CreatedAt = $tweet.created_at
                Likes = $tweet.public_metrics.like_count
                Retweets = $tweet.public_metrics.retweet_count
                Followers = $author.public_metrics.followers_count
                URL = "https://twitter.com/$($author.username)/status/$($tweet.id)"
            }
            
            Write-Host "✓ @$($author.username) | ❤️ $($tweet.public_metrics.like_count) | 🔄 $($tweet.public_metrics.retweet_count)" -ForegroundColor Green
        }
        
        Write-Host ""
        $results | Format-Table -AutoSize
        
        $csvPath = "$env:USERPROFILE\Desktop\pressure69-videos.csv"
        $results | Export-Csv -Path $csvPath -NoTypeInformation
        Write-Host "`n✅ Exported to: $csvPath" -ForegroundColor Cyan
        Write-Host "📊 Saved $($results.Count) videos" -ForegroundColor Green
        
    } else {
        Write-Host "⚠️ No videos found" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
}
