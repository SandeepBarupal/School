$root = Get-Location
$prefix = "http://localhost:8000/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $root at $prefix"
while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $urlPath = $req.Url.AbsolutePath.TrimStart('/')
  if ($urlPath -eq "") { $urlPath = "index.html" }
  $filePath = Join-Path $root $urlPath
  if (Test-Path $filePath) {
    try {
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $mime = switch ($ext) {
        ".html" { "text/html" }
        ".css" { "text/css" }
        ".js" { "application/javascript" }
        ".png" { "image/png" }
        ".jpg" { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".svg" { "image/svg+xml" }
        default { "application/octet-stream" }
      }
      $context.Response.ContentType = $mime
      $context.Response.ContentLength64 = $bytes.Length
      $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
    } catch {
      $context.Response.StatusCode = 500
      $err = [System.Text.Encoding]::UTF8.GetBytes("Server error")
      $context.Response.OutputStream.Write($err,0,$err.Length)
    }
  } else {
    $context.Response.StatusCode = 404
    $resp = [System.Text.Encoding]::UTF8.GetBytes("Not found")
    $context.Response.OutputStream.Write($resp,0,$resp.Length)
  }
  $context.Response.OutputStream.Close()
}
