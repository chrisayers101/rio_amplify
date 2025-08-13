$Region = "ap-southeast-2"
$Profile = "aidev"
$AccountId = "029109261863"
$DomainName = "amplify-os-dev"
$Ip = (Invoke-RestMethod -Uri "https://checkip.amazonaws.com/").Trim()

$policy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Principal": { "AWS": "*" },
      "Action":"es:ESHttp*",
      "Resource":"arn:aws:es:${Region}:${AccountId}:domain/${DomainName}/*",
      "Condition": { "IpAddress": { "aws:SourceIp": [ "$Ip/32" ] } }
    }
  ]
}
"@

$tmp = New-TemporaryFile
$policy | Set-Content -Path $tmp -Encoding UTF8

aws opensearch update-domain-config --region $Region --profile $Profile --domain-name $DomainName --access-policies file://$tmp

Remove-Item $tmp -ErrorAction SilentlyContinue